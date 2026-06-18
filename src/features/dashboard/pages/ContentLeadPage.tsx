import {
  activeContractsData,
  contentLeadCards,
  outputData,
  pillarData,
  sampleComments,
  sampleFeedbacks,
} from "@/data/mockData";
import { ActiveContracts } from "@/features/contracts/components/ActiveContracts";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { GraphicDonutHorizontal } from "@/features/dashboard/components/GraphicDonutHorizontal";
import { ContentOutput } from "@/features/contents/components/ContentOutput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Feedback } from "@/features/reviews/components/Feedback";
import { RecentComments } from "@/features/reviews/components/RecentComments";

export const ContentLeadPage = () => {
  const handleViewAll = () =>
    console.log("Navigasi ke list seluruh kontrak...");
  const availableYears = useMemo(() => {
    const years = [...new Set(outputData.map((d) => d.year))].sort(
      (a, b) => b - a,
    );
    return years;
  }, []);

  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);

  const filteredOutputData = useMemo(
    () => outputData.filter((d) => d.year === selectedYear),
    [selectedYear],
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contentLeadCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <ActiveContracts
          contracts={activeContractsData}
          onViewAll={handleViewAll}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContentOutput
          title="Content Performance"
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
        <GraphicDonutHorizontal
          data={pillarData}
          title="Content Pillar Analytics"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full mx-auto">
          <Feedback
            feedbacks={sampleFeedbacks}
            maxHeightClass="max-h-[350px]"
          />
        </div>
        <div className="w-full mx-auto">
          <RecentComments
            comments={sampleComments}
            maxHeightClass="max-h-[350px]"
          />
        </div>
      </div>
    </div>
  );
};
