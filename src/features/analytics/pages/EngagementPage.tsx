import { Engagement } from "@/features/analytics/components/Engagement";
import { analyticsDataCards, engagementEntries } from "@/data/mockData";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";

export const EngagementPage = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsDataCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div>
        <Engagement initialEntries={engagementEntries} />
      </div>
    </div>
  );
};
