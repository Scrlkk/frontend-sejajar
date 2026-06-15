import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { RevisionBanner } from "@/features/reviews/components/RevisionBanner";
import { DraftsCard, sampleDraftsData, type DraftsItem } from "@/features/tasks/data/tasksData";
import { FilePen } from "lucide-react";
import { Drafts } from "@/features/tasks/components/Drafts";

export const DraftsPage = () => {
  const handleReUploadClick = () => {
    console.log(
      "Membuka modal atau memicu input file untuk upload ulang video...",
    );
  };

  const handleNewDraft = () => {
    console.log("Membuka editor untuk membuat draf baru...");
  };

  const handleOpenDraft = (item: DraftsItem) => {
    console.log("Membuka draf:", item.title);
  };

  const handleHistoryDraft = (item: DraftsItem) => {
    console.log("Membuka log riwayat draf ID:", item.id);
  };

  const bannerData = [
    {
      id: 1,
      title: "Skincare Reel – Raw Cut",
      description: "Colour grading is off — re-export with warmer tone.",
    },
    {
      id: 2,
      title: "Aesthetic Morning Coffee Routine",
      description: "Colour grading is off — re-export with warmer tone.",
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
        drafts={sampleDraftsData}
        onNewDraft={handleNewDraft}
        onOpen={handleOpenDraft}
        onHistory={handleHistoryDraft}
      />
    </div>
  );
};
