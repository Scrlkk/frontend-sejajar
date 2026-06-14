import { adminSocialMediaCards } from "@/features/dashboard/data/adminsocialmediaData";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { SchedulesContent } from "../components/SchedulesContent";
import { scheduledData } from "../data/tasksData";

export const SchedulesPage = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminSocialMediaCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <SchedulesContent contents={scheduledData} />
    </div>
  );
};
