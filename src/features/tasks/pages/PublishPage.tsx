import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { PUBLISH_CARD_CONFIG } from "@/features/tasks/constants/cardConfig";
import {
  PublishContent,
  type QueueItem,
} from "@/features/tasks/components/PublishContent";
import { AlertTriangle, Loader2, PenLine } from "lucide-react";
import { RevisionBanner } from "@/features/reviews/components/RevisionBanner";
import {
  getContentsApi,
  publishContentApi,
  updateContentApi,
} from "@/features/contents/api/contentsApi";
import {
  getPlatformConfig,
  getInitialsAndBg,
  getTaskStatusConfig,
  isTaskOverdue,
} from "@/utils/formatter";
import { getTaskTypeConfig } from "@/features/tasks/constants/typeConfig";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import { getTasksApi, updateTaskApi, deleteTaskApi } from "@/features/tasks/api/tasksApi";
import { getTaskOutputsApi, createTaskOutputApi } from "@/features/tasks/api/taskOutputsApi";
import { SpesificDrawer } from "@/features/tasks/components/SpesificDrawer";
import {
  ContentPickerModal,
  type AssignedContentPlan,
} from "@/features/tasks/components/ContentPickerModal";
import type { DraftsItem } from "@/features/tasks/components/Drafts";
import { formatDate } from "@/utils/helpers";

export const PublishPage = () => {
  const queryClient = useQueryClient();
  const { roles } = usePermissions();
  const { user } = useAuth();
  const isLeadOrOwner =
    roles.includes("content_lead") ||
    roles.includes("owner") ||
    roles.includes("superadmin");

  const canSeeAll =
    isLeadOrOwner || roles.includes("admin_social_media");

  // Fetch all contents from the backend
  const { data: apiContents = [], isLoading: loadingContents } = useQuery({
    queryKey: ["contents"],
    queryFn: () => getContentsApi(),
  });

  // Fetch all tasks from the backend (always needed for caption drawer + staff filtering)
  const { data: apiTasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasksApi({ limit: 1000 }),
  });

  // Fetch task outputs across all tasks
  const { data: allOutputs = [], isLoading: loadingOutputs } = useQuery({
    queryKey: ["all-task-outputs", apiTasks.map((t) => t.id)],
    queryFn: async () => {
      if (apiTasks.length === 0) return [];
      const promises = apiTasks.map(async (t) => {
        try {
          const res = await getTaskOutputsApi(t.id);
          return res.map((out) => ({ ...out, task: t }));
        } catch {
          return [];
        }
      });
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: apiTasks.length > 0,
  });

  // Map API Content → QueueItem for PublishContent component
  const publishData = useMemo<QueueItem[]>(() => {
    // Filter tasks based on role/ID
    const userTasks = canSeeAll
      ? apiTasks
      : apiTasks.filter((t) => Number(t.assigned_to) === Number(user?.id));

    // Only show tasks of type "Caption" that are active (excluding to_do tasks, just like Drafts/Uploads)
    const captionTasks = userTasks.filter((t) => {
      const role = t.assignee_roles?.[0] ?? "content_editor";
      return (
        getTaskTypeConfig(role).label === "Caption" &&
        t.status !== "to_do" &&
        t.is_active !== false
      );
    });

    return captionTasks.map((t) => {
      const platform = t.platform_name || "Instagram";
      const config = getPlatformConfig(platform);

      // Map status strings to match QueueItem expectations
      const mapStatus = (status: string, contentStatus?: string): QueueItem["status"] => {
        const norm = status.toLowerCase();
        const contentNorm = contentStatus?.toLowerCase();
        if (contentNorm === "scheduled" && norm === "approved") return "Scheduled";
        if (contentNorm === "published" && norm === "approved") return "Published";
        if (norm === "draft") return "Draft";
        if (norm === "on_progress") return "On Progress";
        if (norm === "approved") return "Approved";
        if (norm === "revision") return "Revision";
        return "Pending";
      };

      // Find the outputs for this specific task
      const taskOutputs = allOutputs.filter((out) => out.task.id === t.id);
      const latestOutput = taskOutputs[0];

      const status = mapStatus(t.status, t.content_status);
      const rawCaption = latestOutput?.caption;
      const isPlaceholder = rawCaption?.startsWith("Uploaded file output for task:");
      const caption = (!isPlaceholder && rawCaption) || undefined;
      const hasCaption = !!caption?.trim();
      const isVideo = t.content_format?.toLowerCase() === "video";

      // Find the output with file_url from any task in the same content plan
      // Exclude script outputs and prefer video files for video formats
      const contentOutputs = allOutputs.filter(
        (out) =>
          Number(out.task?.content_id) === Number(t.content_id) &&
          !!out.file_url
      );
      const nonScriptOutputs = contentOutputs.filter((out) => {
        const role = out.task?.assignee_roles?.[0] ?? "content_editor";
        return getTaskTypeConfig(role).label !== "Script";
      });
      const candidates = nonScriptOutputs.length > 0 ? nonScriptOutputs : contentOutputs;
      let mediaOutput = candidates[0];
      if (isVideo && candidates.length > 0) {
        const videoOutput = candidates.find((out) => {
          const lower = out.file_url?.toLowerCase() ?? "";
          return (
            lower.endsWith(".mp4") ||
            lower.endsWith(".mov") ||
            lower.endsWith(".webm") ||
            lower.endsWith(".avi")
          );
        });
        if (videoOutput) {
          mediaOutput = videoOutput;
        }
      }

      let dateText = "No deadline";
      if (status === "Published") {
        dateText = `Uploaded by ${t.assignee_name || "Social Media Admin"}`;
      } else if (status === "Scheduled" && t.content_scheduled_at) {
        const d = new Date(t.content_scheduled_at);
        const dateStr = formatDate(t.content_scheduled_at);
        const timeStr = d.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
        dateText = `${dateStr} • ${timeStr}`;
      } else if (t.deadline) {
        dateText = `${isTaskOverdue(t.deadline, t.status) ? "Overdue" : "Due"} ${formatDate(t.deadline)}`;
      }

      // Find the hashtag: prefer this task's output, fallback to any output in same content plan
      let hashtag = latestOutput?.hashtag || "";
      if (!hashtag) {
        const anyHashtagOutput = allOutputs.find(
          (out) =>
            Number(out.task?.content_id) === Number(t.content_id) &&
            !!out.hashtag
        );
        if (anyHashtagOutput) {
          hashtag = anyHashtagOutput.hashtag || "";
        }
      }

      const contentItem = apiContents.find((c) => Number(c.id) === Number(t.content_id));
      const contentUrl = contentItem?.content_url || "";

      return {
        id: t.id,
        title: t.title,
        type: isVideo ? "video" : "image",
        file_url: mediaOutput?.file_url,
        platform,
        platformColorKey: t.platform_color_key,
        platformBg: config.bg,
        category: t.pillar_name || "General",
        pillars: t.pillars,
        categoryBg: "bg-blue-50 text-blue-600 hover:bg-blue-50 border-none",
        dateText,
        status,
        caption,
        hashtag: hashtag || undefined,
        isPublishable:
          (status === "Scheduled" || status === "Approved") && hasCaption,
        isOverdue: isTaskOverdue(t.deadline ?? null, t.status),
        assigneeName: t.assignee_name,
        publisher_name: t.assignee_name,
        content_id: t.content_id,
        content_url: contentUrl || undefined,
      };
    });
  }, [apiTasks, allOutputs, canSeeAll, user, apiContents]);

  // Dynamically calculate metrics
  const cardData = useMemo(() => {
    const total = publishData.length;
    const onProgress = publishData.filter(
      (i) => i.status === "On Progress" || i.status === "Draft",
    ).length;
    const review = publishData.filter(
      (i) => i.status === "Pending" || i.status === "Waiting Approval",
    ).length;
    const readyToPublish = publishData.filter(
      (i) => i.status === "Approved",
    ).length;
    const scheduled = publishData.filter(
      (i) => i.status === "Scheduled",
    ).length;

    return PUBLISH_CARD_CONFIG.map((config) => {
      let val = 0;
      if (config.title === "Total Queue") val = total;
      else if (config.title === "On Progress") val = onProgress;
      else if (config.title === "Review") val = review;
      else if (config.title === "Ready to Publish") val = readyToPublish;
      else if (config.title === "Scheduled") val = scheduled;

      return {
        title: config.title,
        value: val,
        description: config.description,
        icon: config.icon,
        iconColor: config.iconColor,
        iconBgColor: config.iconBgColor,
      };
    });
  }, [publishData]);

  // Mutations
  const publishMutation = useMutation({
    mutationFn: async ({
      contentId,
      taskId,
      status,
      date,
      time,
      hashtags,
    }: {
      contentId: number;
      taskId: number;
      status: string;
      date?: string;
      time?: string;
      hashtags?: string;
    }) => {
      const normStatus = status.toLowerCase();
      if (normStatus === "published") {
        await publishContentApi(contentId);
      } else if (normStatus === "scheduled") {
        const scheduledDateTime = date && time ? `${date}T${time}` : undefined;
        await updateContentApi(contentId, {
          status: "scheduled",
          scheduled_at: scheduledDateTime,
        });
        if (hashtags) {
          const taskOutputs = allOutputs.filter((out) => out.task.id === taskId);
          const latestOutput = taskOutputs[0];
          const rawCaption = latestOutput?.caption || "";
          const newCaption = `${rawCaption} ${hashtags}`.trim();
          
          const formData = new FormData();
          formData.append("task_id", String(taskId));
          formData.append("caption", newCaption);
          formData.append("hashtag", hashtags);
          await createTaskOutputApi(formData);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["all-task-outputs"] });
    },
  });

  const updateCaptionMutation = useMutation({
    mutationFn: async ({ taskId, caption }: { taskId: number; caption: string }) => {
      const formData = new FormData();
      formData.append("task_id", String(taskId));
      formData.append("caption", caption);
      await createTaskOutputApi(formData);
      // After saving caption, set task status to "review"
      await updateTaskApi(taskId, { status: "review" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-task-outputs"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const removeTaskMutation = useMutation({
    mutationFn: (id: number) => deleteTaskApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handlePublish = (item: QueueItem, date?: string, time?: string, hashtags?: string) => {
    const rawTask = apiTasks.find((t) => Number(t.id) === Number(item.id));
    if (!rawTask) return;
    publishMutation.mutate({
      contentId: Number(rawTask.content_id),
      taskId: Number(rawTask.id),
      status: item.status,
      date,
      time,
      hashtags,
    });
  };

  const handleCaption = (item: QueueItem) => {
    updateCaptionMutation.mutate({
      taskId: Number(item.id),
      caption: item.caption || "",
    });
  };

  const handleRemove = (id: string | number) => {
    removeTaskMutation.mutate(Number(id));
  };

  // Find contents that are scheduled/approved but missing captions
  const missingCaptionsCount = useMemo(() => {
    return publishData.filter(
      (i) =>
        (i.status === "Scheduled" || i.status === "Approved") && !i.caption,
    ).length;
  }, [publishData]);

  const revisions = useMemo(() => {
    return publishData.filter((i) => i.status === "Revision");
  }, [publishData]);

  // --- Caption Task Drawer States ---
  const [isCaptionPickerOpen, setIsCaptionPickerOpen] = useState(false);
  const [selectedCaptionTask, setSelectedCaptionTask] =
    useState<DraftsItem | null>(null);
  const [isCaptionDrawerOpen, setIsCaptionDrawerOpen] = useState(false);

  const startCaptionMutation = useMutation({
    mutationFn: (taskId: number) =>
      updateTaskApi(taskId, { status: "on_progress" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleSelectCaptionTask = (plan: AssignedContentPlan) => {
    startCaptionMutation.mutate(Number(plan.id));
    setIsCaptionPickerOpen(false);
  };

  // Exclude content plans that already have caption tasks in active/completed statuses (not 'to_do')
  const activeCaptionContentIds = useMemo(() => {
    const activeTasks = canSeeAll
      ? apiTasks
      : apiTasks.filter((t) => Number(t.assigned_to) === Number(user?.id));

    return activeTasks
      .filter((t) => {
        const role = t.assignee_roles?.[0] ?? "content_editor";
        return (
          getTaskTypeConfig(role).label === "Caption" && t.status !== "to_do"
        );
      })
      .map((t) => Number(t.content_id))
      .filter(Boolean);
  }, [apiTasks, canSeeAll, user]);

  const handleOpenCaptionDrawer = (item: QueueItem) => {
    // Find the caption task for this content
    const rawTask = apiTasks.find((t) => {
      const role = t.assignee_roles?.[0] ?? "content_editor";
      const isUserCaptionTask =
        canSeeAll || Number(t.assigned_to) === Number(user?.id);
      return (
        Number(t.id) === Number(item.id) &&
        getTaskTypeConfig(role).label === "Caption" &&
        isUserCaptionTask &&
        t.is_active !== false
      );
    });
    if (!rawTask) return;

    // Transition to_do task to on_progress
    if (rawTask.status === "to_do") {
      startCaptionMutation.mutate(Number(rawTask.id));
    }

    const assignerName = rawTask.lead_name || "Content Lead";
    const { initials: assignerInitials } = getInitialsAndBg(assignerName);
    const statusVisual = getTaskStatusConfig(rawTask.status);

    const captionDraftItem: DraftsItem = {
      id: rawTask.id,
      title: rawTask.title,
      category: rawTask.category_name ?? "General",
      categoryBg: "bg-violet-50 text-violet-600 hover:bg-violet-50 border-none",
      status: statusVisual.label,
      statusBg: statusVisual.bg,
      statusDot: statusVisual.dot,
      revisionNote: rawTask.description || undefined,
      wordCount: 0,
      savedTimeText: rawTask.deadline
        ? `Due ${formatDate(rawTask.deadline)}`
        : "No deadline",
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
      assigner: {
        name: assignerName,
        role: "admin_social_media",
        initials: assignerInitials,
      },
      content_id: rawTask.content_id,
      deadline: rawTask.deadline || null,
    };

    setSelectedCaptionTask(captionDraftItem);
    setIsCaptionDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cardData.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>

      {revisions.map((item) => (
        <RevisionBanner
          key={item.id}
          title={item.title}
          description="Caption ini memerlukan revisi. Silakan klik 'Revise' untuk melihat detail feedback lengkap di kolom diskusi."
          onReUpload={() => handleOpenCaptionDrawer(item)}
          buttonText="Revise"
          buttonIcon={<PenLine className="h-4 w-4 stroke-[2.5]" />}
        />
      ))}

      {missingCaptionsCount > 0 && (
        <div className="w-full p-3 bg-amber-50 rounded-lg border border-amber-300 text-amber-700 text-sm flex items-center gap-2 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <div>
            <span className="font-semibold">
              {missingCaptionsCount} content items{" "}
            </span>
            ready to publish but missing captions
          </div>
        </div>
      )}

      {loadingContents || loadingOutputs ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <PublishContent
          items={publishData}
          onPublish={handlePublish}
          onCaption={handleCaption}
          onRemove={handleRemove}
          onCaptionClick={() => setIsCaptionPickerOpen(true)}
          onOpenCaptionDrawer={handleOpenCaptionDrawer}
          canPublish={canSeeAll}
        />
      )}

      {/* Caption Task Picker Modal */}
      <ContentPickerModal
        isOpen={isCaptionPickerOpen}
        onClose={() => setIsCaptionPickerOpen(false)}
        onSelect={handleSelectCaptionTask}
        itemType="caption"
        excludeContentIds={activeCaptionContentIds}
      />

      {/* Caption Task Specific Drawer */}
      <SpesificDrawer
        key={selectedCaptionTask?.id ?? "caption-new"}
        isOpen={isCaptionDrawerOpen}
        onClose={() => {
          setIsCaptionDrawerOpen(false);
          setSelectedCaptionTask(null);
        }}
        item={selectedCaptionTask}
        itemType="draft"
      />
    </div>
  );
};
