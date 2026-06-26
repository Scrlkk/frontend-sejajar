import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { UPLOADS_CARD_CONFIG } from "@/features/tasks/constants/cardConfig";
import { RevisionBanner } from "@/features/reviews/components/RevisionBanner";
import {
  Uploads,
  type UploadedVideoItem,
} from "@/features/tasks/components/Uploads";
import { Upload, Loader2 } from "lucide-react";
import { SpesificDrawer } from "@/features/tasks/components/SpesificDrawer";
import {
  ContentPickerModal,
  type AssignedContentPlan,
} from "@/features/tasks/components/ContentPickerModal";
import {
  getTasksApi,
  updateTaskApi,
} from "@/features/tasks/api/tasksApi";
import {
  getTaskOutputsApi,
} from "@/features/tasks/api/taskOutputsApi";
import {
  getInitialsAndBg,
  isTaskOverdue,
  getTaskStatusConfig,
  getTaskTypeConfig,
} from "@/utils/formatter";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { formatDate } from "@/utils/helpers";

const getFormattedDeadline = (deadlineStr?: string | null) => {
  if (!deadlineStr) return "No deadline";
  try {
    const formatted = formatDate(deadlineStr);
    if (formatted) {
      return `Due ${formatted}`;
    }
  } catch {
    // ignore
  }
  return `Due ${deadlineStr}`;
};

export const UploadsPage = () => {
  const { roles } = usePermissions();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isLeadOrOwner =
    roles.includes("content_lead") ||
    roles.includes("owner") ||
    roles.includes("superadmin");

  // Fetch tasks
  const { data: apiTasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasksApi(),
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

  // Map API data → UploadedVideoItem
  const uploads = useMemo<UploadedVideoItem[]>(() => {
    // Filter tasks based on role/ID
    const userTasks = isLeadOrOwner
      ? apiTasks
      : apiTasks.filter((t) => Number(t.assigned_to) === Number(user?.id));

    // Filter userTasks to only include upload tasks (non-Script tasks) and exclude 'to_do'
    const uploadTasks = userTasks.filter((t) => {
      const role = t.assignee_roles?.[0] ?? "content_editor";
      return getTaskTypeConfig(role).label !== "Script" && t.status !== "to_do";
    });

    const items: UploadedVideoItem[] = [];

    uploadTasks.forEach((t) => {
      const taskOutputs = allOutputs.filter((out) => out.task.id === t.id);
      const latestOutput = taskOutputs[0];

      const assignerName = t.lead_name || "Content Lead";
      const { initials: assignerInitials } = getInitialsAndBg(assignerName);
      const overdue = isTaskOverdue(t.deadline ?? null, t.status);
      const statusVisual = getTaskStatusConfig(t.status);
      const isVideo =
        t.platform_name?.toLowerCase() === "tiktok" ||
        t.platform_name?.toLowerCase() === "youtube";

      if (latestOutput) {
        const isOutputVideo =
          latestOutput.file_url.endsWith(".mp4") ||
          latestOutput.file_url.toLowerCase().includes("video");

        items.push({
          id: t.id,
          latest_output_id: latestOutput.id,
          title: t.title,
          type: isOutputVideo ? "video" : "image",
          platform: t.platform_name || "Instagram",
          platformColorKey: t.platform_color_key,
          platformBg:
            t.platform_name?.toLowerCase() === "tiktok"
              ? "bg-[#252f41] text-white"
              : t.platform_name?.toLowerCase() === "youtube"
                ? "bg-red-600 text-white"
                : "bg-pink-600 text-white",
          fileSizeText: latestOutput.file_size || (isOutputVideo ? "12.5 MB" : "3.4 MB"),
          uploadedTimeText: latestOutput.submitted_at || latestOutput.created_at
            ? `Uploaded ${formatDate(latestOutput.submitted_at || latestOutput.created_at)}`
            : "Just now",
          status: statusVisual.label === "Review" ? "Pending" : statusVisual.label,
          statusBg: statusVisual.bg,
          statusDot: statusVisual.dot,
          revisionNote: latestOutput.caption || undefined,
          isOverdue: overdue,
          assigner: {
            name: assignerName,
            role: "Content Lead",
            initials: assignerInitials,
          },
          content_id: t.content_id,
          task_id: t.id,
          file_url: latestOutput.file_url,
          deadline: t.deadline || null,
        });
      } else {
        items.push({
          id: t.id,
          title: t.title,
          type: isVideo ? "video" : "image",
          platform: t.platform_name || "Instagram",
          platformColorKey: t.platform_color_key,
          platformBg:
            t.platform_name?.toLowerCase() === "tiktok"
              ? "bg-[#252f41] text-white"
              : t.platform_name?.toLowerCase() === "youtube"
                ? "bg-red-600 text-white"
                : "bg-pink-600 text-white",
          fileSizeText: "0 B",
          uploadedTimeText: getFormattedDeadline(t.deadline),
          status: statusVisual.label === "Review" ? "Pending" : statusVisual.label,
          statusBg: statusVisual.bg,
          statusDot: statusVisual.dot,
          revisionNote: t.description || undefined,
          isOverdue: overdue,
          assigner: {
            name: assignerName,
            role: "Content Lead",
            initials: assignerInitials,
          },
          content_id: t.content_id,
          task_id: t.id,
          deadline: t.deadline || null,
        });
      }
    });

    return items.sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [allOutputs, apiTasks, isLeadOrOwner, user]);

  // Dynamically calculate metrics
  const cardData = useMemo(() => {
    const total = uploads.length;
    const onProgress = uploads.filter((u) => u.status === "On Progress").length;
    const pending = uploads.filter((u) => u.status === "Pending").length;
    const approved = uploads.filter((u) => u.status === "Approved").length;
    const revision = uploads.filter((u) => u.status === "Revision").length;

    return UPLOADS_CARD_CONFIG.map((config) => {
      let val = 0;
      if (config.title === "Total Uploads") val = total;
      else if (config.title === "On Progress") val = onProgress;
      else if (config.title === "Review") val = pending;
      else if (config.title === "Approved") val = approved;
      else if (config.title === "Revision") val = revision;

      return {
        title: config.title,
        value: val,
        description: config.description,
        icon: config.icon,
        iconColor: config.iconColor,
        iconBgColor: config.iconBgColor,
      };
    });
  }, [uploads]);

  const [selectedUpload, setSelectedUpload] = useState<UploadedVideoItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const uploadIdParam = searchParams.get("id");
  const lastProcessedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (uploadIdParam) {
      if (lastProcessedIdRef.current !== uploadIdParam) {
        const upload = uploads.find(
          (u) => String(u.id) === String(uploadIdParam),
        );
        if (upload) {
          const timer = setTimeout(() => {
            lastProcessedIdRef.current = uploadIdParam;
            setSelectedUpload(upload);
            setIsDrawerOpen(true);
          }, 0);
          return () => clearTimeout(timer);
        }
      }
    } else {
      lastProcessedIdRef.current = null;
    }
  }, [uploadIdParam, uploads]);

  const handleReUploadClick = () => {
    const revisionItem =
      uploads.find((u) => u.status === "Revision") || uploads[0];
    setSelectedUpload(revisionItem);
    setIsDrawerOpen(true);
    if (revisionItem) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("id", String(revisionItem.id));
      setSearchParams(newParams, { replace: true });
    }
  };

  const handleOpenUpload = (item: UploadedVideoItem) => {
    setSelectedUpload(item);
    setIsDrawerOpen(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("id", String(item.id));
    setSearchParams(newParams, { replace: true });
  };

  const startUploadTaskMutation = useMutation({
    mutationFn: (taskId: number) => updateTaskApi(taskId, { status: "on_progress" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["all-task-outputs"] });
      setIsPickerModalOpen(false);
    },
  });

  const handleSelectContentPlan = (plan: AssignedContentPlan) => {
    startUploadTaskMutation.mutate(plan.id as number);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cardData.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>

      {uploads.some((u) => u.status === "Revision") && (
        <RevisionBanner
          title="Revision Required"
          description="File ini memerlukan revisi. Silakan klik 'Re-upload' untuk mengunggah ulang file yang telah diperbaiki."
          onReUpload={handleReUploadClick}
          buttonText="Re-upload"
          buttonIcon={<Upload className="h-4 w-4 stroke-[2.5]" />}
        />
      )}

      {loadingOutputs ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <Uploads
          uploads={uploads}
          onUploadNew={() => setIsPickerModalOpen(true)}
          onOpen={handleOpenUpload}
        />
      )}

      <SpesificDrawer
        key={selectedUpload?.id ?? "new"}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedUpload(null);
          if (searchParams.has("id")) {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("id");
            setSearchParams(newParams, { replace: true });
          }
        }}
        item={selectedUpload}
        itemType="upload"
      />

      <ContentPickerModal
        isOpen={isPickerModalOpen}
        onClose={() => setIsPickerModalOpen(false)}
        onSelect={handleSelectContentPlan}
        itemType="upload"
        excludeContentIds={uploads.map((u) => Number(u.content_id)).filter(Boolean)}
      />
    </div>
  );
};
