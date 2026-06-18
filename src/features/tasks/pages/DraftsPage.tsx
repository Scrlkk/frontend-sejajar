import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { RevisionBanner } from "@/features/reviews/components/RevisionBanner";
import {
  DraftsCard,
  sampleDraftsData,
  type DraftsItem,
  type AssignedContentPlan,
} from "@/data/mockData";
import { FilePen } from "lucide-react";
import { Drafts } from "@/features/tasks/components/Drafts";
import { SpesificDrawer } from "@/features/tasks/components/SpesificDrawer";
import { DeleteModal } from "@/features/tasks/components/DeleteModal";
import { ContentPickerModal } from "@/features/tasks/components/ContentPickerModal";

export const DraftsPage = () => {
  const [drafts, setDrafts] = useState<DraftsItem[]>(sampleDraftsData);
  const [selectedDraft, setSelectedDraft] = useState<DraftsItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<DraftsItem | null>(null);

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
      drafts.find((d) => d.status === "Revision" || d.status === "Overdue") ||
      drafts[0];
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

  const handleDeleteClick = (id: string | number) => {
    const draft = drafts.find((d) => d.id === id);
    if (draft) {
      setDraftToDelete(draft);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (draftToDelete) {
      setDrafts((prev) => prev.filter((d) => d.id !== draftToDelete.id));
      setIsDeleteModalOpen(false);
      setDraftToDelete(null);
    }
  };

  const handleSelectContentPlan = (plan: AssignedContentPlan) => {
    const categoryBg =
      plan.category.toLowerCase() === "beauty"
        ? "bg-pink-50 text-pink-600 hover:bg-pink-50 border-none"
        : plan.category.toLowerCase() === "lifestyle"
          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none"
          : "bg-indigo-50 text-indigo-600 hover:bg-indigo-50 border-none";

    const newId =
      drafts.length > 0
        ? Math.max(...drafts.map((d) => Number(d.id) || 0)) + 1
        : 1;
    const newDraft: DraftsItem = {
      id: newId,
      title: plan.title,
      category: plan.category,
      categoryBg: categoryBg,
      status: "Pending",
      statusBg: "bg-amber-50 text-amber-600 hover:bg-amber-50",
      statusDot: "bg-amber-500",
      wordCount: 0,
      savedTimeText: "Saved just now",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      assigner: plan.assignedBy,
    };

    setDrafts((prev) => [newDraft, ...prev]);
    setSelectedDraft(newDraft);
    setIsDrawerOpen(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("id", String(newId));
    setSearchParams(newParams, { replace: true });
  };

  const handleSaveDraft = (updatedItem: DraftsItem) => {
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === updatedItem.id
          ? {
              ...d,
              ...updatedItem,
              statusBg:
                updatedItem.status === "Approved"
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                  : updatedItem.status === "Pending"
                    ? "bg-amber-50 text-amber-600 hover:bg-amber-50"
                    : updatedItem.status === "Revision"
                      ? "bg-red-50 text-red-650 hover:bg-red-50"
                      : "bg-gray-50 text-gray-600",
              statusDot:
                updatedItem.status === "Approved"
                  ? "bg-emerald-500"
                  : updatedItem.status === "Pending"
                    ? "bg-amber-500"
                    : "bg-red-500",
            }
          : d,
      ),
    );
  };

  const bannerData = [
    {
      id: 1,
      title: "Skincare Reel  Raw Cut",
      description: "Colour grading is off re-export with warmer tone.",
    },
    {
      id: 2,
      title: "Aesthetic Morning Coffee Routine",
      description: "Colour grading is off re-export with warmer tone.",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DraftsCard.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      {bannerData.map((banner) => (
        <RevisionBanner
          key={banner.id}
          title={banner.title}
          description={banner.description}
          onReUpload={handleReUploadClick}
          buttonText="Revise"
          buttonIcon={<FilePen className="h-4 w-4 stroke-[2.5]" />}
        />
      ))}
      <Drafts
        drafts={drafts}
        onNewDraft={() => setIsPickerModalOpen(true)}
        onOpen={handleOpenDraft}
        onDelete={handleDeleteClick}
      />
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
        onSave={handleSaveDraft}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDraftToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Draft"
        description={
          <>
            Apakah Anda yakin ingin menghapus draft{" "}
            <span className="font-bold text-gray-900">
              "{draftToDelete?.title}"
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </>
        }
      />

      <ContentPickerModal
        isOpen={isPickerModalOpen}
        onClose={() => setIsPickerModalOpen(false)}
        onSelect={handleSelectContentPlan}
        itemType="draft"
      />
    </div>
  );
};
