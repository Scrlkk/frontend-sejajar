import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { RevisionBanner } from "@/features/reviews/components/RevisionBanner";
import { DRAFTS_CARD_CONFIG } from "@/features/tasks/constants/cardConfig";
import { FilePen, Loader2 } from "lucide-react";
import { Drafts, type DraftsItem } from "@/features/tasks/components/Drafts";
import { SpesificDrawer } from "@/features/tasks/components/SpesificDrawer";
import {
  ContentPickerModal,
  type AssignedContentPlan,
} from "@/features/tasks/components/ContentPickerModal";
import { getTasksApi, updateTaskApi } from "@/features/tasks/api/tasksApi";
import { getTaskOutputsApi } from "@/features/tasks/api/taskOutputsApi";
import { getTaskTypeConfig } from "@/features/tasks/constants/typeConfig";
import { getInitialsAndBg, getTaskStatusConfig } from "@/utils/formatter";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";

import { wordCount as helperWordCount, formatDate } from "@/utils/helpers";

export const DraftsPage = () => {
  const { roles } = usePermissions();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isLeadOrOwner =
    roles.includes("content_lead") ||
    roles.includes("owner") ||
    roles.includes("superadmin");

  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);

  // Fetch tasks
  const { data: apiTasks = [], isLoading: loadingTasks } = useQuery({
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

  // Filter tasks to show only "Script" type tasks (naskah)
  const drafts = useMemo<DraftsItem[]>(() => {
    // Filter tasks based on role/ID
    const userTasks = isLeadOrOwner
      ? apiTasks
      : apiTasks.filter((t) => Number(t.assigned_to) === Number(user?.id));

    const scriptTasks = userTasks.filter((t) => {
      const role = t.assignee_roles?.[0] ?? "content_editor";
      return getTaskTypeConfig(role).label === "Script" && t.status !== "to_do";
    });

    return scriptTasks.map((t) => {
      const assignerName = t.lead_name || "Content Lead";
      const { initials: assignerInitials } = getInitialsAndBg(assignerName);
      const statusVisual = getTaskStatusConfig(t.status);

      // Find the outputs for this specific task
      const taskOutputs = allOutputs.filter((out) => out.task.id === t.id);
      const latestOutput = taskOutputs[0];

      let wordCount = helperWordCount(t.description || "");
      let savedTimeText = t.deadline
        ? `Due ${formatDate(t.deadline)}`
        : "No deadline";

      if (latestOutput) {
        const filename = latestOutput.file_url?.split("/").pop() ?? "";
        const ext = filename.split(".").pop()?.toUpperCase() || "DOC";
        const size = latestOutput.file_size || "1.2 MB";
        const uploadDate = latestOutput.submitted_at || latestOutput.created_at;
        const formattedDate = uploadDate
          ? formatDate(uploadDate)
          : "Just now";

        wordCount = helperWordCount(latestOutput.caption || t.description || "");
        savedTimeText = `${ext} • ${size} • Uploaded ${formattedDate}`;
      }

      return {
        id: t.id,
        title: t.title,
        category: t.category_name ?? "General",
        categoryBg: "bg-blue-50 text-blue-600 hover:bg-blue-50 border-none",
        status: statusVisual.label,
        statusBg: statusVisual.bg,
        statusDot: statusVisual.dot,
        revisionNote: t.description || undefined,
        wordCount,
        savedTimeText,
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600",
        assigner: {
          name: assignerName,
          role: "Content Lead",
          initials: assignerInitials,
        },
        content_id: t.content_id,
        deadline: t.deadline || null,
      };
    }).sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [apiTasks, allOutputs, isLeadOrOwner, user]);

  // Dynamically calculate metrics
  const cardData = useMemo(() => {
    const total = drafts.length;
    const toDo = drafts.filter((d) => d.status.toLowerCase() === "to do" || d.status.toLowerCase() === "to_do").length;
    const onProgress = drafts.filter((d) => d.status.toLowerCase() === "in progress" || d.status.toLowerCase() === "on progress" || d.status.toLowerCase() === "on_progress").length;
    const pending = drafts.filter((d) => d.status.toLowerCase() === "pending" || d.status.toLowerCase() === "review").length;
    const revision = drafts.filter((d) => d.status.toLowerCase() === "revision").length;

    return DRAFTS_CARD_CONFIG.map((config) => {
      let val = 0;
      if (config.title === "Total Drafts") val = total;
      else if (config.title === "To Do") val = toDo;
      else if (config.title === "On Progress") val = onProgress;
      else if (config.title === "Review") val = pending;
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
  }, [drafts]);

  const [selectedDraft, setSelectedDraft] = useState<DraftsItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const draftIdParam = searchParams.get("id");
  const lastProcessedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (draftIdParam) {
      if (lastProcessedIdRef.current !== draftIdParam) {
        const draft = drafts.find((d) => String(d.id) === String(draftIdParam));
        if (draft) {
          const timer = setTimeout(() => {
            lastProcessedIdRef.current = draftIdParam;
            setSelectedDraft(draft);
            setIsDrawerOpen(true);
          }, 0);
          return () => clearTimeout(timer);
        }
      }
    } else {
      lastProcessedIdRef.current = null;
    }
  }, [draftIdParam, drafts]);

  const handleReUploadClick = () => {
    const revisionItem =
      drafts.find((d) => d.status.toLowerCase() === "revision") || drafts[0];
    setSelectedDraft(revisionItem);
    setIsDrawerOpen(true);
    if (revisionItem) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("id", String(revisionItem.id));
      setSearchParams(newParams, { replace: true });
    }
  };

  const handleOpenDraft = (item: DraftsItem) => {
    setSelectedDraft(item);
    setIsDrawerOpen(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("id", String(item.id));
    setSearchParams(newParams, { replace: true });
  };

  const startDraftMutation = useMutation({
    mutationFn: (taskId: number) => updateTaskApi(taskId, { status: "on_progress" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsPickerModalOpen(false);
    },
  });

  const handleSelectContentPlan = (plan: AssignedContentPlan) => {
    startDraftMutation.mutate(Number(plan.id));
  };

  const revisions = drafts.filter((d) => d.status.toLowerCase() === "revision");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cardData.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>

      {revisions.map((banner) => (
        <RevisionBanner
          key={banner.id}
          title={banner.title}
          description="Naskah ini memerlukan revisi. Silakan klik 'Revise' untuk melihat detail feedback lengkap di kolom diskusi."
          onReUpload={handleReUploadClick}
          buttonText="Revise"
          buttonIcon={<FilePen className="h-4 w-4 stroke-[2.5]" />}
        />
      ))}

      {loadingTasks || loadingOutputs ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <Drafts
          drafts={drafts}
          onNewDraft={() => setIsPickerModalOpen(true)}
          onOpen={handleOpenDraft}
        />
      )}

      <SpesificDrawer
        key={selectedDraft?.id ?? "new"}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedDraft(null);
          if (searchParams.has("id")) {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("id");
            setSearchParams(newParams, { replace: true });
          }
        }}
        item={selectedDraft}
        itemType="draft"
      />

      <ContentPickerModal
        isOpen={isPickerModalOpen}
        onClose={() => setIsPickerModalOpen(false)}
        onSelect={handleSelectContentPlan}
        itemType="draft"
        excludeContentIds={drafts.map((d) => Number(d.content_id)).filter(Boolean)}
      />
    </div>
  );
};
