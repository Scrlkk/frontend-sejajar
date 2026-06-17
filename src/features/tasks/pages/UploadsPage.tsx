import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import {
  uploadsCardData,
  sampleUploadsData,
  type AssignedContentPlan,
} from "@/features/tasks/data/tasksData";
import { RevisionBanner } from "@/features/reviews/components/RevisionBanner";
import {
  Uploads,
  type UploadedVideoItem,
} from "@/features/tasks/components/Uploads";
import { Upload } from "lucide-react";
import { SpesificDrawer } from "@/features/tasks/components/SpesificDrawer";
import { DeleteModal } from "@/features/tasks/components/DeleteModal";
import { ContentPickerModal } from "@/features/tasks/components/ContentPickerModal";

export const UploadsPage = () => {
  const [uploads, setUploads] =
    useState<UploadedVideoItem[]>(sampleUploadsData);
  const [selectedUpload, setSelectedUpload] =
    useState<UploadedVideoItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [uploadToDelete, setUploadToDelete] =
    useState<UploadedVideoItem | null>(null);

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

  const handleDeleteClick = (id: string | number) => {
    const item = uploads.find((u) => u.id === id);
    if (item) {
      setUploadToDelete(item);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (uploadToDelete) {
      setUploads((prev) =>
        prev.filter((item) => item.id !== uploadToDelete.id),
      );
      setIsDeleteModalOpen(false);
      setUploadToDelete(null);
    }
  };

  const handleSelectContentPlan = (plan: AssignedContentPlan) => {
    const newId =
      uploads.length > 0
        ? Math.max(...uploads.map((u) => Number(u.id) || 0)) + 1
        : 1;
    const newUpload: UploadedVideoItem = {
      id: newId,
      title: plan.title,
      type: "video",
      platform: plan.platform,
      platformBg:
        plan.platform.toLowerCase() === "tiktok"
          ? "bg-[#252f41] text-white"
          : plan.platform.toLowerCase() === "youtube"
            ? "bg-red-600 text-white"
            : "bg-pink-600 text-white",
      fileSizeText: "12.5 MB",
      uploadedTimeText: "Uploaded just now",
      status: "Uploading",
      statusBg: "bg-blue-50 text-blue-800",
      statusDot: "bg-blue-500",
      assigner: plan.assignedBy,
    };

    setUploads((prev) => [newUpload, ...prev]);
    setSelectedUpload(newUpload);
    setIsDrawerOpen(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("id", String(newId));
    setSearchParams(newParams, { replace: true });
  };

  const handleSaveUpload = (updatedItem: UploadedVideoItem) => {
    setUploads((prev) =>
      prev.map((u) =>
        u.id === updatedItem.id
          ? {
              ...u,
              ...updatedItem,
              statusBg:
                updatedItem.status === "Approved"
                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                  : updatedItem.status === "Pending"
                    ? "bg-amber-50 text-amber-600 hover:bg-amber-50"
                    : updatedItem.status === "Revision"
                      ? "bg-red-50 text-red-500 hover:bg-red-50"
                      : "bg-blue-50 text-blue-800",
              statusDot:
                updatedItem.status === "Approved"
                  ? "bg-emerald-500"
                  : updatedItem.status === "Pending"
                    ? "bg-amber-500"
                    : updatedItem.status === "Revision"
                      ? "bg-red-500"
                      : "bg-blue-500",
            }
          : u,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uploadsCardData.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <RevisionBanner
        title="Skincare Reel – Raw Cut"
        description="Colour grading is off — re-export with warmer tone."
        onReUpload={handleReUploadClick}
        buttonText="Re-upload"
        buttonIcon={<Upload className="h-4 w-4 stroke-[2.5]" />}
      />
      <Uploads
        uploads={uploads}
        onUploadNew={() => setIsPickerModalOpen(true)}
        onOpen={handleOpenUpload}
        onDelete={handleDeleteClick}
      />
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
        onSave={handleSaveUpload}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUploadToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Upload"
        description={
          <>
            Apakah Anda yakin ingin menghapus upload{" "}
            <span className="font-bold text-gray-900">
              "{uploadToDelete?.title}"
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </>
        }
      />

      <ContentPickerModal
        isOpen={isPickerModalOpen}
        onClose={() => setIsPickerModalOpen(false)}
        onSelect={handleSelectContentPlan}
        itemType="upload"
      />
    </div>
  );
};
