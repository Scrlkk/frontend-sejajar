import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ContentModal } from "@/features/contents/components/ContentModal";
import type { ContentFormValues } from "@/features/contents/components/ContentModal";
import { ContentDetailModal } from "@/features/contents/components/ContentDetailModal";
import { AssignTeams } from "@/features/contents/components/AssignTeams";
import { RequestRevision } from "@/features/reviews/components/RequestRevision";
import { TasksModalAdd } from "@/features/tasks/components/TasksModalAdd";
import { ContentBoard } from "@/features/contents/components/ContentBoard";
import { DeleteModal } from "@/features/tasks/components/DeleteModal";

export interface TeamMember {
  name: string;
  initials: string;
  avatarBg: string;
}

export interface ContentPlanCardItem {
  id: string;
  contractId?: number;
  title: string;
  category: string;
  categoryBg?: string; // Optional custom Tailwind classes for badge styling
  platform: string;
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
    | "Published";
  objective?: string;
  targetAudience?: string;
  pillar?: string;
  notes?: string;
  tasks?: Record<number, { title: string; description: string }>;
}

export interface ContentPlanProps {
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
  { label: "Published", status: "Published", colorClass: "bg-cyan-600" },
];

export function ContentPlan({
  initialCards = [],
  onRegisterOpenModal,
  onRegisterFeedbackModal,
}: ContentPlanProps) {
  const [cards, setCards] = useState<ContentPlanCardItem[]>(initialCards);
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
    setEditingItem({
      id: card.id,
      title: card.title,
      category: card.category,
      pillar: card.pillar || "",
      format: (card.format === "Video" || card.format === "Image"
        ? card.format
        : "") as "Video" | "Image" | "",
      platform: card.platform,
      priority: card.priority,
      dueDate: card.dueDate,
      status: card.status,
      feedback: card.feedback,
      overdue: card.overdue,
      assignedTeam: card.assignedTeam,
      objective: card.objective || "",
      targetAudience: card.targetAudience || "",
      notes: card.notes || "",
    });
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  };

  const handleModalSave = (data: ContentFormValues & { id?: string }) => {
    if (data.id) {
      // Edit existing
      setCards((prev) =>
        prev.map((c) => {
          if (c.id === data.id) {
            let updatedStatus =
              (data.status as ContentPlanCardItem["status"]) || c.status;
            const hasAssignedTeam = c.assignedTeam && c.assignedTeam.length > 0;
            if (updatedStatus === "Draft" && hasAssignedTeam) {
              updatedStatus = "Assigned";
            } else if (updatedStatus === "Assigned" && !hasAssignedTeam) {
              updatedStatus = "Draft";
            }
            return {
              ...c,
              title: data.title,
              category: data.category,
              platform: data.platform,
              format: data.format || c.format,
              priority: data.priority,
              dueDate: data.dueDate,
              status: updatedStatus,
              objective: data.objective,
              targetAudience: data.targetAudience,
              pillar: data.pillar,
              notes: data.notes,
            };
          }
          return c;
        }),
      );
    } else {
      // Add new card
      const newCard: ContentPlanCardItem = {
        id: `card-${Date.now()}`,
        title: data.title,
        category: data.category,
        platform: data.platform,
        format: data.format || "Video",
        priority: data.priority,
        dueDate: data.dueDate,
        status: "Draft",
        objective: data.objective,
        targetAudience: data.targetAudience,
        pillar: data.pillar,
        notes: data.notes,
      };
      setCards((prev) => [...prev, newCard]);
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
      setCards((prev) => prev.filter((c) => c.id !== cardToDelete.id));
    }
    setIsDeleteModalOpen(false);
    setCardToDelete(null);
  };

  const openAssignModal = (card: ContentPlanCardItem) => {
    setAssigningCard(card);
    // Open in next tick to allow DropdownMenu to fully close first,
    // avoiding Radix overlay pointer-events locking issue.
    setTimeout(() => {
      setIsAssignModalOpen(true);
    }, 100);
  };

  const handleAssignSave = (cardId: string, assignedTeam: TeamMember[]) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          let updatedStatus = c.status;
          const hasAssignedTeam = assignedTeam.length > 0;
          if (c.status === "Draft" && hasAssignedTeam) {
            updatedStatus = "Assigned";
          } else if (c.status === "Assigned" && !hasAssignedTeam) {
            updatedStatus = "Draft";
          }
          return {
            ...c,
            assignedTeam,
            status: updatedStatus,
          };
        }
        return c;
      }),
    );
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
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              status: status || "Revision",
              feedback,
              priority,
            }
          : c,
      ),
    );
    setIsRevisionModalOpen(false);
    setRevisingCard(null);
  };

  const openTasksAddModal = (card: ContentPlanCardItem) => {
    setTasksAddCard(card);
    setTimeout(() => {
      setIsTasksAddModalOpen(true);
    }, 100);
  };

  const handleTasksAddSave = (
    cardId: string,
    memberTasks: Record<number, { title: string; description: string }>
  ) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          return {
            ...c,
            tasks: memberTasks,
            status: "On Progress",
          };
        }
        return c;
      })
    );
    setIsTasksAddModalOpen(false);
    setTasksAddCard(null);
  };

  const handlePublishCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: "Published" } : c))
    );
  };

  // Get count of cards for each status dynamically
  const getStatusCount = (status: ContentPlanCardItem["status"] | "All") => {
    if (status === "All") return cards.length;
    return cards.filter((card) => card.status === status).length;
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
        key={isAssignModalOpen ? (assigningCard?.id ?? "assign") : "closed"}
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setAssigningCard(null);
        }}
        card={assigningCard}
        onSave={handleAssignSave}
      />
      {/* Request Revision Modal */}
      <RequestRevision
        key={isRevisionModalOpen ? (revisingCard?.id ?? "revision") : "closed"}
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
        key={isTasksAddModalOpen ? (tasksAddCard?.id ?? "tasks-add") : "closed"}
        isOpen={isTasksAddModalOpen}
        onClose={() => {
          setIsTasksAddModalOpen(false);
          setTasksAddCard(null);
        }}
        card={tasksAddCard}
        onSave={handleTasksAddSave}
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
      {/* Loopable Filter Bar */}
      <div className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-sm p-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center w-full">
          {FILTER_OPTIONS.map((opt) => {
            const isSelected = selectedFilter === opt.status;
            const count = getStatusCount(opt.status);
            return (
              <Button
                key={opt.label}
                variant={isSelected ? "outline" : "ghost"}
                onClick={() => setSelectedFilter(opt.status)}
                className={`rounded-full border px-3.5 py-1.5 flex items-center gap-2 cursor-pointer text-xs font-semibold transition-all duration-150 h-auto ${
                  isSelected
                    ? "border-red-800 text-slate-800 bg-red-50/10 shadow-sm hover:bg-red-50/20"
                    : "border-gray-200 text-slate-500 hover:bg-gray-50 bg-white"
                }`}
              >
                {/* Dot indicator (if not 'All') */}
                {opt.status !== "All" && (
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${opt.colorClass}`}
                  />
                )}
                <span className="leading-none">{opt.label}</span>
                {/* Count Badge */}
                <span
                  className={`text-[10px] font-semibold leading-none transition-all ${
                    isSelected ? "text-red-800" : "text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Kanban Board */}
      <ContentBoard
        cards={cards}
        selectedFilter={selectedFilter}
        openPreviewModal={openPreviewModal}
        openEditModal={openEditModal}
        openAssignModal={openAssignModal}
        openRevisionModal={openRevisionModal}
        handleDeleteCard={handleDeleteCard}
        openAddModal={openAddModal}
        openTasksAddModal={openTasksAddModal}
        handlePublishCard={handlePublishCard}
      />
    </div>
  );
}
