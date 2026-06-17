import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { PlatformBadge } from "@/features/pillars/components/PlatformBadge";
import { StatusBadgeContent } from "@/features/pillars/components/StatusBadgeContent";

export interface MiniScheduleItem {
  id: string | number;
  title: string;
  category: string;
  categoryBg: string;
  categoryDot: string;
  status: string;
  statusBg: string;
  statusDot: string;
  platform: string;
  time: string;
}

interface CalendarSchedulesProps {
  dateTitle: string;
  schedules: MiniScheduleItem[];
}

export function CalendarSchedules({
  dateTitle,
  schedules,
}: CalendarSchedulesProps) {
  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-5 space-y-3">
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {dateTitle}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-3 max-h-156.75 overflow-y-auto pr-1 scrollbar-none">
        {schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <CalendarDays className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-400">
              No content scheduled
            </p>
          </div>
        ) : (
          schedules.map((item) => (
            <div
              key={item.id}
              className="w-full border border-gray-200 bg-gray-50 rounded-2xl p-4 space-y-3"
            >
              <h4 className="font-semibold text-gray-900 text-xs md:text-sm leading-snug">
                {item.title}
              </h4>

              <div className="flex items-center gap-2 flex-wrap">
                <PlatformBadge platform={item.category} />

                <StatusBadgeContent
                  status={item.status}
                  className="text-xs font-medium"
                />
              </div>

              <div className="text-xs font-medium text-gray-400">
                {item.platform} • {item.time}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
