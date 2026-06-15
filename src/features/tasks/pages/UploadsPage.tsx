import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import {
  uploadsCardData,
  sampleUploadsData,
} from "@/features/tasks/data/tasksData";
import { RevisionBanner } from "@/features/reviews/components/RevisionBanner";
import {
  Uploads,
  type UploadedVideoItem,
} from "@/features/tasks/components/Uploads";
import { Upload } from "lucide-react";

export const UploadsPage = () => {
  const handleReUploadClick = () => {
    console.log(
      "Membuka modal atau memicu input file untuk upload ulang video...",
    );
  };

  const handleUploadNew = () =>
    console.log("Membuka dialog unggah video baru...");
  const handlePreview = (item: UploadedVideoItem) =>
    console.log("Preview video asset:", item.title);
  const handleHistory = (item: UploadedVideoItem) =>
    console.log("History log dibuka untuk ID:", item.id);
  const handleDelete = (id: string | number) =>
    console.log("Menghapus item ID:", id);

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
        uploads={sampleUploadsData}
        onUploadNew={handleUploadNew}
        onPreview={handlePreview}
        onHistory={handleHistory}
        onDelete={handleDelete}
      />
    </div>
  );
};
