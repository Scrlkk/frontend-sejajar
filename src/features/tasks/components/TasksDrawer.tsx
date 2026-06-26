import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Calendar,
  Trash2,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  History as HistoryIcon,
  Loader2,
  AlertTriangle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackComment } from "@/features/reviews/components/FeedbackComment";
import type {
  TaskBoardItem,
  TaskCommentItem,
} from "@/features/tasks/components/TasksContent";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";
import { TypeTasks } from "@/features/pillars/components/TypeTasks";
import { FormatBadgeContent } from "@/features/pillars/components/FormatBadgeContent";
import {
  getTaskOutputsApi,
  deleteTaskOutputApi,
} from "@/features/tasks/api/taskOutputsApi";
import {
  getTaskCommentsApi,
  createTaskCommentApi,
} from "@/features/tasks/api/taskCommentsApi";
import {
  updateTaskApi,
  getTasksApi,
  getTaskByIdApi,
} from "@/features/tasks/api/tasksApi";
import { getInitialsAndBg, formatCommentTimestamp } from "@/utils/formatter";
import { downloadFile, formatDateEN, formatDate } from "@/utils/helpers";
import { ContentPlanPreviewCard } from "@/features/contents/components/ContentPlanPreviewCard";
import {
  getContentByIdApi,
  mapContentToCardItem,
} from "@/features/contents/api/contentsApi";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { useRateLimit } from "@/hooks/useRateLimit";
import toast from "react-hot-toast";

interface TasksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskBoardItem | null;
}

export function TasksDrawer({ isOpen, onClose, task }: TasksDrawerProps) {
  const queryClient = useQueryClient();
  const { roles } = usePermissions();
  const { user } = useAuth();
  const isLeadOrOwner =
    roles.includes("content_lead") ||
    roles.includes("owner") ||
    roles.includes("superadmin");

  // Derive taskId before hooks (safe: 0 when task is null, guarded by enabled)
  const taskId = Number(task?.id ?? 0);
  const contentId = Number(task?.content_id ?? 0);

  // Local status state, synced from prop on mount via key
  const [status, setStatus] = useState<TaskBoardItem["status"]>(
    () => task?.status ?? "to_do",
  );
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(
    null,
  );

  // --- Live task detail query ---
  const { data: taskDetail } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskByIdApi(taskId),
    enabled: isOpen && !!task && taskId > 0,
  });

  const isApproved = useMemo(() => {
    return (
      status.toLowerCase() === "approved" ||
      taskDetail?.status?.toLowerCase() === "approved" ||
      task?.status?.toLowerCase() === "approved"
    );
  }, [status, taskDetail?.status, task?.status]);

  const isAssignee = useMemo(() => {
    return taskDetail?.assigned_to === Number(user?.id);
  }, [taskDetail?.assigned_to, user?.id]);

  const canDelete = useMemo(() => {
    return isLeadOrOwner || (isAssignee && !isApproved);
  }, [isLeadOrOwner, isAssignee, isApproved]);
  const [hasCommentedThisSession, setHasCommentedThisSession] = useState(false);

  const { isRateLimited, retryAfter, reset } = useRateLimit();

  // --- Live comments query ---
  const {
    data: apiComments = [],
    isLoading: loadingComments,
    refetch,
  } = useQuery({
    queryKey: ["task-comments", taskId],
    queryFn: () => getTaskCommentsApi(taskId),
    enabled: isOpen && !!task && taskId > 0,
    refetchInterval: isRateLimited ? false : 3000,
  });

  // --- Live outputs query ---
  const { data: taskOutputsData, isLoading: loadingOutputs } = useQuery({
    queryKey: ["task-outputs", taskId],
    queryFn: () => getTaskOutputsApi(taskId),
    enabled: isOpen && !!task && taskId > 0,
  });

  const taskOutputs = useMemo(() => taskOutputsData || [], [taskOutputsData]);

  const deliverables = useMemo(() => {
    if (taskOutputs.length === 0) return [];
    return [taskOutputs[0]];
  }, [taskOutputs]);

  const history = useMemo(() => {
    if (taskOutputs.length <= 1) return [];
    return taskOutputs.slice(1);
  }, [taskOutputs]);

  const isCaptionTask = useMemo(() => {
    return task?.type === "Caption";
  }, [task]);

  const canSeeHistory = useMemo(() => {
    if (!isCaptionTask) return true;
    if (!taskDetail) return false;

    const currentUserId = Number(user?.id);
    const isOwnerOrAdmin = ["superadmin", "owner"].includes(user?.role || "");
    const isAssignedLead = Number(taskDetail.lead_id) === currentUserId;
    const isTaskAssignee = Number(taskDetail.assigned_to) === currentUserId;

    return isOwnerOrAdmin || isAssignedLead || isTaskAssignee;
  }, [isCaptionTask, taskDetail, user]);

  const drawerCaptionText = useMemo(() => {
    if (taskOutputs.length > 0) {
      return taskOutputs[0].caption || "";
    }
    return "";
  }, [taskOutputs]);

  // --- Live content detail query ---
  const { data: contentDetail } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentByIdApi(contentId),
    enabled: isOpen && !!task && contentId > 0,
  });

  // Helper to resolve absolute upload file URLs
  const getFileUrl = (url?: string | null) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    let apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    if (apiBase.endsWith("/api")) {
      apiBase = apiBase.substring(0, apiBase.length - 4);
    }
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${apiBase}${path}`;
  };

  // --- Live outputs of other tasks under the same content ---
  const { data: otherTasksOutputs = [], isLoading: loadingOtherOutputs } =
    useQuery({
      queryKey: ["sibling-task-outputs", contentId, taskId],
      queryFn: async () => {
        // 1. Get all tasks for this content plan
        const tasksList = await getTasksApi({ content_id: contentId });

        // 2. Filter to only other tasks (exclude the current task)
        const otherTasks = tasksList.filter((t) => Number(t.id) !== taskId);
        if (otherTasks.length === 0) return [];

        // 3. For each task, fetch its outputs and append assignee details
        const outputsPromises = otherTasks.map(async (t) => {
          try {
            const outputs = await getTaskOutputsApi(Number(t.id));
            if (outputs.length === 0) return [];
            // Only get the latest version (first element)
            const latest = outputs[0];
            return [
              {
                ...latest,
                assignee_name: t.assignee_name,
                task_title: t.title,
                assignee_role: t.assignee_roles?.[0] || "Creator",
              },
            ];
          } catch {
            return [];
          }
        });

        const results = await Promise.all(outputsPromises);
        return results.flat();
      },
      enabled: isOpen && !!task && contentId > 0,
    });

  // --- Mutations ---
  const addCommentMutation = useMutation({
    mutationFn: (message: string) =>
      createTaskCommentApi({ task_id: taskId, message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-comments", taskId] });
      setHasCommentedThisSession(true);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) =>
      updateTaskApi(taskId, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteOutputMutation = useMutation({
    mutationFn: (id: number) => deleteTaskOutputApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["all-task-outputs"] });
      queryClient.invalidateQueries({ queryKey: ["task-outputs", taskId] });
      queryClient.invalidateQueries({ queryKey: ["task-detail", taskId] });
      setDeleteConfirmIndex(null);
    },
  });

  // Early return AFTER all hooks
  if (!task) return null;

  // Map API comments → TaskCommentItem
  const comments: TaskCommentItem[] = apiComments.map((c) => {
    const isSystem = c.user_name === "SYSTEM" || c.user_id === null;
    const isMe = !isSystem && !!user && Number(c.user_id) === Number(user.id);
    const { initials, avatarBg } = getInitialsAndBg(c.user_name ?? "");
    return {
      id: String(c.id),
      sender: c.user_name || "SYSTEM",
      senderInitials: isSystem ? "SYS" : initials,
      senderBg: isSystem ? "bg-slate-800 text-slate-100" : avatarBg,
      text: c.message,
      timestamp: formatCommentTimestamp(c.created_at),
      isSystem,
      isMe,
    };
  });

  const handleAddComment = (text: string) => {
    addCommentMutation.mutate(text);
  };

  const handleConfirmStatus = () => {
    if (
      status === "revision" &&
      task.status !== "revision" &&
      !hasCommentedThisSession
    ) {
      toast.error(
        "Wajib memberikan feedback terlebih dahulu sebelum meminta revisi.",
      );
      return;
    }
    if (status !== task.status) {
      updateStatusMutation.mutate(status);
    }
    onClose();
  };

  const isTransitionAllowed = (
    from: TaskBoardItem["status"],
    to: TaskBoardItem["status"],
  ) => {
    if (from === to) return true;

    if (isLeadOrOwner) {
      return to === "revision" || to === "approved";
    }

    // Staff/Pegawai
    switch (from) {
      case "to_do":
        return to === "on_progress";
      case "on_progress":
        return to === "pending";
      case "revision":
        return to === "on_progress" || to === "pending";
      default:
        return false;
    }
  };

  const statuses: {
    key: TaskBoardItem["status"];
    label: string;
    dotBg: string;
    activeClass: string;
    inactiveClass: string;
  }[] = [
    {
      key: "to_do",
      label: "To Do",
      dotBg: "bg-slate-400",
      activeClass:
        "bg-slate-50 border-slate-400 text-slate-800 ring-1 ring-slate-400/50 shadow-sm",
      inactiveClass:
        "bg-white border-gray-200 text-gray-400 hover:bg-slate-50/80 cursor-pointer",
    },
    {
      key: "on_progress",
      label: "On Progress",
      dotBg: "bg-amber-500",
      activeClass:
        "bg-amber-50 border-amber-400 text-amber-800 ring-1 ring-amber-400/50 shadow-sm",
      inactiveClass:
        "bg-white border-amber-100 text-amber-600 hover:bg-amber-50/30 cursor-pointer",
    },
    {
      key: "pending",
      label: "Review",
      dotBg: "bg-purple-500",
      activeClass:
        "bg-purple-50 border-purple-400 text-purple-800 ring-1 ring-purple-400/50 shadow-sm",
      inactiveClass:
        "bg-white border-purple-100 text-purple-600 hover:bg-purple-50/30 cursor-pointer",
    },
    {
      key: "revision",
      label: "Revision",
      dotBg: "bg-red-500",
      activeClass:
        "bg-red-50 border-red-400 text-red-800 ring-1 ring-red-400/50 shadow-sm",
      inactiveClass:
        "bg-white border-red-100 text-red-600 hover:bg-red-50/30 cursor-pointer",
    },
    {
      key: "approved",
      label: "Approved",
      dotBg: "bg-emerald-500",
      activeClass:
        "bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500/50 shadow-sm",
      inactiveClass:
        "bg-white border-emerald-100 text-emerald-600 hover:bg-emerald-50/30 cursor-pointer",
    },
  ];

  const isMutating = updateStatusMutation.isPending;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="sm:max-w-lg bg-white border-l border-gray-200 shadow-2xl flex flex-col h-screen p-0 outline-none"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-gray-100 shadow-md flex items-center justify-between shrink-0 pr-12">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Task Workspace
            </span>
            <h2 className="text-lg font-semibold text-gray-900 leading-snug mt-0.5 max-w-88 line-clamp-2">
              {task.title}
            </h2>
          </div>
        </div>

        {/* Drawer Body Scroll Container */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4.5 scrollbar-none">
          {/* Related Content Preview */}
          {contentDetail && (
            <div className="pt-4">
              <ContentPlanPreviewCard
                card={mapContentToCardItem(contentDetail)}
              />
            </div>
          )}

          {/* Task Description */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Task Description
            </span>
            <p className="text-xs text-gray-600 leading-relaxed bg-slate-50/50 border border-gray-200 p-3.5 rounded-xl font-medium">
              {task.description ||
                `Task details specifically defined for ${task.assignee}. Complete the assigned activity based on priority guidelines.`}
            </p>
          </div>

          {/* Badges Section */}
          <div className="flex flex-wrap gap-2">
            {contentDetail?.pillars && contentDetail.pillars.length > 0 ? (
              contentDetail.pillars.map((p) => (
                <PillarsCard
                  key={p.id}
                  category={p.pillar_name}
                  categoryId={p.id}
                  colorKey={p.color_key}
                />
              ))
            ) : task.pillars && task.pillars.length > 0 ? (
              task.pillars.map((p) => (
                <PillarsCard
                  key={p.id}
                  category={p.pillar_name}
                  categoryId={p.id}
                  colorKey={p.color_key}
                />
              ))
            ) : (
              task.pillar && <PillarsCard category={task.pillar} />
            )}
            <PillarsCard category={task.category || "General"} />
            <TypeTasks type={task.type} />
            {contentDetail?.format && (
              <FormatBadgeContent format={contentDetail.format} />
            )}
          </div>

          {/* Task Status Selector */}
          <div className="space-y-3">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
              Task Status Selector
            </span>
            <div className="space-y-2">
              {/* 2 columns row for To Do and On Progress */}
              <div className="grid grid-cols-2 gap-2.5">
                {statuses.slice(0, 2).map((st) => {
                  const isSelected = status === st.key;
                  const isAllowed = isTransitionAllowed(task.status, st.key);
                  return (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => setStatus(st.key)}
                      disabled={!isAllowed}
                      className={`rounded-xl border py-2.5 px-4 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected ? st.activeClass : st.inactiveClass
                      } disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-50/30 disabled:border-slate-150 disabled:text-slate-350`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${st.dotBg}`}
                      />
                      {st.label}
                    </button>
                  );
                })}
              </div>

              {/* 2 columns row for Pending and Revision */}
              <div className="grid grid-cols-2 gap-2.5">
                {statuses.slice(2, 4).map((st) => {
                  const isSelected = status === st.key;
                  const isAllowed = isTransitionAllowed(task.status, st.key);
                  return (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => setStatus(st.key)}
                      disabled={!isAllowed}
                      className={`rounded-xl border py-2.5 px-4 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected ? st.activeClass : st.inactiveClass
                      } disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-50/30 disabled:border-slate-150 disabled:text-slate-355`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${st.dotBg}`}
                      />
                      {st.label}
                    </button>
                  );
                })}
              </div>

              {/* Full width Approved */}
              <div>
                {statuses.slice(4).map((st) => {
                  const isSelected = status === st.key;
                  const isAllowed = isTransitionAllowed(task.status, st.key);
                  return (
                    <div
                      key={st.key}
                      className="w-full flex items-center justify-center"
                    >
                      <button
                        type="button"
                        onClick={() => setStatus(st.key)}
                        disabled={!isAllowed}
                        className={`w-56 rounded-xl border py-2.5 px-4 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isSelected ? st.activeClass : st.inactiveClass
                        } disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-50/30 disabled:border-slate-150 disabled:text-slate-355`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${st.dotBg}`}
                        />
                        {st.label}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            {status === "revision" &&
              task.status !== "revision" &&
              !hasCommentedThisSession && (
                <p className="text-[10px] font-semibold text-red-600 mt-2">
                  * Wajib menuliskan feedback revisi di kolom komentar di bawah
                  terlebih dahulu.
                </p>
              )}
          </div>

          {/* Deadline and Assigned To Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Deadline */}
            <div
              className={`p-3.5 rounded-xl border flex flex-col justify-between h-20 transition-colors shadow-sm ${
                task.isOverdue && status !== "approved"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-slate-50/30 border-gray-200 text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <div className="flex items-center gap-1.5">
                  <Calendar
                    className={`h-3.5 w-3.5 shrink-0 ${task.isOverdue && status !== "approved" ? "text-red-500" : "text-gray-400"}`}
                  />
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      task.isOverdue && status !== "approved"
                        ? "text-red-800"
                        : "text-gray-400"
                    }`}
                  >
                    Deadline
                  </span>
                </div>
                {task.isOverdue && status !== "approved" && (
                  <span className="text-[8px] font-extrabold tracking-wider bg-red-100 text-red-700 px-1 py-0.5 rounded-md uppercase shrink-0 border border-red-200/50 animate-pulse">
                    Overdue
                  </span>
                )}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-base font-bold">
                  {task.date ? formatDateEN(task.date) : "-"}
                </span>
              </div>
            </div>

            {/* Assigned To */}
            <div className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/30 flex flex-col justify-between h-20 shadow-sm">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                Assigned To
              </span>
              <div className="flex items-center gap-2.5 mt-1 min-w-0">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm border border-white ${task.assigneeBg}`}
                >
                  {task.assigneeInitials}
                </div>
                <div className="flex flex-col min-w-0 leading-tight">
                  <span
                    className="text-xs font-bold text-gray-800 truncate"
                    title={task.assignee}
                  >
                    {task.assignee}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold mt-0.5 truncate">
                    {task.role || "Creator"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Deliverables / Task Outputs Section */}
          {isCaptionTask ? (
            <div className="space-y-3">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                Caption Output
              </span>
              {loadingOutputs ? (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className={`w-full bg-slate-50 border border-gray-200 rounded-xl p-3.5 text-xs leading-relaxed font-medium whitespace-pre-wrap h-auto ${
                  drawerCaptionText ? "text-gray-700" : "text-gray-400"
                }`}>
                  {drawerCaptionText || "No caption written yet"}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Deliverables File
                </span>
              </div>{" "}
              {loadingOutputs ? (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : deliverables.length > 0 ? (
                <div className="space-y-2">
                  {deliverables.map((output) => {
                    const isVideo =
                      output.file_url?.endsWith(".mp4") ||
                      output.file_url?.toLowerCase().includes("video");
                    const isDoc =
                      output.file_url?.endsWith(".doc") ||
                      output.file_url?.endsWith(".docx") ||
                      output.file_url?.endsWith(".pdf") ||
                      output.file_url?.endsWith(".txt");
                    const filename =
                      output.file_url?.split("/").pop() ??
                      `output-${output.id}`;

                    const size =
                      output.file_size ||
                      (isDoc ? "1.2 MB" : isVideo ? "12.5 MB" : "3.4 MB");
                    const time =
                      output.submitted_at || output.created_at
                        ? formatDate(output.submitted_at || output.created_at)
                        : "Just now";

                    if (deleteConfirmIndex === 0) {
                      return (
                        <div
                          key={output.id}
                          className="flex flex-col border border-red-300 rounded-xl bg-red-100/40 p-3 space-y-2 shadow-sm transition-all duration-300"
                        >
                          <div className="flex items-center gap-2 text-red-800">
                            <Trash2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Hapus Deliverable?
                            </span>
                          </div>
                          <p className="text-[10px] text-red-600 leading-relaxed font-medium">
                            Apakah Anda yakin ingin menghapus file{" "}
                            <span className="font-bold">"{filename}"</span>?
                            Tindakan ini tidak dapat dibatalkan.
                          </p>
                          <div className="flex items-center justify-end gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmIndex(null)}
                              className="px-2.5 py-1 text-[10px] font-semibold border border-gray-250 bg-white hover:bg-slate-50 text-gray-750 rounded-md cursor-pointer transition-all shadow-sm"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              disabled={
                                deleteOutputMutation.isPending || !canDelete
                              }
                              onClick={() => {
                                if (canDelete) {
                                  deleteOutputMutation.mutate(output.id);
                                }
                              }}
                              className="px-2.5 py-1 text-[10px] font-semibold bg-red-700 hover:bg-red-logo text-white rounded-md cursor-pointer transition-all shadow-sm disabled:opacity-50"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={output.id}
                        className="flex flex-col border border-gray-300 rounded-xl bg-white p-3 space-y-1 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-gray-150">
                              {isDoc ? (
                                <FileText className="h-4 w-4 text-sky-600" />
                              ) : isVideo ? (
                                <VideoIcon className="h-4 w-4 text-violet-600" />
                              ) : (
                                <ImageIcon className="h-4 w-4 text-indigo-600" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <a
                                href={getFileUrl(output.file_url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-gray-800 truncate hover:underline hover:text-red-logo block"
                              >
                                {output.caption || filename}
                              </a>
                              <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                                V{output.version || taskOutputs.length} • {size}{" "}
                                • {time}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => downloadFile(getFileUrl(output.file_url), filename)}
                              className="h-7 w-7 rounded-lg hover:bg-slate-100 text-gray-400 hover:text-gray-650 flex items-center justify-center transition-colors cursor-pointer"
                              title="Download file"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={!canDelete}
                              onClick={() => setDeleteConfirmIndex(0)}
                              className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-xl bg-slate-50/10 text-center">
                  <div className="h-10 w-10 rounded-full bg-slate-50 border border-gray-150 flex items-center justify-center text-gray-400 shadow-sm mb-3">
                    <VideoIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-xs font-semibold text-gray-600">
                    No deliverables attached
                  </p>
                  <p className="text-[9px] text-gray-400 mt-1 max-w-60 leading-relaxed">
                    This task does not have any deliverables marked as complete.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* History Log Section */}
          {canSeeHistory && history.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-gray-400">
                <HistoryIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-wider block">
                  {isCaptionTask
                    ? "Caption History"
                    : "Revisions & Upload History"}
                </span>
              </div>
              <div className="space-y-2">
                {isCaptionTask
                  ? history.slice(1).map((hist, idx) => {
                      const time =
                        hist.submitted_at || hist.created_at
                          ? formatDate(hist.submitted_at || hist.created_at)
                          : "3 days ago";
                      return (
                        <div
                          key={hist.id ?? idx}
                          className="flex flex-col border border-gray-200 rounded-xl bg-slate-50/40 p-3 space-y-2 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center border border-gray-150 text-gray-500 text-[10px] font-bold">
                                V{hist.version || taskOutputs.length - idx}
                              </div>
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                Version{" "}
                                {hist.version || taskOutputs.length - idx}
                              </span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-medium">
                              {time}
                            </span>
                          </div>
                          <div className="w-full bg-white border border-gray-150 rounded-lg p-2.5 text-xs text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                            {hist.caption || "Tidak ada teks caption"}
                          </div>
                        </div>
                      );
                    })
                  : history.map((hist) => {
                      const isVideo =
                        hist.file_url?.endsWith(".mp4") ||
                        hist.file_url?.toLowerCase().includes("video");
                      const isDoc =
                        hist.file_url?.endsWith(".doc") ||
                        hist.file_url?.endsWith(".docx") ||
                        hist.file_url?.endsWith(".pdf") ||
                        hist.file_url?.endsWith(".txt");
                      const filename =
                        hist.file_url?.split("/").pop() ?? `output-${hist.id}`;

                      const size =
                        hist.file_size ||
                        (isDoc ? "1.2 MB" : isVideo ? "12.5 MB" : "3.4 MB");
                      const time =
                        hist.submitted_at || hist.created_at
                          ? formatDate(hist.submitted_at || hist.created_at)
                          : "3 days ago";

                      return (
                        <div
                          key={hist.id}
                          className="flex items-center justify-between border border-gray-250 rounded-xl bg-slate-50/40 p-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shrink-0 border border-gray-150 mt-0.5">
                              {isDoc ? (
                                <FileText className="h-4 w-4 text-sky-600" />
                              ) : isVideo ? (
                                <VideoIcon className="h-4 w-4 text-violet-600" />
                              ) : (
                                <ImageIcon className="h-4 w-4 text-indigo-600" />
                              )}
                            </div>
                            <div className="min-w-0 leading-tight">
                              <a
                                href={getFileUrl(hist.file_url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-gray-800 hover:underline hover:text-red-logo block truncate"
                                title={hist.caption || filename}
                              >
                                {hist.caption || filename}
                              </a>
                              <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                                V{hist.version} • {size} • {time}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => downloadFile(getFileUrl(hist.file_url), filename)}
                            className="h-7 w-7 rounded-lg hover:bg-white text-gray-400 hover:text-gray-650 flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-transparent hover:border-gray-150 shadow-2xs"
                            title="Download file"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
              </div>
            </div>
          )}

          {/* Sibling Tasks Deliverables (Other Team Members) */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
              Deliverables Other Tasks
            </span>

            {loadingOtherOutputs ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : otherTasksOutputs.length > 0 ? (
              <div className="space-y-2">
                {otherTasksOutputs.map((output) => {
                  const isSosmed =
                    output.assignee_role === "admin_social_media";
                  const isVideo =
                    output.file_url?.endsWith(".mp4") ||
                    output.file_url?.toLowerCase().includes("video");
                  const isDoc =
                    output.file_url?.endsWith(".doc") ||
                    output.file_url?.endsWith(".docx") ||
                    output.file_url?.endsWith(".pdf") ||
                    output.file_url?.endsWith(".txt");
                  const filename =
                    output.file_url?.split("/").pop() ?? `output-${output.id}`;

                  const size =
                    output.file_size ||
                    (isDoc ? "1.2 MB" : isVideo ? "12.5 MB" : "3.4 MB");
                  const time =
                    output.submitted_at || output.created_at
                      ? formatDate(output.submitted_at || output.created_at)
                      : "Just now";

                  /* ── Card khusus Admin Sosmed (caption/teks saja) ── */
                  if (isSosmed) {
                    return (
                      <div
                        key={output.id}
                        className="flex flex-col border border-indigo-100 rounded-xl bg-indigo-50/40 p-3 space-y-2 shadow-sm"
                      >
                        {/* Header versi + tanggal */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider">
                              Caption Publish
                            </span>
                          </div>
                          <span className="text-[9px] text-gray-400 font-medium">
                            V{output.version || 1} • {time}
                          </span>
                        </div>

                        {/* Isi teks caption */}
                        <div className="w-full bg-white border border-indigo-100 rounded-lg p-2.5 text-xs text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                          {output.caption || "Tidak ada teks caption"}
                        </div>

                        {/* Footer: Oleh + Tugas */}
                        <div className="border-t border-indigo-100 pt-1.5 flex flex-col gap-0.5">
                          <p className="text-[10px] text-gray-500 font-medium truncate">
                            Oleh:{" "}
                            <span className="font-semibold text-gray-700">
                              {output.assignee_name}
                            </span>
                            <span className="text-gray-300 mx-1 select-none">•</span>
                            {output.assignee_role
                              ?.replace(/_/g, " ")
                              .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                          </p>
                          <p className="text-[9px] text-gray-400 font-medium truncate">
                            Tugas: "{output.task_title}"
                          </p>
                        </div>
                      </div>
                    );
                  }

                  /* ── Card default (file/deliverable) ── */
                  return (
                    <div
                      key={output.id}
                      className="flex flex-col border border-gray-300 rounded-xl bg-white p-3 space-y-2.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-gray-150">
                            {isDoc ? (
                              <FileText className="h-4 w-4 text-sky-600" />
                            ) : isVideo ? (
                              <VideoIcon className="h-4 w-4 text-violet-600" />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-indigo-600" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <a
                              href={getFileUrl(output.file_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-gray-800 truncate hover:underline hover:text-red-logo block"
                            >
                              {output.caption || filename}
                            </a>
                            <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                              V{output.version || 1} • {size} • {time}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => downloadFile(getFileUrl(output.file_url), filename)}
                          className="h-7 w-7 rounded-lg hover:bg-slate-100 text-gray-400 hover:text-gray-650 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          title="Download file"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="border-t border-gray-100 pt-2 flex flex-col gap-1">
                        <p className="text-[10px] text-gray-500 font-medium truncate">
                          Oleh:{" "}
                          <span className="font-semibold text-gray-700">
                            {output.assignee_name}
                          </span>
                          <span className="text-gray-300 mx-1 select-none">•</span>
                          {output.assignee_role
                            ?.replace(/_/g, " ")
                            .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                        </p>
                        <p className="text-[9px] text-gray-400 font-medium truncate">
                          Tugas: "{output.task_title}"
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 font-medium py-1">
                No deliverables from other team members for this content yet.
              </p>
            )}
          </div>

          {/* Comments Thread Section */}
          <div className="space-y-2 pb-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
              Feedback Comments Thread
            </span>
            {isRateLimited && (
              <div className="p-3 bg-amber-50 border border-amber-250 rounded-xl text-xs text-amber-800 flex items-center justify-between gap-2.5 shadow-2xs">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="leading-normal">
                    Pembaruan otomatis dijeda sementara karena lalu lintas
                    tinggi.
                    {retryAfter && ` Coba lagi dalam ${retryAfter} detik.`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    refetch();
                  }}
                  className="px-2.5 py-1 text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors cursor-pointer shrink-0"
                >
                  Muat Ulang
                </button>
              </div>
            )}
            {loadingComments ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : (
              <FeedbackComment
                comments={comments}
                onAddComment={handleAddComment}
              />
            )}
          </div>
        </div>

        {/* Drawer Footer actions */}
        <div className="p-6 border-t border-gray-150 flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-lg border-gray-200 hover:bg-gray-50 text-gray-750 px-5 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirmStatus}
            disabled={
              isMutating ||
              (status === "revision" &&
                task.status !== "revision" &&
                !hasCommentedThisSession)
            }
            className="rounded-lg bg-red-800 hover:bg-red-900 text-white font-semibold px-5 transition-all text-xs cursor-pointer shadow-sm disabled:opacity-60"
          >
            {updateStatusMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
