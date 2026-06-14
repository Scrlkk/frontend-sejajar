import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { publishCardData, publishData } from "@/features/tasks/data/tasksData";
import {
  PublishContent,
  type QueueItem,
} from "@/features/tasks/components/PublishContent";
import { AlertTriangle } from "lucide-react";

export const PublishPage = () => {
  const handlePublish = (item: QueueItem) =>
    console.log("Publishing item:", item.title);
  const handleCaption = (item: QueueItem) =>
    console.log("Editing caption for:", item.id);
  const handleRemove = (id: string | number) =>
    console.log("Removing item ID:", id);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {publishCardData.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>

      <div className="w-full p-3 bg-amber-50 rounded-lg border border-amber-300 text-amber-700 text-sm flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        <div>
          <span className="font-semibold">3 content items </span>
          ready to publish but missing captions
        </div>
      </div>

      <PublishContent
        items={publishData}
        onPublish={handlePublish}
        onCaption={handleCaption}
        onRemove={handleRemove}
      />
    </div>
  );
};