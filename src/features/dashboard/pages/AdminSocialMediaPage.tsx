import {
  adminSocialMediaCards,
  sampleContentStatus,
} from "@/features/dashboard/data/adminsocialmediaData";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { PostSchedule } from "@/features/tasks/components/PostSchedules";
import { sampleSchedules } from "@/features/tasks/data/tasksData";
import { ReadyPublish } from "@/features/tasks/components/ReadyPublish";
import { readyToPublishData } from "@/features/tasks/data/tasksData";
import { GraphicDonut } from "@/features/dashboard/components/GraphicDonut";
import type { PublishItem } from "@/features/tasks/components/ReadyPublish";

export const AdminSocialMediaPage = () => {
  const handleScheduleNew = () => console.log("Membuka modal schedule baru...");
  const handleRowSchedule = (item: PublishItem) =>
    console.log("Scheduling item:", item.title);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminSocialMediaCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div className="flex flex-col gap-6">
        <PostSchedule schedules={sampleSchedules} />
      </div>
      <div>
        <div className="w-full flex gap-5 items-stretch">
          <ReadyPublish
            items={readyToPublishData}
            onScheduleNew={handleScheduleNew}
            onRowSchedule={handleRowSchedule}
          />
          <div className="w-80 shrink-0">
            <GraphicDonut
              data={sampleContentStatus}
              title="Content Status"
              configLabel="Total Content"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
