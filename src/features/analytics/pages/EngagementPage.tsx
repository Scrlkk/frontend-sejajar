import { Engagement } from "@/features/analytics/components/Engagement";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { useQuery } from "@tanstack/react-query";
import { getDashboardChartsApi } from "@/features/dashboard/api/dashboardApi";
import { ANALYTICS_CARDS_TEMPLATE, formatMetricValue } from "@/features/analytics/constants/cardConfig";
import { useMemo } from "react";

interface EngagementChartResponse {
  metric: string;
  from: string;
  to: string;
  totals: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  avg_engagement_rate: number;
  prev_totals: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  prev_avg_engagement_rate: number;
  series: {
    date: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }[];
}

const renderCardDelta = (key: string, currentVal: number, prevVal: number) => {
  const diff = currentVal - prevVal;
  const isPositive = diff >= 0;
  const pct = prevVal > 0 ? (diff / prevVal) * 100 : (currentVal > 0 ? 100 : 0);

  if (currentVal === 0 && prevVal === 0) {
    return <span className="text-gray-400 text-[10px]">No data available</span>;
  }
  if (diff === 0) {
    return <span className="text-gray-400 text-[10px]">No change from prev. period</span>;
  }

  const formattedDiff = formatMetricValue(key, Math.abs(diff));
  const arrow = isPositive ? "▲" : "▼";
  const colorClass = isPositive ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold";

  return (
    <span className="flex items-center gap-0.5 text-[10px]">
      <span className={colorClass}>
        {arrow} {isPositive ? "+" : "-"}{formattedDiff} ({pct.toFixed(1)}%)
      </span>
      <span className="text-gray-400 ml-0.5">vs prev. period</span>
    </span>
  );
};

export const EngagementPage = () => {
  const currentYear = new Date().getFullYear();

  // Fetch engagement charts (trends & total metrics)
  const { data: trendChart } = useQuery<EngagementChartResponse>({
    queryKey: ["dashboard-charts", "engagement", currentYear],
    queryFn: () =>
      getDashboardChartsApi<EngagementChartResponse>({
        metric: "engagement",
        from: `${currentYear}-01-01`,
        to: `${currentYear}-12-31`,
      }),
  });

  const cardData = useMemo(() => {
    const totals = trendChart?.totals || { views: 0, likes: 0, comments: 0, shares: 0 };
    const prevTotals = trendChart?.prev_totals || { views: 0, likes: 0, comments: 0, shares: 0 };
    const rate = trendChart?.avg_engagement_rate || 0;
    const prevRate = trendChart?.prev_avg_engagement_rate || 0;

    return ANALYTICS_CARDS_TEMPLATE.map((tpl) => {
      let currentVal = 0;
      let prevVal = 0;

      if (tpl.key === "views") {
        currentVal = totals.views;
        prevVal = prevTotals.views;
      } else if (tpl.key === "likes") {
        currentVal = totals.likes;
        prevVal = prevTotals.likes;
      } else if (tpl.key === "shares") {
        currentVal = totals.shares;
        prevVal = prevTotals.shares;
      } else if (tpl.key === "engagement") {
        currentVal = rate;
        prevVal = prevRate;
      }

      return {
        title: tpl.title,
        value: formatMetricValue(tpl.key, currentVal),
        description: (
          <span className="flex flex-col gap-0.5">
            <span className="text-[11px] leading-none text-gray-400">{tpl.description}</span>
            {renderCardDelta(tpl.key, currentVal, prevVal)}
          </span>
        ),
        icon: tpl.icon,
        iconColor: tpl.iconColor,
        iconBgColor: tpl.iconBgColor,
      };
    });
  }, [trendChart]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardData.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div>
        <Engagement />
      </div>
    </div>
  );
};
