import {
  activityLogs,
  logsCards,
} from "@/data/mockData";
import { SystemLog } from "@/features/audit/components/SystemLog";
import {CardDashboard} from "@/features/dashboard/components/CardDashboard";

export const SystemlogsPage = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {logsCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <SystemLog logs={activityLogs} />
    </div>
  );
};