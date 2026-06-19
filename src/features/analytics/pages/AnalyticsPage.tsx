import { useMemo, useState } from "react";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import {
  analyticsDataCards,
  trendData,
  topContentData,
  outputData,
  pillarData,
} from "@/data/mockData";
import { ContentOutput } from "@/features/contents/components/ContentOutput";
import { PlatformEngagement } from "@/features/analytics/components/PlatformEngagement";
import { GraphicDonutHorizontal } from "@/features/dashboard/components/GraphicDonutHorizontal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PerformingContent } from "@/features/analytics/components/PerformingContent";

export const AnalyticsPage = () => {
  const availableYears = useMemo(() => {
    const years = [...new Set(outputData.map((d) => d.year))].sort(
      (a, b) => b - a,
    );
    return years;
  }, []);

  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);
  const [performancePeriod, setPerformancePeriod] = useState<"all" | "month">(
    "all",
  );

  const filteredOutputData = useMemo(
    () => outputData.filter((d) => d.year === selectedYear),
    [selectedYear],
  );

  const filteredTopContent = useMemo(
    () => topContentData.filter((d) => d.period === performancePeriod),
    [performancePeriod],
  );

  const filteredTrendData = useMemo(
    () => trendData.filter((d) => d.year === selectedYear),
    [selectedYear],
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsDataCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <PlatformEngagement
          data={filteredTrendData}
          headerAction={
            <Select
              value={String(selectedYear)}
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
              value={String(selectedYear)}
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
        <GraphicDonutHorizontal data={pillarData} title="Content by Pillar" />
      </div>
      <div className="w-full mx-auto">
        <PerformingContent
          items={filteredTopContent}
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
