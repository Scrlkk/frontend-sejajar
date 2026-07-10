import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { TypeTasks } from "@/features/pillars/components/TypeTasks";
import { FormatBadgeContent } from "@/features/pillars/components/FormatBadgeContent";
import { PlatformBadge } from "@/features/pillars/components/PlatformBadge";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";
import { ContentPlanPreviewCard } from "@/features/contents/components/ContentPlanPreviewCard";
import { formatDateEN } from "@/utils/helpers";

import { TaskDrawerAssignee } from "./drawer/TaskDrawerAssignee";
import { TaskDrawerContent } from "./drawer/TaskDrawerContent";
import { TaskDrawerUploads } from "./drawer/TaskDrawerUploads";
import { TaskDrawerComments } from "./drawer/TaskDrawerComments";
import { TaskDrawerReview } from "./drawer/TaskDrawerReview";

import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { useRateLimit } from "@/hooks/useRateLimit";
import {
  getTaskByIdApi,
  updateTaskApi,
  getTasksApi,
} from "@/features/tasks/api/tasksApi";
import {
  getTaskOutputsApi,
  createTaskOutputApi,
  deleteTaskOutputApi,
} from "@/features/tasks/api/taskOutputsApi";
import {
  getTaskCommentsApi,
  createTaskCommentApi,
} from "@/features/tasks/api/taskCommentsApi";
import type { TaskOutput, TaskComment } from "@/features/tasks/types";
import { taskKeys } from "@/features/tasks/api/taskKeys";
import { contentKeys } from "@/features/contracts/api/contractKeys";
import { getContentByIdApi } from "@/features/contents/api/contentsApi";
import {
  getInitialsAndBg,
  formatCommentTimestamp,
  getTaskTypeConfig,
  isTaskOverdue,
} from "@/utils/formatter";
import { downloadFile, formatDate, getFileUrl } from "@/utils/helpers";

import type { TaskBoardItem, UploadedMediaItem, DraftsItem } from "@/features/tasks/types";
import type { ContentPillar } from "@/features/contents/types";

interface ExtendedDrawerItem {
  id: string | number;
  content_id?: number;
  task_id?: number;
  status: string;
  revisionNote?: string;
  isOverdue?: boolean;
  title?: string;
  category?: string;
  category_name?: string;
  content_format?: string;
  platform_name?: string;
  platform_color_key?: string | null;
  deadline?: string | null;
  description?: string;
  assigner?: {
    name: string;
    role: string;
    initials: string;
  };
  assignee?: {
    name?: string;
    role?: string;
  };
}

interface ExtendedTaskBoardItem extends TaskBoardItem {
  content_format?: string;
  platform_name?: string;
  platform_color_key?: string;
}

function isUploadedMediaItem(
  item: UploadedMediaItem | DraftsItem,
): item is UploadedMediaItem {
  return "task_id" in item;
}

interface UnifiedTaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task?: TaskBoardItem | null;
  item?: UploadedMediaItem | DraftsItem | null;
  itemType?: "upload" | "draft" | null;
  onSave?: (updatedItem: UploadedMediaItem | DraftsItem) => void;
  hideUpload?: boolean;
}

export function UnifiedTaskDrawer({
  isOpen,
  onClose,
  task,
  item,
  itemType,
  onSave,
  hideUpload = false,
}: UnifiedTaskDrawerProps) {
  const queryClient = useQueryClient();
  const { roles } = usePermissions();
  const { user } = useAuth();
  const { isRateLimited, retryAfter, reset: resetRateLimit } = useRateLimit();

  const taskId = useMemo(() => {
    if (task) return Number(task.id);
    if (itemType === "draft" && item) return Number(item.id);
    if (itemType === "upload" && item)
      return Number((item as UploadedMediaItem).task_id);
    return 0;
  }, [task, item, itemType]);

  const contentId = useMemo(() => {
    if (task) return Number(task.content_id);
    if (item) return Number(item.content_id);
    return 0;
  }, [task, item]);

  const { data: taskDetail } = useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => getTaskByIdApi(taskId),
    enabled: isOpen && taskId > 0,
  });

  const isOwnerOrAdmin = useMemo(() => {
    if (roles.includes("superadmin")) return true;
    if (!roles.includes("owner")) return false;
    return (
      taskDetail?.contract_created_by != null &&
      Number(taskDetail.contract_created_by) === Number(user?.id)
    );
  }, [roles, taskDetail, user]);

  const isContentLead = useMemo(() => {
    if (!roles.includes("content_lead")) return false;
    return (
      taskDetail?.lead_id != null &&
      Number(taskDetail.lead_id) === Number(user?.id)
    );
  }, [roles, taskDetail, user]);

  const { data: contentDetail } = useQuery({
    queryKey: contentKeys.detail(contentId),
    queryFn: () => getContentByIdApi(contentId),
    enabled: isOpen && contentId > 0,
  });

  const { data: taskOutputsData, isLoading: loadingOutputs } = useQuery({
    queryKey: taskKeys.outputs(taskId),
    queryFn: () => getTaskOutputsApi(taskId),
    enabled: isOpen && taskId > 0,
  });

  const { data: apiComments = [], refetch: refetchComments } = useQuery({
    queryKey: taskKeys.comments(taskId),
    queryFn: () => getTaskCommentsApi(taskId),
    enabled: isOpen && taskId > 0,
    refetchInterval: isRateLimited ? false : 3000,
  });

  const { data: otherTasksOutputs = [], isLoading: loadingOtherOutputs } =
    useQuery({
      queryKey: taskKeys.siblingOutputs(contentId, taskId),
      queryFn: async () => {
        const tasksList = await getTasksApi({ content_id: contentId });
        const otherTasks = tasksList.filter((t) => Number(t.id) !== taskId && t.status.toLowerCase() === "approved");
        if (otherTasks.length === 0) return [];

        const outputsPromises = otherTasks.map(async (t) => {
          try {
            const outputs = await getTaskOutputsApi(Number(t.id));
            if (outputs.length === 0) return [];
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
      enabled: isOpen && contentId > 0 && taskId > 0,
    });

  const extendedItem = item as ExtendedDrawerItem | undefined;
  const extendedTask = task as ExtendedTaskBoardItem | undefined;

  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(
    null,
  );
  const [deleteHistoryConfirmId, setDeleteHistoryConfirmId] = useState<
    number | string | null
  >(null);
  const [showDeleteCaptionConfirm, setShowDeleteCaptionConfirm] =
    useState(false);
  const [hasCommentedThisSession, setHasCommentedThisSession] = useState(false);

  const initialStatus = useMemo(() => {
    let raw = "to_do";
    if (task) raw = task.status;
    else if (item) raw = item.status;
    const normalized = raw.toLowerCase().replace(" ", "_");
    return normalized === "pending" ? "review" : normalized;
  }, [task, item]);

  const [status, setStatus] = useState<string>(initialStatus);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialStatus, setPrevInitialStatus] = useState(initialStatus);

  if (isOpen !== prevIsOpen || initialStatus !== prevInitialStatus) {
    setPrevIsOpen(isOpen);
    setPrevInitialStatus(initialStatus);
    setStatus(initialStatus);
    setHasCommentedThisSession(false);
    setDeleteConfirmIndex(null);
    setDeleteHistoryConfirmId(null);
    setShowDeleteCaptionConfirm(false);
  }

  const taskOutputs = useMemo(() => taskOutputsData || [], [taskOutputsData]);
  const deliverables = useMemo(
    () => (taskOutputs.length > 0 ? [taskOutputs[0]] : []),
    [taskOutputs],
  );
  const history = useMemo(
    () => (taskOutputs.length > 1 ? taskOutputs.slice(1) : []),
    [taskOutputs],
  );
  const isCaptionTask = useMemo(() => {
    if (task?.type === "Caption") return true;
    const role =
      taskDetail?.assignee_roles?.[0] ?? extendedItem?.assignee?.role;
    if (role) {
      return getTaskTypeConfig(role).label === "Caption";
    }
    return false;
  }, [taskDetail, task, extendedItem]);

  const isApproved = useMemo(() => {
    return (
      status.toLowerCase() === "approved" ||
      taskDetail?.status?.toLowerCase() === "approved" ||
      task?.status?.toLowerCase() === "approved" ||
      item?.status?.toLowerCase() === "approved"
    );
  }, [status, taskDetail?.status, task?.status, item?.status]);

  const isAssignee = useMemo(() => {
    if (taskDetail?.assigned_to === undefined || user?.id === undefined) return false;
    return Number(taskDetail.assigned_to) === Number(user.id);
  }, [taskDetail?.assigned_to, user?.id]);

  const canDelete = useMemo(() => {
    return isOwnerOrAdmin || (isAssignee && !isApproved);
  }, [isOwnerOrAdmin, isAssignee, isApproved]);

  const canSeeHistory = useMemo(() => {
    if (!isCaptionTask) return true;
    if (!taskDetail) return false;
    const currentUserId = Number(user?.id);
    const isOwnerOrAdminRole = ["superadmin", "owner"].includes(
      user?.role || "",
    );
    const isAssignedLead = Number(taskDetail.lead_id) === currentUserId;
    const isTaskAssignee = Number(taskDetail.assigned_to) === currentUserId;
    return isOwnerOrAdminRole || isAssignedLead || isTaskAssignee;
  }, [isCaptionTask, taskDetail, user]);

  const drawerCaptionText = useMemo(() => {
    if (taskOutputs.length > 0) {
      const raw = taskOutputs[0].caption || "";
      // Strip trailing hashtags (e.g. appended during scheduling)
      return raw.replace(/(\s*#\S+)+$/, "").trim();
    }
    return "";
  }, [taskOutputs]);

  const isOverdue = useMemo(() => {
    if (task) return !!task.isOverdue;
    if (taskDetail && taskDetail.deadline) {
      return isTaskOverdue(taskDetail.deadline, "to_do");
    }
    return !!extendedItem?.isOverdue;
  }, [task, taskDetail, extendedItem]);



  const addCommentMutation = useMutation({
    mutationFn: (message: string) =>
      createTaskCommentApi({ task_id: taskId, message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(taskId) });
      setHasCommentedThisSession(true);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) =>
      updateTaskApi(taskId, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
  });

  const uploadOutputMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      formData.append("task_id", String(taskId));
      const output = await createTaskOutputApi(formData);
      await updateTaskApi(taskId, { status: "review" });
      return output;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.allOutputs() });
      queryClient.invalidateQueries({ queryKey: taskKeys.outputs(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      toast.success("File uploaded successfully and status set to Review!");
      setStatus("review");
    },
    onError: (err: Error) => {
      const errorResponse = err as Error & {
        response?: { data?: { message?: string } };
      };
      toast.error(
        errorResponse.response?.data?.message ||
          err.message ||
          "Failed to upload file",
      );
    },
  });

  const deleteOutputMutation = useMutation({
    mutationFn: (id: number) => deleteTaskOutputApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({ queryKey: taskKeys.allOutputs() });
      queryClient.invalidateQueries({ queryKey: taskKeys.outputs(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });

      const currentOutputs = queryClient.getQueryData<TaskOutput[]>(
        taskKeys.outputs(taskId)
      );
      if (!currentOutputs || currentOutputs.length <= 1) {
        setStatus("on_progress");
      }
      toast.success("Output deleted successfully!");
      setDeleteConfirmIndex(null);
      setDeleteHistoryConfirmId(null);
      setShowDeleteCaptionConfirm(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete output");
    },
  });

  const comments = useMemo(() => {
    return apiComments.map((c: TaskComment) => {
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
  }, [apiComments, user]);

  const handleAddComment = (text: string) => {
    addCommentMutation.mutate(text);
  };

  const handleSave = () => {
    if (status !== initialStatus) {
      if (
        status === "revision" &&
        initialStatus !== "revision" &&
        !hasCommentedThisSession
      ) {
        toast.error(
          "Wajib memberikan feedback terlebih dahulu sebelum meminta revisi.",
        );
        return;
      }
      updateStatusMutation.mutate(status);
    }
    if (onSave && item) {
      onSave({
        ...item,
        status,
        revisionNote: status === "Approved" ? undefined : item.revisionNote,
      });
    }
    onClose();
  };

  const statuses = [
    {
      key: "to_do",
      label: "To Do",
      dotBg: "bg-gray-500",
      activeClass:
        "bg-gray-50 border-gray-300 text-gray-700 ring-1 ring-gray-400/30 shadow-sm",
      inactiveClass:
        "border-gray-200 bg-white text-gray-600 hover:bg-slate-50 hover:text-gray-800",
    },
    {
      key: "on_progress",
      label: "On Progress",
      dotBg: "bg-amber-500",
      activeClass:
        "bg-amber-50 border-amber-400 text-amber-700 ring-1 ring-amber-400/50 shadow-sm",
      inactiveClass:
        "border-gray-200 bg-white text-gray-600 hover:bg-slate-50 hover:text-gray-800",
    },
    {
      key: "review",
      label: "Review",
      dotBg: "bg-purple-500",
      activeClass:
        "bg-purple-50 border-purple-400 text-purple-700 ring-1 ring-purple-400/50 shadow-sm",
      inactiveClass:
        "border-gray-200 bg-white text-gray-600 hover:bg-slate-50 hover:text-gray-800",
    },
    {
      key: "revision",
      label: "Revision",
      dotBg: "bg-red-500",
      activeClass:
        "bg-red-50 border-red-400 text-red-800 ring-1 ring-red-400/50 shadow-sm",
      inactiveClass:
        "border-gray-200 bg-white text-gray-600 hover:bg-slate-50 hover:text-gray-800",
    },
    {
      key: "approved",
      label: "Approved",
      dotBg: "bg-emerald-500",
      activeClass:
        "bg-emerald-50 border-emerald-400 text-emerald-800 ring-1 ring-emerald-400/50 shadow-sm",
      inactiveClass:
        "border-gray-200 bg-white text-gray-600 hover:bg-slate-50 hover:text-gray-800",
    },
  ];

  const isTransitionAllowed = (fromStatus: string, toStatus: string) => {
    if (fromStatus === toStatus) return true;
    if (isAssignee) {
      const hasOutputs = taskOutputs.length > 0;
      switch (fromStatus) {
        case "to_do":
          if (toStatus === "on_progress") return true;
          break;
        case "on_progress":
          if (toStatus === "to_do") return true;
          if ((toStatus === "review" || toStatus === "pending") && hasOutputs) return true;
          break;
        case "revision":
          if (toStatus === "on_progress") return true;
          if ((toStatus === "review" || toStatus === "pending") && hasOutputs) return true;
          break;
        case "review":
        case "pending":
          if (toStatus === "on_progress") return true;
          break;
      }
    }
    if (isOwnerOrAdmin || isContentLead) {
      return toStatus === "revision" || toStatus === "approved";
    }
    return false;
  };

  if (!isOpen) return null;

  const drawerTitle =
    task?.title || taskDetail?.title || item?.title || "Detail Tugas";
  const drawerCategory =
    task?.category ||
    taskDetail?.category_name ||
    extendedItem?.category_name ||
    "General";
  const drawerFormat =
    extendedTask?.content_format ||
    taskDetail?.content_format ||
    contentDetail?.format ||
    extendedItem?.category_name ||
    "Video";
  const drawerPlatform =
    extendedTask?.platform_name ||
    taskDetail?.platform_name ||
    extendedItem?.platform_name;
  const drawerDeadline =
    task?.date || taskDetail?.deadline || extendedItem?.deadline || null;
  const showOverdue = isOverdue && status.toLowerCase() !== "approved";

  const getOverdueDaysText = (deadlineDate: Date | string | null): string => {
    if (!deadlineDate) return "Overdue";
    const now = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = now.getTime() - deadline.getTime();
    if (diffTime <= 0) return "Overdue";

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      return `${diffDays}d overdue`;
    }
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours}h overdue`;
    }
    return "Overdue";
  };
  const drawerDescription =
    taskDetail?.description ||
    task?.description ||
    extendedItem?.description ||
    "";
  const contentPillars = contentDetail?.pillars || [];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-lg md:max-w-2xl bg-white shadow-2xl border-l border-gray-100 flex flex-col h-full p-0">
        <div className="px-6 py-4 border-b border-gray-300 shrink-0">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
            Task Workspace
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            {drawerTitle}
          </h2>

          {contentDetail && <ContentPlanPreviewCard content={contentDetail} />}

          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
              Task Description
            </span>
            <div className="w-full bg-slate-50 border border-gray-100 rounded-xl p-3.5 text-xs text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
              {drawerDescription || "Tidak ada deskripsi tugas"}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <TypeTasks type={drawerCategory} />
            <FormatBadgeContent format={drawerFormat} />
            {drawerPlatform && (
              <PlatformBadge
                platform={drawerPlatform}
                colorKey={
                  extendedTask?.platform_color_key ||
                  taskDetail?.platform_color_key ||
                  extendedItem?.platform_color_key
                }
                className="text-[10px] px-2 py-0.5"
              />
            )}
            {contentPillars.map((p: ContentPillar) => (
              <PillarsCard
                key={p.id}
                category={p.pillar_name}
                colorKey={p.color_key}
              />
            ))}
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
              Task Status
            </span>
            <div className="flex flex-wrap gap-2">
              {statuses.map((st) => {
                const isSelected = st.key === status;
                const isAllowed = isTransitionAllowed(initialStatus, st.key);
                return (
                  <button
                    key={st.key}
                    type="button"
                    onClick={() => setStatus(st.key)}
                    disabled={!isAllowed}
                    className={`rounded-xl border py-2 px-3 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected ? st.activeClass : st.inactiveClass
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full shrink-0 ${st.dotBg}`}
                    />
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TaskDrawerAssignee
              assigneeName={
                task?.assignee ||
                taskDetail?.assignee_name ||
                extendedItem?.assignee?.name
              }
              roleName={
                task?.role ||
                taskDetail?.assignee_roles?.[0] ||
                extendedItem?.assignee?.role
              }
            />

            <div
              className={`p-3.5 rounded-xl border flex flex-col justify-between h-20 transition-colors shadow-sm ${
                showOverdue
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-slate-50/30 border-gray-200 text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <div className="flex items-center gap-1.5">
                  <Calendar
                    className={`h-3.5 w-3.5 shrink-0 ${
                      showOverdue ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      showOverdue ? "text-red-800" : "text-gray-400"
                    }`}
                  >
                    Deadline
                  </span>
                </div>
                {showOverdue && (
                  <span className="text-[8px] font-extrabold tracking-wider bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md uppercase shrink-0 border border-red-200/50 animate-pulse">
                    {getOverdueDaysText(drawerDeadline)}
                  </span>
                )}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-base font-bold">
                  {drawerDeadline ? formatDateEN(drawerDeadline) : "-"}
                </span>
              </div>
            </div>
          </div>

          <TaskDrawerContent
            isCaptionTask={isCaptionTask}
            captionText={drawerCaptionText}
            canDelete={canDelete}
            showDeleteConfirm={showDeleteCaptionConfirm}
            setShowDeleteConfirm={setShowDeleteCaptionConfirm}
            isPendingDelete={deleteOutputMutation.isPending}
            onConfirmDelete={() => {
              const newest = taskOutputs[0];
              if (newest?.id) {
                deleteOutputMutation.mutate(Number(newest.id));
              }
            }}
            history={history}
            canSeeHistory={canSeeHistory}
            deleteHistoryConfirmId={deleteHistoryConfirmId}
            setDeleteHistoryConfirmId={setDeleteHistoryConfirmId}
            onDeleteOutput={(id) => deleteOutputMutation.mutate(id)}
            formatDate={(d) => formatDate(d || null)}
          />

          <TaskDrawerUploads
            isCaptionTask={isCaptionTask}
            deliverables={deliverables}
            loadingOutputs={loadingOutputs}
            canDelete={canDelete}
            canUpload={hideUpload ? false : isAssignee}
            isApproved={isApproved}
            itemType={
              itemType ||
              (item ? (isUploadedMediaItem(item) ? "upload" : "draft") : null)
            }
            deleteConfirmIndex={deleteConfirmIndex}
            setDeleteConfirmIndex={setDeleteConfirmIndex}
            isPendingDelete={deleteOutputMutation.isPending}
            onDeleteOutput={(id) => deleteOutputMutation.mutate(id)}
            onUploadFile={(formData) => uploadOutputMutation.mutate(formData)}
            isPendingUpload={uploadOutputMutation.isPending}
            getFileUrl={getFileUrl}
            downloadFile={downloadFile}
            history={history}
            canSeeHistory={canSeeHistory}
            deleteHistoryConfirmId={deleteHistoryConfirmId}
            setDeleteHistoryConfirmId={setDeleteHistoryConfirmId}
            formatDate={(d) => formatDate(d || null)}
          />

          <TaskDrawerReview
            otherTasksOutputs={otherTasksOutputs}
            loadingOtherOutputs={loadingOtherOutputs}
            getFileUrl={getFileUrl}
            downloadFile={downloadFile}
            formatDate={(d) => formatDate(d || null)}
          />

          <TaskDrawerComments
            comments={comments}
            onAddComment={handleAddComment}
            isRateLimited={isRateLimited}
            retryAfter={retryAfter}
            onResetRateLimit={resetRateLimit}
            onRefetchComments={refetchComments}
            status={status}
            originalStatus={initialStatus}
            hasCommentedThisSession={hasCommentedThisSession}
          />
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-lg border-gray-200 hover:bg-gray-50 text-gray-700 px-5 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={updateStatusMutation.isPending}
            className="rounded-lg bg-red-800 hover:bg-red-900 text-white font-semibold px-5 transition-all text-xs cursor-pointer shadow-sm disabled:opacity-50"
          >
            {updateStatusMutation.isPending && (
              <Loader2 className="h-3 w-3 animate-spin mr-1 text-white inline" />
            )}
            Confirm Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
