import { useMemo, useState } from "react";
import { ContentOutput } from "@/features/contents/components/ContentOutput";
import { PlatformEngagement } from "@/features/analytics/components/PlatformEngagement";
import { GraphicDonutHorizontal } from "@/features/dashboard/components/GraphicDonutHorizontal";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PerformingContent } from "@/features/analytics/components/PerformingContent";
import { useQuery } from "@tanstack/react-query";
import { getTopContentsApi } from "@/features/analytics/api/analyticsApi";
import { getDashboardChartsApi } from "@/features/dashboard/api/dashboardApi";
import { getContractsApi } from "@/features/contracts/api/contractsApi";
import { getPlatformConfig } from "@/utils/formatter";
import { ANALYTICS_CARDS_TEMPLATE, formatMetricValue } from "@/features/analytics/constants/cardConfig";
import { getPillarColor } from "@/features/contents/constants/pillarColors";

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

interface PlatformInfo {
  id: number;
  platform_name: string;
  color_key?: string | null;
}

interface Milestone {
  date: string;
  label: string;
}

interface EngagementByPlatformChartResponse {
  metric: string;
  chartMetric: string;
  granularity: string;
  from: string;
  to: string;
  platforms: PlatformInfo[];
  series: Record<string, string | number>[];
  milestones?: Milestone[];
}

interface ContentOutputChartResponse {
  metric: string;
  from: string;
  to: string;
  series: Array<{
    date: string;
    statuses: Record<string, number>;
    total: number;
  }>;
}

interface PillarUsage {
  id: number;
  pillar_name: string;
  count: number;
  percent: number;
}

interface PillarsUsageChartResponse {
  metric: string;
  total_contents: number;
  pillars: PillarUsage[];
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

export const AnalyticsPage = () => {
  // Fetch contracts list
  const { data: contractsList = [] } = useQuery({
    queryKey: ["contracts"],
    queryFn: () => getContractsApi(),
  });

  // Calculate available years dynamically from contracts
  const availableYears = useMemo(() => {
    if (contractsList.length === 0) {
      return [new Date().getFullYear()];
    }
    const years = [
      ...new Set(
        contractsList
          .map((c) => c.start_date ? new Date(c.start_date).getFullYear() : undefined)
          .filter((y): y is number => y !== undefined)
      ),
    ].sort((a, b) => b - a);
    return years;
  }, [contractsList]);

  const [activeYear, setSelectedYear] = useState<number>(() => {
    return availableYears[0] || new Date().getFullYear();
  });

  const [performancePeriod, setPerformancePeriod] = useState<"all" | "month">("all");

  const [activeMetric, setActiveMetric] = useState<"views" | "likes" | "comments" | "shares">("views");
  const [activeGranularity, setActiveGranularity] = useState<"daily" | "weekly" | "monthly">("daily");

  // --- Live Queries ---

  // Fetch engagement charts (trends & total metrics)
  const { data: trendChart } = useQuery<EngagementChartResponse>({
    queryKey: ["dashboard-charts", "engagement", activeYear],
    queryFn: () =>
      getDashboardChartsApi<EngagementChartResponse>({
        metric: "engagement",
        from: `${activeYear}-01-01`,
        to: `${activeYear}-12-31`,
      }),
  });

  // Fetch per-platform engagement for the trend chart
  const { data: platformEngagementChart } = useQuery<EngagementByPlatformChartResponse>({
    queryKey: ["dashboard-charts", "engagement_by_platform", activeYear, activeMetric, activeGranularity],
    queryFn: () =>
      getDashboardChartsApi<EngagementByPlatformChartResponse>({
        metric: "engagement_by_platform",
        from: `${activeYear}-01-01`,
        to: `${activeYear}-12-31`,
        chartMetric: activeMetric,
        granularity: activeGranularity,
      }),
  });

  // Fetch top performing contents
  const { data: topContents = [] } = useQuery({
    queryKey: ["top-contents"],
    queryFn: () => getTopContentsApi({ limit: 10 }),
  });

  // Fetch content output date chart
  const { data: outputChartData } = useQuery<ContentOutputChartResponse>({
    queryKey: ["dashboard-charts", "content_by_status_date", activeYear],
    queryFn: () =>
      getDashboardChartsApi<ContentOutputChartResponse>({
        metric: "content_by_status_date",
        from: `${activeYear}-01-01`,
        to: `${activeYear}-12-31`,
      }),
  });

  // Fetch pillars usage chart
  const { data: pillarsUsageChart } = useQuery<PillarsUsageChartResponse>({
    queryKey: ["dashboard-charts", "pillars_usage"],
    queryFn: () => getDashboardChartsApi<PillarsUsageChartResponse>({ metric: "pillars_usage" }),
  });

  // --- Dynamic Mappers ---

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

  const mappedPlatformData = useMemo(() => {
    const platformList = platformEngagementChart?.platforms ?? [];
    const series = platformEngagementChart?.series ?? [];
    return {
      platforms: platformList,
      data: series.map((s) => {
        const d = new Date(String(s.date));
        const name = d.toLocaleDateString("id-ID", {
          month: "short",
          day: "numeric",
        });
        return { ...s, name };
      }),
    };
  }, [platformEngagementChart]);

  const filteredOutputData = useMemo(() => {
    const buckets: Record<
      number,
      {
        Draft: number;
        Assigned: number;
        "On Progress": number;
        Review: number;
        Revision: number;
        Approved: number;
        Published: number;
      }
    > = {};
    for (let m = 0; m < 12; m++) {
      buckets[m] = {
        Draft: 0,
        Assigned: 0,
        "On Progress": 0,
        Review: 0,
        Revision: 0,
        Approved: 0,
        Published: 0,
      };
    }

    const series = outputChartData?.series || [];
    series.forEach((s) => {
      const d = new Date(s.date);
      if (d.getFullYear() === activeYear) {
        const monthIndex = d.getMonth();
        buckets[monthIndex].Draft += s.statuses?.draft || 0;
        buckets[monthIndex].Assigned += s.statuses?.assigned || 0;
        buckets[monthIndex]["On Progress"] += s.statuses?.on_progress || 0;
        buckets[monthIndex].Review += s.statuses?.review || 0;
        buckets[monthIndex].Revision += s.statuses?.revision || 0;
        buckets[monthIndex].Approved += s.statuses?.approved || 0;
        buckets[monthIndex].Published += s.statuses?.published || 0;
      }
    });

    const now = new Date();
    const currentYearVal = now.getFullYear();
    const currentMonthVal = now.getMonth();

    return Object.entries(buckets)
      .filter(([mIdx]) => {
        if (activeYear === currentYearVal) {
          return Number(mIdx) <= currentMonthVal;
        }
        return true;
      })
      .map(([mIdx, counts]) => ({
        month: MONTH_NAMES[Number(mIdx)],
        year: activeYear,
        Draft: counts.Draft,
        Assigned: counts.Assigned,
        "On Progress": counts["On Progress"],
        Review: counts.Review,
        Revision: counts.Revision,
        Approved: counts.Approved,
        Published: counts.Published,
      }));
  }, [outputChartData, activeYear]);

  const mappedPillarsData = useMemo(() => {
    const pillars = pillarsUsageChart?.pillars || [];
    return pillars.map((item, idx) => {
      const colorHex = getPillarColor(idx);
      return {
        name: item.pillar_name,
        value: item.count,
        color: `bg-[${colorHex}]`,
        fill: colorHex,
      };
    });
  }, [pillarsUsageChart]);

  const mappedTopContents = useMemo(() => {
    const list = (topContents || []).map((item, index) => {
      const rank = index + 1;
      const rankColor = rank === 1 ? "text-amber-500" : "text-slate-400";
      const platform = item.platform_name || "Instagram";
      const platformConfig = getPlatformConfig(platform);
      return {
        id: item.id,
        rank,
        rankColor,
        title: item.title,
        platform,
        platformBg: platformConfig.bg,
        views: Number(item.total_views || 0),
        likes: Number(item.total_likes || 0),
        shares: Number(item.total_shares || 0),
        period: "all" as const,
      };
    });

    if (performancePeriod === "month") {
      // Simulate/mock "This Month" top content by showing top 3 contents
      return list.slice(0, 3).map((item, index) => ({
        ...item,
        rank: index + 1,
        rankColor: index === 0 ? "text-amber-500" : "text-slate-400",
        period: "month" as const,
      }));
    }

    return list;
  }, [topContents, performancePeriod]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardData.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <PlatformEngagement
          data={mappedPlatformData.data}
          platforms={mappedPlatformData.platforms}
          activeMetric={activeMetric}
          activeGranularity={activeGranularity}
          onMetricChange={setActiveMetric}
          onGranularityChange={setActiveGranularity}
          topContents={topContents}
          headerAction={
            <Select
              value={String(activeYear)}
              onValueChange={(v) => setSelectedYear(Number(v))}
            >
              <SelectTrigger className="w-28 h-8 text-sm font-medium border-gray-200 bg-gray-50 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContentOutput
          data={filteredOutputData}
          headerAction={
            <Select
              value={String(activeYear)}
              onValueChange={(v) => setSelectedYear(Number(v))}
            >
              <SelectTrigger className="w-28 h-8 text-sm font-medium border-gray-200 bg-gray-50 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
        <GraphicDonutHorizontal data={mappedPillarsData} title="Content by Pillar" />
      </div>
      <div className="w-full mx-auto">
        <PerformingContent
          items={mappedTopContents}
          headerAction={
            <Select
              value={performancePeriod}
              onValueChange={(v) => setPerformancePeriod(v as "all" | "month")}
            >
              <SelectTrigger className="w-32 h-8 text-sm font-medium border-gray-200 bg-gray-50 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      </div>
    </div>
  );
};
