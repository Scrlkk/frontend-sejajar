import { useState, useRef, useMemo } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Calendar,
  Trash2,
  Video as VideoIcon,
  Image as ImageIcon,
  FileText,
  History as HistoryIcon,
  Upload,
  AlertTriangle,
  Loader2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";
import { FormatBadgeContent } from "@/features/pillars/components/FormatBadgeContent";
import { StatusBadgeContent } from "@/features/pillars/components/StatusBadgeContent";
import { FeedbackComment } from "@/features/reviews/components/FeedbackComment";
import type { UploadedMediaItem } from "@/features/tasks/components/Uploads";
import type { DraftsItem } from "@/features/tasks/components/Drafts";
import type { TaskCommentItem } from "@/features/tasks/components/TasksContent";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContentPlanPreviewCard } from "@/features/contents/components/ContentPlanPreviewCard";
import {
  getContentByIdApi,
  mapContentToCardItem,
} from "@/features/contents/api/contentsApi";
import { TypeTasks } from "@/features/pillars/components/TypeTasks";
import { getTaskTypeConfig } from "@/features/tasks/constants/typeConfig";
import { updateTaskApi, getTaskByIdApi } from "@/features/tasks/api/tasksApi";
import {
  createTaskOutputApi,
  getTaskOutputsApi,
  deleteTaskOutputApi,
} from "@/features/tasks/api/taskOutputsApi";
import { useAuth } from "@/hooks/useAuth";
import { useRateLimit } from "@/hooks/useRateLimit";
import { getInitialsAndBg, isTaskOverdue, formatCommentTimestamp } from "@/utils/formatter";
import { downloadFile, formatDate, formatDateEN } from "@/utils/helpers";
import {
  getTaskCommentsApi,
  createTaskCommentApi,
} from "@/features/tasks/api/taskCommentsApi";
import toast from "react-hot-toast";

export interface SubmissionFile {
  version: number;
  filename: string;
  size: string;
  time: string;
  status: string;
  type: string;
  id?: number | string;
  file_url?: string;
  caption?: string;
}


interface SpesificDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: UploadedMediaItem | DraftsItem | null;
  itemType: "upload" | "draft";
  onSave?: (updatedItem: UploadedMediaItem | DraftsItem) => void;
}

export function SpesificDrawer({
  isOpen,
  onClose,
  item,
  itemType,
  onSave,
}: SpesificDrawerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const contentId = Number(item?.content_id ?? 0);
  const taskId =
    itemType === "draft"
      ? Number(item?.id ?? 0)
      : Number((item as UploadedMediaItem)?.task_id ?? 0);

  const queryClient = useQueryClient();

  // --- Live content detail query ---
  const { data: contentDetail } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentByIdApi(contentId),
    enabled: isOpen && !!item && contentId > 0,
  });

  // --- Live task detail query ---
  const { data: taskDetail } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskByIdApi(taskId),
    enabled: isOpen && !!item && taskId > 0,
  });

  // --- Live task outputs query ---
  const { data: taskOutputsData, isLoading: loadingOutputs } = useQuery({
    queryKey: ["task-outputs", taskId],
    queryFn: () => getTaskOutputsApi(taskId),
    enabled: isOpen && !!item && taskId > 0,
  });

  const taskOutputs = useMemo(() => taskOutputsData || [], [taskOutputsData]);

  const { isRateLimited, retryAfter, reset } = useRateLimit();

  // --- Live task comments query ---
  const { data: apiComments = [], refetch } = useQuery({
    queryKey: ["task-comments", taskId],
    queryFn: () => getTaskCommentsApi(taskId),
    enabled: isOpen && !!item && taskId > 0,
    refetchInterval: isRateLimited ? false : 3000,
  });

  const uploadOutputMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // 1. Upload output file
      const output = await createTaskOutputApi(formData);
      // 2. Set task status to review (Pending)
      await updateTaskApi(taskId, { status: "review" });
      return output;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["all-task-outputs"] });
      queryClient.invalidateQueries({ queryKey: ["task-outputs", taskId] });
      toast.success("File uploaded successfully and status set to Review!");
      setStatus("Pending");
    },
    onError: (err: unknown) => {
      let errMsg = "Failed to upload file";
      if (err && typeof err === "object") {
        const errObj = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        errMsg = errObj.response?.data?.message || errObj.message || errMsg;
      }
      toast.error(errMsg);
    },
  });

  const deleteOutputMutation = useMutation({
    mutationFn: (id: number) => deleteTaskOutputApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["all-task-outputs"] });
      queryClient.invalidateQueries({ queryKey: ["task-outputs", taskId] });
      queryClient.invalidateQueries({ queryKey: ["task-detail", taskId] });
      // If no remaining outputs after deletion, reset local status
      const currentOutputs = queryClient.getQueryData<
        { id: number }[]
      >(["task-outputs", taskId]);
      if (!currentOutputs || currentOutputs.length <= 1) {
        setStatus("On Progress");
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

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => {
      const backendStatus =
        newStatus === "Pending" ? "review" : newStatus.toLowerCase();
      return updateTaskApi(taskId, { status: backendStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["all-task-outputs"] });
      queryClient.invalidateQueries({ queryKey: ["task-outputs", taskId] });
      toast.success("Changes saved successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to save changes");
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: (message: string) =>
      createTaskCommentApi({ task_id: taskId, message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-comments", taskId] });
      toast.success("Comment added successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to add comment");
    },
  });

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

  const itemCategory = item
    ? itemType === "draft"
      ? (item as DraftsItem).category
      : "Media Asset"
    : "";
  const itemPlatform = item
    ? itemType === "upload"
      ? (item as UploadedMediaItem).platform
      : "Web / Document"
    : "";

  // Fallback states if item is empty
  const [status, setStatus] = useState<string>(() => item?.status || "Pending");

  const isCaptionTask = useMemo(() => {
    if (!item) return false;
    const role =
      taskDetail?.assignee_roles?.[0] ||
      item.assigner?.role ||
      "content_editor";
    return getTaskTypeConfig(role).label === "Caption";
  }, [item, taskDetail]);

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

  const isApproved = useMemo(() => {
    return (
      status.toLowerCase() === "approved" ||
      taskDetail?.status?.toLowerCase() === "approved"
    );
  }, [status, taskDetail?.status]);

  const isLeadOrAdmin = useMemo(() => {
    return ["superadmin", "owner", "content_lead"].includes(user?.role || "");
  }, [user?.role]);

  const isAssignee = useMemo(() => {
    return taskDetail?.assigned_to === Number(user?.id);
  }, [taskDetail?.assigned_to, user?.id]);

  const canDelete = useMemo(() => {
    return isLeadOrAdmin || (isAssignee && !isApproved);
  }, [isLeadOrAdmin, isAssignee, isApproved]);

  const comments = useMemo<TaskCommentItem[]>(() => {
    const mapped = apiComments.map((c) => {
      const isSystem = c.user_name === "SYSTEM" || c.user_id === null;
      const isMe = !isSystem && user && Number(c.user_id) === Number(user.id);
      const { initials, avatarBg } = getInitialsAndBg(c.user_name ?? "");
      return {
        id: String(c.id),
        sender: c.user_name || "SYSTEM",
        senderInitials: isSystem ? "SYS" : initials,
        senderBg: isSystem ? "bg-slate-800 text-slate-100" : avatarBg,
        text: c.message,
        timestamp: formatCommentTimestamp(c.created_at),
        isSystem,
        isMe: !!isMe,
      };
    });

    if (
      mapped.length === 0 &&
      item?.status === "Revision" &&
      item.revisionNote
    ) {
      return [
        {
          id: `comment-rev-${taskId}`,
          sender: "Content Lead",
          senderInitials: "CL",
          senderBg: "bg-red-100 text-red-600 border border-red-200",
          text: item.revisionNote,
          timestamp: "2 hours ago",
          isMe: false,
        },
      ];
    }
    return mapped;
  }, [apiComments, user, item, taskId]);

  // Derive deliverables dynamically from query
  const deliverables = useMemo<SubmissionFile[]>(() => {
    if (taskOutputs.length === 0 || !item) return [];
    const newest = taskOutputs[0];
    const isVideo =
      newest.file_url?.endsWith(".mp4") ||
      newest.file_url?.toLowerCase().includes("video");
    const isDoc =
      newest.file_url?.endsWith(".doc") ||
      newest.file_url?.endsWith(".docx") ||
      newest.file_url?.endsWith(".pdf") ||
      newest.file_url?.endsWith(".txt") ||
      itemType === "draft";

    const size =
      newest.file_size || (isDoc ? "1.2 MB" : isVideo ? "12.5 MB" : "3.4 MB");
    const time =
      newest.submitted_at || newest.created_at
        ? formatDate(newest.submitted_at || newest.created_at)
        : "Just now";

    return [
      {
        id: newest.id,
        version: newest.version || taskOutputs.length,
        filename: newest.file_url?.split("/").pop() || "output_file",
        size,
        time,
        status: status,
        type: isDoc ? "document" : isVideo ? "video" : "image",
        file_url: newest.file_url,
      },
    ];
  }, [taskOutputs, itemType, status, item]);

  // Derive history dynamically from query
  const history = useMemo<SubmissionFile[]>(() => {
    if (taskOutputs.length <= 1 || !item) return [];
    const olderOutputs = taskOutputs.slice(1);
    return olderOutputs.map((out) => {
      const isVideo =
        out.file_url?.endsWith(".mp4") ||
        out.file_url?.toLowerCase().includes("video");
      const isDoc =
        out.file_url?.endsWith(".doc") ||
        out.file_url?.endsWith(".docx") ||
        out.file_url?.endsWith(".pdf") ||
        out.file_url?.endsWith(".txt") ||
        itemType === "draft";

      const size =
        out.file_size || (isDoc ? "1.2 MB" : isVideo ? "12.5 MB" : "3.4 MB");
      const time =
        out.submitted_at || out.created_at
          ? formatDate(out.submitted_at || out.created_at)
          : "3 days ago";

      return {
        id: out.id,
        version: out.version || 1,
        filename: out.file_url?.split("/").pop() || "output_file",
        size,
        time,
        status: "Revision",
        type: isDoc ? "document" : isVideo ? "video" : "image",
        file_url: out.file_url,
        caption: out.caption ?? undefined,
      };
    });
  }, [taskOutputs, item, itemType]);

  const isOverdue = useMemo(() => {
    if (!item) return false;
    const dl =
      taskDetail?.deadline ||
      (itemType === "draft"
        ? (item as DraftsItem).savedTimeText
        : (item as UploadedMediaItem).uploadedTimeText);
    const s = taskDetail?.status || item.status || "review";
    if (!dl) return false;
    let dateStr = dl;
    if (dl.startsWith("Due")) {
      dateStr = dl.replace("Due", "").trim();
    }
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return isTaskOverdue(dateStr, s.toLowerCase());
      }
    } catch {
      // ignore
    }
    return !!(item as UploadedMediaItem).isOverdue;
  }, [taskDetail, item, itemType]);

  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(
    null,
  );
  const [deleteHistoryConfirmId, setDeleteHistoryConfirmId] = useState<
    number | string | null
  >(null);
  const [showDeleteCaptionConfirm, setShowDeleteCaptionConfirm] = useState(false);

  if (!item) return null;

  const handleAddComment = (text: string) => {
    addCommentMutation.mutate(text);
  };

  const handleSave = () => {
    if (status !== item.status) {
      if (
        isLeadOrAdmin ||
        ["to_do", "on_progress", "review"].includes(status.toLowerCase())
      ) {
        updateStatusMutation.mutate(status);
      }
    }
    if (onSave) {
      if (itemType === "upload") {
        onSave({
          ...item,
          status,
          revisionNote: status === "Approved" ? undefined : item.revisionNote,
        } as UploadedMediaItem);
      } else {
        onSave({
          ...item,
          status,
          revisionNote: status === "Approved" ? undefined : item.revisionNote,
        } as DraftsItem);
      }
    }
    onClose();
  };

  // Mocking new file upload mechanism
  const handleUploadClick = () => {
    if (isApproved) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isApproved) return;
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // 1. Validate file extension/format on client side
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (itemType === "upload") {
        const allowedMedia = [
          ".png",
          ".jpg",
          ".jpeg",
          ".webp",
          ".gif",
          ".mp4",
          ".mpeg",
          ".mov",
          ".webm",
          ".avi",
        ];
        if (!allowedMedia.includes(ext)) {
          toast.error(
            "Format file tidak sesuai. Harap unggah file Video (MP4, MOV, AVI) atau Foto (PNG, JPG, JPEG, GIF, WEBP).",
            { duration: 5000 },
          );
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          return;
        }
      } else {
        const allowedDocs = [".pdf", ".doc", ".docx", ".txt"];
        if (!allowedDocs.includes(ext)) {
          toast.error(
            "Format file tidak sesuai. Harap unggah file Dokumen (PDF, DOC, DOCX, TXT).",
            { duration: 5000 },
          );
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          return;
        }
      }

      // 2. Validate file size on client side (max 50MB limit matching backend)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(
          "Ukuran file melebihi batas maksimal 50MB. Harap pilih file yang lebih kecil.",
          { duration: 5000 },
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const formData = new FormData();
      formData.append("task_id", String(taskId));
      formData.append("file", file);
      uploadOutputMutation.mutate(formData);
    }
  };

  // Status visual mapping with specific active styling rules matching core colors
  const statuses = [
    {
      key: "to_do",
      label: "To Do",
      dotBg: "bg-gray-500",
      activeClass:
        "bg-gray-50 border-gray-300 text-gray-700 ring-1 ring-gray-400/30 shadow-sm",
    },
    {
      key: "on_progress",
      label: "On Progress",
      dotBg: "bg-amber-500",
      activeClass:
        "bg-amber-50 border-amber-400 text-amber-700 ring-1 ring-amber-400/50 shadow-sm",
    },
    {
      key: "review",
      label: "Review",
      dotBg: "bg-purple-500",
      activeClass:
        "bg-purple-50 border-purple-400 text-purple-700 ring-1 ring-purple-400/50 shadow-sm",
    },
    {
      key: "pending",
      label: "Review",
      dotBg: "bg-purple-500",
      activeClass:
        "bg-purple-50 border-purple-400 text-purple-700 ring-1 ring-purple-400/50 shadow-sm",
    },
    {
      key: "revision",
      label: "Revision",
      dotBg: "bg-red-500",
      activeClass:
        "bg-red-50 border-red-400 text-red-800 ring-1 ring-red-400/50 shadow-sm",
    },
    {
      key: "approved",
      label: "Approved",
      dotBg: "bg-emerald-500",
      activeClass:
        "bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500/50 shadow-sm",
    },
    {
      key: "overdue",
      label: "Overdue",
      dotBg: "bg-red-600",
      activeClass:
        "bg-red-100 border-red-500 text-red-600 ring-1 ring-red-500/50 shadow-sm animate-pulse",
    },
  ];

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
              {itemType === "upload"
                ? "Media Submission Workspace"
                : "Script Submission Workspace"}
            </span>
            <h2 className="text-lg font-semibold text-gray-900 leading-snug mt-0.5 max-w-88 line-clamp-2">
              {item.title}
            </h2>
          </div>
        </div>

        {/* Drawer Body Scroll Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 scrollbar-none">
          {/* Related Content Preview */}
          {contentDetail && (
            <div className="pt-2 pb-1">
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
              {taskDetail?.description ||
                item.revisionNote ||
                (itemType === "upload"
                  ? `Please review the uploaded media deliverables for the ${itemCategory} campaign on ${itemPlatform}.`
                  : `Draft review workspace for the ${itemCategory} campaign script.`)}
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
            ) : (
              contentDetail?.pillars?.[0]?.pillar_name && (
                <PillarsCard category={contentDetail.pillars[0].pillar_name} />
              )
            )}
            <PillarsCard
              category={
                contentDetail?.category_name || itemCategory || "General"
              }
            />
            <TypeTasks
              type={
                getTaskTypeConfig(item.assigner?.role || "content_editor").label
              }
            />
            {contentDetail?.format ? (
              <FormatBadgeContent format={contentDetail.format} />
            ) : itemType === "upload" && (item as UploadedMediaItem).type ? (
              <FormatBadgeContent
                format={
                  (item as UploadedMediaItem).type === "video"
                    ? "Video"
                    : "Image"
                }
              />
            ) : null}
          </div>

          {/* Submission Status */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
              Submission Status
            </span>
            <div className="inline-flex">
              {(() => {
                const statusInfo = statuses.find(
                  (st) =>
                    st.key.toLowerCase() === status.toLowerCase() ||
                    st.label.toLowerCase() === status.toLowerCase(),
                ) || {
                  key: status,
                  label: status,
                  dotBg: "bg-slate-400",
                  activeClass:
                    "bg-slate-50 border-slate-400 text-slate-800 ring-1 ring-slate-400/50 shadow-sm",
                };
                return (
                  <div
                    className={`rounded-xl border py-2 px-3 text-xs font-semibold flex items-center gap-1.5 ${statusInfo.activeClass}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusInfo.dotBg}`}
                    />
                    {statusInfo.label}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Deadline card */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-3.5 rounded-xl border flex flex-col justify-between h-20 transition-colors shadow-sm ${
                isOverdue && status.toLowerCase() !== "approved"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-slate-50/30 border-gray-200 text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <div className="flex items-center gap-1.5">
                  <Calendar
                    className={`h-3.5 w-3.5 shrink-0 ${isOverdue && status.toLowerCase() !== "approved" ? "text-red-500" : "text-gray-400"}`}
                  />
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      isOverdue && status.toLowerCase() !== "approved"
                        ? "text-red-800"
                        : "text-gray-400"
                    }`}
                  >
                    Submission Deadline
                  </span>
                </div>
                {isOverdue && status.toLowerCase() !== "approved" && (
                  <span className="text-[8px] font-extrabold tracking-wider bg-red-100 text-red-700 px-1 py-0.5 rounded-md uppercase shrink-0 border border-red-200/50 animate-pulse">
                    Overdue
                  </span>
                )}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-base font-bold">
                  {(() => {
                    const dl =
                      taskDetail?.deadline ||
                      (itemType === "draft"
                        ? (item as DraftsItem).savedTimeText
                        : (item as UploadedMediaItem).uploadedTimeText);
                    if (!dl) return "No Deadline";
                    if (dl.startsWith("Due"))
                      return dl.replace("Due", "").trim();
                    try {
                      const d = new Date(dl);
                      if (!isNaN(d.getTime())) {
                        return formatDateEN(d);
                      }
                    } catch (err) {
                      console.warn(err);
                    }
                    return dl;
                  })()}
                </span>
              </div>
            </div>

            {(() => {
              const name =
                taskDetail?.lead_name || item.assigner?.name || "Content Lead";
              const role = taskDetail?.lead_name
                ? "Content Lead"
                : item.assigner?.role || "Content Lead";
              const { initials } = getInitialsAndBg(name);
              return (
                <div className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/30 flex flex-col justify-between h-20 shadow-sm text-gray-700">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    Assigned By
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-7 w-7 rounded-full border border-gray-200 bg-slate-100 text-slate-500 text-[9px] font-bold flex items-center justify-center shadow-sm">
                      {initials}
                    </div>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-xs font-bold text-gray-800 truncate">
                        {name}
                      </span>
                      <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                        {role}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Uploads and Re-uploads Section */}
          {isCaptionTask ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                  Caption Output
                </span>
                {taskOutputs.length > 0 && canDelete && !showDeleteCaptionConfirm && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteCaptionConfirm(true)}
                    className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-400 flex items-center justify-center transition-colors cursor-pointer"
                    title="Hapus Caption"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {showDeleteCaptionConfirm ? (
                <div className="flex flex-col border border-red-300 rounded-xl bg-red-100/40 p-3 space-y-2 shadow-sm transition-all duration-300">
                  <div className="flex items-center gap-2 text-red-850">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                    <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
                      Hapus Caption?
                    </span>
                  </div>
                  <p className="text-[10px] text-red-600 leading-relaxed font-medium">
                    Apakah Anda yakin ingin menghapus output caption ini?
                  </p>
                  <div className="flex items-center justify-end gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setShowDeleteCaptionConfirm(false)}
                      className="px-2.5 py-1 text-[10px] font-semibold border border-gray-200 bg-white hover:bg-slate-50 text-gray-700 rounded-md cursor-pointer transition-all shadow-sm"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      disabled={deleteOutputMutation.isPending}
                      onClick={() => {
                        const newest = taskOutputs[0];
                        if (newest?.id) {
                          deleteOutputMutation.mutate(Number(newest.id));
                        }
                      }}
                      className="px-2.5 py-1 text-[10px] font-semibold bg-red-700 hover:bg-red-logo text-white rounded-md cursor-pointer transition-all shadow-sm disabled:opacity-50 flex items-center gap-1"
                    >
                      {deleteOutputMutation.isPending && (
                        <Loader2 className="h-3 w-3 animate-spin text-white" />
                      )}
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`w-full bg-slate-50 border border-gray-200 rounded-xl p-3.5 text-xs leading-relaxed font-medium whitespace-pre-wrap h-auto ${drawerCaptionText ? "text-gray-750" : "text-gray-400 italic"}`}>
                  {drawerCaptionText || "Belum ada caption ditulis"}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Submitted File
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept={
                    itemType === "upload"
                      ? "video/*,image/*"
                      : ".doc,.docx,.pdf,.txt"
                  }
                />
                {deliverables.length > 0 && !isApproved && (
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="text-[10px] font-bold text-red-800 hover:text-red-900 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Upload className="h-3 w-3" />
                    Re-upload File
                  </button>
                )}
              </div>

              {loadingOutputs ? (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : deliverables.length > 0 ? (
                <div className="space-y-2">
                  {deliverables.map((file, idx) => {
                    const isVideo = file.type === "video";
                    const isDoc = file.type === "document";

                    if (deleteConfirmIndex === idx) {
                      return (
                        <div
                          key={idx}
                          className="flex flex-col border border-red-300 rounded-xl bg-red-100/40 p-3 space-y-2 shadow-sm transition-all duration-300"
                        >
                          <div className="flex items-center gap-2 text-red-850">
                            <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                            <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
                              Hapus File?
                            </span>
                          </div>
                          <p className="text-[10px] text-red-600 leading-relaxed font-medium">
                            Apakah Anda yakin ingin menghapus file{" "}
                            <span className="font-bold">"{file.filename}"</span>
                            ?
                          </p>
                          <div className="flex items-center justify-end gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmIndex(null)}
                              className="px-2.5 py-1 text-[10px] font-semibold border border-gray-200 bg-white hover:bg-slate-50 text-gray-700 rounded-md cursor-pointer transition-all shadow-sm"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              disabled={
                                deleteOutputMutation.isPending || !canDelete
                              }
                              onClick={() => {
                                if (file.id && canDelete) {
                                  deleteOutputMutation.mutate(Number(file.id));
                                }
                              }}
                              className="px-2.5 py-1 text-[10px] font-semibold bg-red-700 hover:bg-red-logo text-white rounded-md cursor-pointer transition-all shadow-sm disabled:opacity-50 flex items-center gap-1"
                            >
                              {deleteOutputMutation.isPending && (
                                <Loader2 className="h-3 w-3 animate-spin text-white" />
                              )}
                              Hapus
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        className="flex flex-col border border-gray-300 rounded-xl bg-white p-3 space-y-1 shadow-sm"
                      >
                        <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-400">
                          Active Version (v{file.version})
                        </span>
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
                            <div className="min-w-0 leading-tight">
                              {file.file_url ? (
                                <a
                                  href={getFileUrl(file.file_url)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-semibold text-gray-800 truncate hover:underline hover:text-red-logo block"
                                  title={file.filename}
                                >
                                  {file.filename}
                                </a>
                              ) : (
                                <p
                                  className="text-xs font-semibold text-gray-800 truncate"
                                  title={file.filename}
                                >
                                  {file.filename}
                                </p>
                              )}
                              <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                                V{file.version} • {file.size} • {file.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {file.file_url && (
                              <button
                                type="button"
                                onClick={() => downloadFile(getFileUrl(file.file_url), file.filename)}
                                className="h-7 w-7 rounded-lg hover:bg-slate-100 text-gray-400 hover:text-gray-650 flex items-center justify-center transition-colors cursor-pointer"
                                title="Download file"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={!canDelete}
                              onClick={() => setDeleteConfirmIndex(idx)}
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
                  <div className="h-10 w-10 rounded-full bg-slate-50 border border-gray-150 flex items-center justify-center text-gray-400 shadow-sm mb-2 shrink-0">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-gray-600">
                    Belum ada file diunggah
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                    * Format file yang didukung:{" "}
                    <span className="font-semibold text-gray-500">
                      {itemType === "upload"
                        ? "MP4, MOV, AVI, PNG, JPG, JPEG"
                        : "Dokumen (PDF, DOC, DOCX, TXT)"}
                    </span>
                  </p>
                  {!isApproved && (
                    <Button
                      onClick={handleUploadClick}
                      variant="outline"
                      className="mt-2.5 h-8 px-3 text-[10px] font-bold border-gray-200"
                    >
                      Unggah File Baru
                    </Button>
                  )}
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
                  Revisions & Upload History
                </span>
              </div>
              <div className="space-y-2">
                {isCaptionTask
                  ? history.map((hist, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col border border-gray-200 rounded-xl bg-slate-50/40 p-3 space-y-2 shadow-2xs"
                      >
                        {deleteHistoryConfirmId === hist.id ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">
                                Hapus riwayat ini?
                              </span>
                            </div>
                            <p className="text-[10px] text-red-600 leading-relaxed font-medium">
                              Version {hist.version} akan dihapus permanen.
                            </p>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setDeleteHistoryConfirmId(null)}
                                className="px-2.5 py-1 text-[10px] font-semibold border border-gray-200 bg-white hover:bg-slate-50 text-gray-700 rounded-md cursor-pointer"
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                disabled={deleteOutputMutation.isPending}
                                onClick={() => {
                                  if (hist.id)
                                    deleteOutputMutation.mutate(
                                      Number(hist.id),
                                    );
                                  setDeleteHistoryConfirmId(null);
                                }}
                                className="px-2.5 py-1 text-[10px] font-semibold bg-red-700 hover:bg-red-800 text-white rounded-md cursor-pointer disabled:opacity-50 flex items-center gap-1"
                              >
                                {deleteOutputMutation.isPending && (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                )}
                                Hapus
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center border border-gray-150 text-gray-500 text-[10px] font-bold">
                                  v{hist.version}
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                  Version {hist.version}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-gray-400 font-medium">
                                  {hist.time}
                                </span>
                                {canDelete && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeleteHistoryConfirmId(hist.id ?? null)
                                    }
                                    className="h-6 w-6 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-400 flex items-center justify-center transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="w-full bg-white border border-gray-150 rounded-lg p-2.5 text-xs text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                              {hist.caption || "Tidak ada teks caption"}
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  : history.map((hist, idx) =>
                      deleteHistoryConfirmId === hist.id ? (
                        <div
                          key={idx}
                          className="flex flex-col border border-red-300 rounded-xl bg-red-50/40 p-3 space-y-2 shadow-2xs"
                        >
                          <div className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              Hapus riwayat ini?
                            </span>
                          </div>
                          <p className="text-[10px] text-red-600 leading-relaxed font-medium">
                            File{" "}
                            <span className="font-bold">"{hist.filename}"</span>{" "}
                            (v{hist.version}) akan dihapus permanen.
                          </p>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setDeleteHistoryConfirmId(null)}
                              className="px-2.5 py-1 text-[10px] font-semibold border border-gray-200 bg-white hover:bg-slate-50 text-gray-700 rounded-md cursor-pointer"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              disabled={deleteOutputMutation.isPending}
                              onClick={() => {
                                if (hist.id)
                                  deleteOutputMutation.mutate(Number(hist.id));
                                setDeleteHistoryConfirmId(null);
                              }}
                              className="px-2.5 py-1 text-[10px] font-semibold bg-red-700 hover:bg-red-800 text-white rounded-md cursor-pointer disabled:opacity-50 flex items-center gap-1"
                            >
                              {deleteOutputMutation.isPending && (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              )}
                              Hapus
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={idx}
                          className="flex items-center justify-between border border-gray-155 rounded-xl bg-slate-50/40 p-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shrink-0 border border-gray-150 text-gray-400 text-xs font-bold">
                              v{hist.version}
                            </div>
                            <div className="min-w-0 leading-tight">
                              <p
                                className="text-xs font-bold text-gray-700 truncate"
                                title={hist.filename}
                              >
                                {hist.filename}
                              </p>
                              <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                                V{hist.version} • {hist.size} • {hist.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <StatusBadgeContent
                              status={hist.status}
                              className="font-bold text-[9px] px-2 py-0.5 rounded-full"
                            />
                            {hist.file_url && (
                              <button
                                type="button"
                                onClick={() => downloadFile(getFileUrl(hist.file_url), hist.filename)}
                                className="h-7 w-7 rounded-lg hover:bg-slate-100 text-gray-400 hover:text-gray-650 flex items-center justify-center transition-colors cursor-pointer"
                                title="Download file"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteHistoryConfirmId(hist.id ?? null)
                                }
                                className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-400 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ),
                    )}
              </div>
            </div>
          )}

          {/* Feedback Comments Thread Section */}
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
            <FeedbackComment
              comments={comments}
              onAddComment={handleAddComment}
            />
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
            onClick={handleSave}
            className="rounded-lg bg-red-800 hover:bg-red-900 text-white font-semibold px-5 transition-all text-xs cursor-pointer shadow-sm"
          >
            Confirm Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
