import {
  usersData,
  activityLogs,
  superadminCards,
  systemMetrics,
  sampleRoles,
} from "@/data/mockData";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { SystemLog } from "@/features/audit/components/SystemLog";
import { UserManagement } from "@/features/users/components/UserMangement";
import { GraphicDonut } from "@/features/dashboard/components/GraphicDonut";
import { SystemHealth } from "@/features/dashboard/components/SystemHealth";

export type { UserData } from "@/data/mockData";

export const SuperadminPage = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {superadminCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>

      <div className="flex gap-5 items-stretch">
        <UserManagement users={usersData} />

        <div className="w-110 flex flex-col gap-6">
          <GraphicDonut data={sampleRoles} title="Role Distribution" configLabel="Total Users" />
          <SystemHealth metrics={systemMetrics} />
        </div>
      </div>

      <div className="w-full pt-1">
        <SystemLog logs={activityLogs} timeframe="Last 24 hours" />
      </div>
    </div>
  );
};
