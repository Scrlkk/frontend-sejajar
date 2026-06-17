import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import {
  scriptWriterCards,
  scriptOutputData,
} from "@/features/dashboard/data/scriptwriterCard";
import { RevisionDashboard } from "@/features/reviews/components/RevisionDashboard";
import { GraphicDonutHorizontal } from "@/features/dashboard/components/GraphicDonutHorizontal";
import { pillarData } from "@/features/contents/data/contentData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { ContentOutput } from "@/features/contents/components/ContentOutput";
import { useMemo, useState } from "react";
import { UpcomingDeadlines } from "@/features/tasks/components/UpcomingDeadlines";
import { sampleDeadlines } from "@/features/dashboard/data/contenteditor";
import { RecentComments } from "@/features/reviews/components/RecentComments";
import { sampleComments } from "@/features/reviews/data/reviewsData";

import { useNavigate } from "react-router-dom";

export const ScriptWriterPage = () => {
  const navigate = useNavigate();
  const handleReviseClick = () => {
    navigate("/drafts?id=1");
  };

  const availableYears = useMemo(() => {
    const years = [...new Set(scriptOutputData.map((d) => d.year))].sort(
      (a, b) => b - a,
    );
    return years;
  }, []);

  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);

  const filteredOutputData = useMemo(
    () => scriptOutputData.filter((d) => d.year === selectedYear),
    [selectedYear],
  );

  const SampleRevisionData = {
    title: "Day 1 Challenge - Full Body Warmup",
    description:
      "Owner requested more energetic and hype tone. Please revise the opening 10 seconds to be more punchy.",
    dueDateText: "Due: May 1, 2024",
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scriptWriterCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <RevisionDashboard
        title={SampleRevisionData.title}
        description={SampleRevisionData.description}
        dueDateText={SampleRevisionData.dueDateText}
        onRevise={handleReviseClick}
      />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UpcomingDeadlines deadlines={sampleDeadlines} />
        <RecentComments
          comments={sampleComments}
          maxHeightClass="max-h-[300px]"
        />
      </div>
    </div>
  );
};
