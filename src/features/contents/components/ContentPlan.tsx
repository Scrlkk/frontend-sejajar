import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import { ContentModal } from "@/features/contents/components/ContentModal";
import type { ContentFormValues } from "@/features/contents/components/ContentModal";
import type { ContentPillar } from "@/features/contents/api/contentsApi";
import { ContentDetailModal } from "@/features/contents/components/ContentDetailModal";
import { AssignTeams } from "@/features/contents/components/AssignTeams";
import { RequestRevision } from "@/features/reviews/components/RequestRevision";
import { TasksModalAdd } from "@/features/tasks/components/TasksModalAdd";
import { ContentBoard } from "@/features/contents/components/ContentBoard";
import { DeleteModal } from "@/features/tasks/components/DeleteModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContentsApi,
  createContentApi,
  updateContentApi,
  deleteContentApi,
  restoreContentApi,
  mapContentToCardItem,
} from "@/features/contents/api/contentsApi";
import type {
  CreateContentPayload,
  UpdateContentPayload,
} from "@/features/contents/api/contentsApi";
import { getPlatformsApi } from "@/features/platforms/api/platformsApi";
import { getContentCategoriesApi } from "@/features/contents/api/contentCategoriesApi";
import { getPillarsApi } from "@/features/pillars/api/pillarsApi";
import { getUsersApi } from "@/features/users/api/usersApi";
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
} from "@/features/tasks/api/tasksApi";
import { getInitials, getAvatarBg } from "@/utils/formatter";
import toast from "react-hot-toast";
import { createReviewApi } from "@/features/reviews/api/reviewsApi";

export interface TeamMember {
  name: string;
  initials: string;
  avatarBg: string;
  role?: string;
}

export interface ContentPlanCardItem {
  id: string;
  contractId?: number;
  title: string;
  category: string;
  categoryBg?: string; // Optional custom Tailwind classes for badge styling
  categoryColorKey?: string | null;
  platform: string;
  platformColorKey?: string | null;
  format: string; // e.g. "Video", "Image", etc.
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  overdue?: boolean; // Set to true if card is overdue
  feedback?: string; // Optional feedback text for revisions
  assignedTeam?: TeamMember[];
  status:
    | "Draft"
    | "Assigned"
    | "On Progress"
    | "Review"
    | "Revision"
    | "Approved"
    | "Scheduled"
    | "Published"
    | "Deleted";
  objective?: string;
  targetAudience?: string;
  pillar?: string;          // first pillar name (backward compat)
  pillars?: ContentPillar[]; // full multi-pillar array
  notes?: string;
  tasks?: Record<number, { title: string; description: string; deadline?: string | null }>;
  taskStats?: {
    total: number;
    approved: number;
    pending: number;
  };
  fileUrl?: string; // Optional published content URL
}

import { useParams } from "react-router-dom";

export interface ContentPlanProps {
  contractId?: number;
  initialCards?: ContentPlanCardItem[];
  /** Called by parent to receive the "open modal" trigger function */
  onRegisterOpenModal?: (openFn: () => void) => void;
  onRegisterFeedbackModal?: (openFn: () => void) => void;
}

interface FilterOption {
  label: string;
  status: ContentPlanCardItem["status"] | "All";
  colorClass: string; // Tailwind dot class
}

const FILTER_OPTIONS: FilterOption[] = [
  { label: "All", status: "All", colorClass: "" },
  { label: "Draft", status: "Draft", colorClass: "bg-slate-500" },
  { label: "Assigned", status: "Assigned", colorClass: "bg-blue-600" },
  { label: "On Progress", status: "On Progress", colorClass: "bg-amber-600" },
  {
    label: "Review",
    status: "Review",
    colorClass: "bg-purple-600",
  },
  { label: "Revision", status: "Revision", colorClass: "bg-red-600" },
  { label: "Approved", status: "Approved", colorClass: "bg-emerald-600" },
  { label: "Scheduled", status: "Scheduled", colorClass: "bg-blue-600" },
  { label: "Published", status: "Published", colorClass: "bg-cyan-600" },
  { label: "Deleted", status: "Deleted", colorClass: "bg-gray-400" },
];

const getActiveTabClass = (status: string) => {
  switch (status) {
    case "All":
      return "text-slate-800 bg-white shadow-xs font-semibold border-slate-200/50";
    case "Draft":
      return "text-slate-700 bg-white shadow-xs font-semibold border-slate-200/50";
    case "Assigned":
      return "text-indigo-600 bg-white shadow-xs font-semibold border-indigo-200/50";
    case "On Progress":
      return "text-amber-700 bg-white shadow-xs font-semibold border-amber-200/50";
    case "Review":
      return "text-purple-600 bg-white shadow-xs font-semibold border-purple-200/50";
    case "Revision":
      return "text-red-600 bg-white shadow-xs font-semibold border-red-200/50";
    case "Approved":
      return "text-emerald-600 bg-white shadow-xs font-semibold border-emerald-200/50";
    case "Scheduled":
      return "text-blue-600 bg-white shadow-xs font-semibold border-blue-200/50";
    case "Published":
      return "text-cyan-600 bg-white shadow-xs font-semibold border-cyan-200/50";
    case "Deleted":
      return "text-gray-600 bg-white shadow-xs font-semibold border-gray-200/50";
    default:
      return "text-slate-800 bg-white shadow-xs font-semibold border-slate-200/50";
  }
};

export function ContentPlan({
  contractId,
  onRegisterOpenModal,
  onRegisterFeedbackModal,
}: ContentPlanProps) {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const resolvedContractId = contractId ?? (Number(id) || 1);

  const invalidateAllContents = () => {
    queryClient.invalidateQueries({
      queryKey: ["contents", "active", { contract_id: resolvedContractId }],
    });
    queryClient.invalidateQueries({
      queryKey: ["contents", "deleted", { contract_id: resolvedContractId }],
    });
    queryClient.invalidateQueries({
      queryKey: ["contents", { contract_id: resolvedContractId }],
    });
    queryClient.invalidateQueries({
      queryKey: ["contract", resolvedContractId],
    });
  };

  // 1. Queries
  const { data: activeContents = [] } = useQuery({
    queryKey: ["contents", "active", { contract_id: resolvedContractId }],
    queryFn: () =>
      getContentsApi({ contract_id: resolvedContractId, limit: 1000 }),
  });

  const { data: deletedContents = [] } = useQuery({
    queryKey: ["contents", "deleted", { contract_id: resolvedContractId }],
    queryFn: () =>
      getContentsApi({
        contract_id: resolvedContractId,
        status: "deleted",
        limit: 1000,
      }),
  });

  const contents = useMemo(() => {
    return [...activeContents, ...deletedContents];
  }, [activeContents, deletedContents]);

  const { data: tasksList = [] } = useQuery({
    queryKey: ["tasks", { contract_id: resolvedContractId }],
    queryFn: () =>
      getTasksApi({ contract_id: resolvedContractId, limit: 1000 }),
  });

  const { data: platformsList = [] } = useQuery({
    queryKey: ["platforms"],
    queryFn: () => getPlatformsApi(),
  });

  const { data: categoriesList = [] } = useQuery({
    queryKey: ["content-categories"],
    queryFn: () => getContentCategoriesApi(),
  });

  const { data: pillarsList = [] } = useQuery({
    queryKey: ["pillars"],
    queryFn: () => getPillarsApi({ limit: 100 }),
  });

  const { data: usersList = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsersApi(),
  });

  // 2. Mapped Cards from contents and tasks
  const cards = useMemo(() => {
    return contents.map((c) => {
      const tasksForContent = tasksList.filter((t) => t.content_id === c.id);
      const assignedTeam = (c.teams || []).map((t) => ({
        name: t.full_name,
        initials: getInitials(t.full_name),
        avatarBg: getAvatarBg(t.full_name),
        role: t.roles?.[0] || "Team Member",
      }));

      const tasksMap: Record<
        number,
        { title: string; description: string; deadline?: string | null }
      > = {};
      (c.teams || []).forEach((t, idx) => {
        const userTask = tasksForContent.find((task) => task.assigned_to === t.id);
        if (userTask) {
          tasksMap[idx] = {
            title: userTask.title || "",
            description: userTask.description || "",
            deadline: userTask.deadline || null,
          };
        }
      });

      const totalTasks = tasksForContent.length;
      const approvedTasks = tasksForContent.filter(
        (t) => t.status === "approved",
      ).length;
      const pendingTasks = tasksForContent.filter(
        (t) => t.status === "pending" || t.status === "review",
      ).length;

      const mapped = mapContentToCardItem(c, assignedTeam, tasksMap);
      mapped.taskStats = {
        total: totalTasks,
        approved: approvedTasks,
        pending: pendingTasks,
      };
      return mapped;
    });
  }, [contents, tasksList]);

  // 3. Mutations
  const createMutation = useMutation({
    mutationFn: createContentApi,
    onSuccess: () => {
      invalidateAllContents();
      toast.success("Rencana konten berhasil dibuat");
    },
    onError: () => {
      toast.error("Gagal membuat rencana konten");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateContentPayload;
    }) => updateContentApi(id, payload),
    onSuccess: () => {
      invalidateAllContents();
      toast.success("Rencana konten berhasil diperbarui");
    },
    onError: () => {
      toast.error("Gagal memperbarui rencana konten");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContentApi,
    onSuccess: () => {
      invalidateAllContents();
      toast.success("Rencana konten berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus rencana konten");
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreContentApi,
    onSuccess: () => {
      invalidateAllContents();
      toast.success("Rencana konten berhasil dikembalikan");
    },
    onError: () => {
      toast.error("Gagal mengembalikan rencana konten");
    },
  });


  const assignTeamMutation = useMutation({
    mutationFn: async ({
      cardId,
      assignedTeam,
    }: {
      cardId: string;
      assignedTeam: TeamMember[];
    }) => {
      const contentId = Number(cardId);

      const selectedUserIds = assignedTeam
        .map((member) => usersList.find((u) => u.full_name === member.name)?.id)
        .filter((id): id is number => id !== undefined);

      // Update status if transitioned between draft & assigned
      const card = cards.find((c) => c.id === cardId);
      let newStatus: string | undefined;
      if (card) {
        const hasAssignedTeam = selectedUserIds.length > 0;
        if (card.status === "Draft" && hasAssignedTeam) {
          newStatus = "assigned";
        } else if (card.status === "Assigned" && !hasAssignedTeam) {
          newStatus = "draft";
        }
      }

      await updateContentApi(contentId, {
        team_user_ids: selectedUserIds,
        ...(newStatus ? { status: newStatus } : {}),
      });
    },
    onSuccess: () => {
      invalidateAllContents();
      queryClient.invalidateQueries({
        queryKey: ["tasks", { contract_id: resolvedContractId }],
      });
      toast.success("Anggota tim berhasil ditugaskan");
    },
    onError: () => {
      toast.error("Gagal menugaskan anggota tim");
    },
  });

  const saveSingleTaskMutation = useMutation({
    mutationFn: async ({
      cardId,
      idx,
      taskData,
    }: {
      cardId: string;
      idx: number;
      taskData: { title: string; description: string; deadline: string };
    }) => {
      const contentId = Number(cardId);
      const existingTasks = tasksList.filter((t) => t.content_id === contentId);
      const card = cards.find((c) => c.id === cardId);
      if (!card || !card.assignedTeam) return;

      const member = card.assignedTeam[idx];
      if (!member) return;

      const userId = usersList.find((u) => u.full_name === member.name)?.id;
      if (!userId) return;

      const existingTask = existingTasks.find(
        (t) => t.assigned_to === userId,
      );
      if (existingTask) {
        await updateTaskApi(existingTask.id, {
          title: taskData.title,
          description: taskData.description,
          deadline: taskData.deadline,
        });
      } else {
        await createTaskApi({
          content_id: contentId,
          assigned_to: userId,
          title: taskData.title,
          description: taskData.description,
          status: "to_do",
          deadline: taskData.deadline,
        });
      }

      // Transition content status to 'on_progress' if currently in Draft or Assigned
      if (card.status === "Draft" || card.status === "Assigned") {
        await updateContentApi(contentId, {
          status: "on_progress",
        });
      }
    },
    onSuccess: () => {
      invalidateAllContents();
      queryClient.invalidateQueries({
        queryKey: ["tasks", { contract_id: resolvedContractId }],
      });
      toast.success("Tugas berhasil disimpan");
    },
    onError: () => {
      toast.error("Gagal menyimpan tugas");
    },
  });

  const revisionMutation = useMutation({
    mutationFn: async ({
      cardId,
      feedback,
      priority,
      status,
    }: {
      cardId: string;
      feedback: string;
      priority: string;
      status?: string;
    }) => {
      const contentId = Number(cardId);
      const apiStatus = (status || "Revision").toLowerCase().replace(" ", "_");
      await updateContentApi(contentId, {
        status: apiStatus,
        priority: priority.toLowerCase(),
      });

      if (feedback.trim()) {
        await createReviewApi({
          content_id: contentId,
          feedback: feedback.trim(),
        });
      }
    },
    onSuccess: () => {
      invalidateAllContents();
      toast.success("Permintaan revisi berhasil diajukan");
    },
    onError: () => {
      toast.error("Gagal mengajukan revisi");
    },
  });

  const handleUpdateStatus = (
    cardId: string,
    status: ContentPlanCardItem["status"],
  ) => {
    updateMutation.mutate({
      id: Number(cardId),
      payload: { status: status.toLowerCase().replace(" ", "_") },
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<
    (ContentFormValues & { id?: string }) | null
  >(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailCard, setDetailCard] = useState<ContentPlanCardItem | null>(
    null,
  );

  const [selectedFilter, setSelectedFilter] = useState<
    ContentPlanCardItem["status"] | "All"
  >("All");
  const [showOverdue, setShowOverdue] = useState(false);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningCard, setAssigningCard] =
    useState<ContentPlanCardItem | null>(null);

  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisingCard, setRevisingCard] = useState<ContentPlanCardItem | null>(
    null,
  );

  const [isTasksAddModalOpen, setIsTasksAddModalOpen] = useState(false);
  const [tasksAddCard, setTasksAddCard] = useState<ContentPlanCardItem | null>(
    null,
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<ContentPlanCardItem | null>(
    null,
  );

  // Register the open-modal function with the parent
  useEffect(() => {
    if (onRegisterOpenModal) {
      onRegisterOpenModal(() => {
        setEditingItem(null);
        setIsModalOpen(true);
      });
    }
  }, [onRegisterOpenModal]);

  // Register the feedback-modal function with the parent
  useEffect(() => {
    if (onRegisterFeedbackModal) {
      onRegisterFeedbackModal(() => {
        setRevisingCard(null);
        setTimeout(() => {
          setIsRevisionModalOpen(true);
        }, 100);
      });
    }
  }, [onRegisterFeedbackModal]);

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openPreviewModal = (card: ContentPlanCardItem) => {
    setDetailCard(card);
    setIsDetailModalOpen(true);
  };

  const openEditModal = (card: ContentPlanCardItem) => {
    let formattedDueDate = "";
    if (card.dueDate) {
      const d = new Date(card.dueDate);
      if (!isNaN(d.getTime())) {
        formattedDueDate = d.toISOString().split("T")[0];
      }
    }

    setEditingItem({
      id: card.id,
      title: card.title,
      category: card.category,
      pillar: card.pillar || "",
      pillars: (card.pillars ?? []).map((p) => p.pillar_name),
      format: (card.format === "Video" || card.format === "Image"
        ? card.format
        : "Video") as "Video" | "Image",
      platform: card.platform,
      priority: card.priority,
      dueDate: formattedDueDate,
      status: card.status,
      feedback: card.feedback,
      overdue: card.overdue,
      assignedTeam: card.assignedTeam,
      objective: card.objective || "",
      targetAudience: card.targetAudience || "",
      notes: card.notes || "",
      fileUrl: card.fileUrl || "",
    });
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  };

  const handleModalSave = (data: ContentFormValues & { id?: string }) => {
    const plat = platformsList.find((p) => p.platform_name === data.platform);
    const cat = categoriesList.find((c) => c.type_name === data.category);

    // Resolve pillar IDs from selected pillar names array
    const selectedPillarIds = (data.pillars ?? [])
      .map((name) => pillarsList.find((p) => p.pillar_name === name)?.id)
      .filter((id): id is number => id !== undefined);

    if (!plat || !cat || selectedPillarIds.length === 0) {
      toast.error("Invalid master data selection");
      return;
    }

    const payload: CreateContentPayload = {
      contract_id: resolvedContractId,
      platform_id: plat.id,
      content_category_id: cat.id,
      pillar_ids: selectedPillarIds,
      title: data.title,
      content_url: data.fileUrl || undefined,
      objective: data.objective || undefined,
      target_audience: data.targetAudience || undefined,
      description: data.notes || undefined,
      due_date: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      priority: data.priority.toLowerCase(),
      format: data.format || "Video",
    };

    if (data.id) {
      updateMutation.mutate({ id: Number(data.id), payload });
    } else {
      createMutation.mutate(payload);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCard = (card: ContentPlanCardItem) => {
    setCardToDelete(card);
    setTimeout(() => {
      setIsDeleteModalOpen(true);
    }, 100);
  };

  const handleDeleteConfirm = () => {
    if (cardToDelete) {
      deleteMutation.mutate(Number(cardToDelete.id));
    }
    setIsDeleteModalOpen(false);
    setCardToDelete(null);
  };

  const openAssignModal = (card: ContentPlanCardItem) => {
    setAssigningCard(card);
    setTimeout(() => {
      setIsAssignModalOpen(true);
    }, 100);
  };

  const handleAssignSave = (cardId: string, assignedTeam: TeamMember[]) => {
    assignTeamMutation.mutate({ cardId, assignedTeam });
    setIsAssignModalOpen(false);
    setAssigningCard(null);
  };

  const openRevisionModal = (card: ContentPlanCardItem) => {
    setRevisingCard(card);
    setTimeout(() => {
      setIsRevisionModalOpen(true);
    }, 100);
  };

  const handleRevisionSave = (
    cardId: string,
    feedback: string,
    priority: ContentPlanCardItem["priority"],
    status?: ContentPlanCardItem["status"],
  ) => {
    revisionMutation.mutate({
      cardId,
      feedback,
      priority,
      status,
    });
    setIsRevisionModalOpen(false);
    setRevisingCard(null);
  };

  const openTasksAddModal = (card: ContentPlanCardItem) => {
    setTasksAddCard(card);
    setTimeout(() => {
      setIsTasksAddModalOpen(true);
    }, 100);
  };

  const handleTasksAddSaveSingle = async (
    cardId: string,
    idx: number,
    taskData: { title: string; description: string; deadline: string },
  ) => {
    await saveSingleTaskMutation.mutateAsync({ cardId, idx, taskData });
  };

  const handleRestoreCard = (cardId: string) => {
    restoreMutation.mutate(Number(cardId));
  };

  // Get count of cards for each status dynamically
  const getStatusCount = (status: ContentPlanCardItem["status"] | "All") => {
    const baseCards = showOverdue ? cards.filter((c) => c.overdue) : cards;
    if (status === "All")
      return baseCards.filter((c) => c.status !== "Deleted").length;
    return baseCards.filter((card) => card.status === status).length;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Content Modal */}
      <ContentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleModalSave}
        initialData={editingItem}
        contractId={resolvedContractId}
      />
      {/* Content Detail Modal */}
      <ContentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailCard(null);
        }}
        card={detailCard}
      />
      {/* Assign Teams Modal */}
      <AssignTeams
        key={
          isAssignModalOpen ? (assigningCard?.id ?? "assign") : "assign-closed"
        }
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setAssigningCard(null);
        }}
        card={assigningCard}
        contractId={resolvedContractId}
        onSave={handleAssignSave}
      />
      {/* Request Revision Modal */}
      <RequestRevision
        key={
          isRevisionModalOpen
            ? (revisingCard?.id ?? "revision")
            : "revision-closed"
        }
        isOpen={isRevisionModalOpen}
        onClose={() => {
          setIsRevisionModalOpen(false);
          setRevisingCard(null);
        }}
        card={revisingCard}
        cardsList={revisingCard ? undefined : cards}
        onSave={handleRevisionSave}
      />
      {/* Add Tasks Modal */}
      <TasksModalAdd
        key={
          isTasksAddModalOpen
            ? (tasksAddCard?.id ?? "tasks-add")
            : "tasks-add-closed"
        }
        isOpen={isTasksAddModalOpen}
        onClose={() => {
          setIsTasksAddModalOpen(false);
          setTasksAddCard(null);
        }}
        card={tasksAddCard}
        onSaveSingle={handleTasksAddSaveSingle}
      />
      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hapus Rencana Konten?"
        description={
          cardToDelete ? (
            <>
              Apakah Anda yakin ingin menghapus rencana konten{" "}
              <span className="font-semibold text-gray-800">
                "{cardToDelete.title}"
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </>
          ) : (
            ""
          )
        }
        onConfirm={handleDeleteConfirm}
      />
      {/* Loopable Filter Bar - SaaS/iOS Premium Design */}
      <div className="w-full bg-slate-50/90 backdrop-blur-md rounded-2xl border border-slate-200/60 p-2.5 flex flex-wrap gap-4 items-center justify-between shadow-xs">
        <div className="flex flex-wrap gap-1 items-center bg-slate-200/50 p-1 rounded-xl border border-slate-200/30">
          {FILTER_OPTIONS.map((opt) => {
            const isSelected = selectedFilter === opt.status;
            const count = getStatusCount(opt.status);
            const activeClass = isSelected ? getActiveTabClass(opt.status) : "text-slate-500 hover:bg-slate-200/40 hover:text-slate-700";
            return (
              <Button
                key={opt.label}
                variant="ghost"
                onClick={() => setSelectedFilter(opt.status)}
                className={`rounded-lg border px-3.5 py-1.5 flex items-center gap-2 cursor-pointer text-xs transition-all duration-150 h-auto ${
                  isSelected ? "border" : "border-transparent bg-transparent"
                } ${activeClass}`}
              >
                {/* Dot indicator (if not 'All') */}
                {opt.status !== "All" && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full shrink-0 ${opt.colorClass}`}
                  />
                )}
                <span className="leading-none">{opt.label}</span>
                {/* Count Badge */}
                <span
                  className={`text-[10px] font-semibold leading-none transition-all ${
                    isSelected ? "opacity-100" : "text-slate-400 opacity-80"
                  }`}
                >
                  {count}
                </span>
              </Button>
            );
          })}
        </div>

        <Button
          variant={showOverdue ? "outline" : "ghost"}
          onClick={() => setShowOverdue(!showOverdue)}
          className={`rounded-xl border px-4 py-2 flex items-center gap-2 cursor-pointer text-xs font-semibold transition-all duration-150 h-auto shrink-0 ${
            showOverdue
              ? "border-red-200 text-red-600 bg-red-50/60 shadow-xs hover:bg-red-50"
              : "border-slate-200 text-slate-500 hover:bg-slate-100/50 bg-white"
          }`}
        >
          <TriangleAlert className="h-3.5 w-3.5" />
          <span className="leading-none">Overdue</span>
          <span
            className={`text-[10px] font-semibold leading-none transition-all ${
              showOverdue ? "text-red-700 font-bold" : "text-slate-400"
            }`}
          >
            {cards.filter((c) => c.overdue && c.status !== "Deleted").length}
          </span>
        </Button>
      </div>

      {/* Kanban Board */}
      <ContentBoard
        cards={showOverdue ? cards.filter((c) => c.overdue) : cards}
        selectedFilter={selectedFilter}
        openPreviewModal={openPreviewModal}
        openEditModal={openEditModal}
        openAssignModal={openAssignModal}
        openRevisionModal={openRevisionModal}
        handleDeleteCard={handleDeleteCard}
        openAddModal={openAddModal}
        openTasksAddModal={openTasksAddModal}
        handleRestoreCard={handleRestoreCard}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
