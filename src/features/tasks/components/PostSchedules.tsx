import { Calendar, Eye, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ScheduleItem {
  id: string | number;
  time: string;
  title: string;
  platform: string;
  status: "Scheduled" | "Published" | string;
  hasPublishButton: boolean;
}

interface PostScheduleProps {
  schedules: ScheduleItem[];
  title?: string;
  dateText?: string;
  onPreview?: (item: ScheduleItem) => void;
  onPublish?: (item: ScheduleItem) => void;
}

export function PostSchedule({
  schedules,
  title = "Today's Posting Schedule",
  dateText = "April 20, 2024",
  onPreview,
  onPublish,
}: PostScheduleProps) {
  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadown-sm p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        <span className="text-sm text-gray-400 font-medium">{dateText}</span>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-gray-100/70">
        {schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-4 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm mb-4 text-gray-400">
              <Calendar className="h-6 w-6 stroke-[1.5] text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base mb-1.5">
              Belum Ada Jadwal Postingan
            </h3>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Jadwal konten yang akan dipublikasikan hari ini akan ditampilkan di sini.
            </p>
          </div>
        ) : schedules.map((item) => {
          const isPublished = item.status === "Published";
          const borderColor = isPublished
            ? "border-emerald-600"
            : "border-blue-600";
          const statusColor = isPublished
            ? "bg-emerald-600/20 text-emerald-600 hover:bg-emerald-600/20"
            : "bg-blue-600/20 text-blue-600 hover:bg-blue-600/20";
          const statusDotColor = isPublished ? "bg-emerald-600" : "bg-blue-600";

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0 last:pb-0 gap-4"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <span className="text-base font-bold text-gray-900 min-w-12.5 pt-0.5">
                  {item.time}
                </span>

                <div
                  className={`border-l-2 ${borderColor} pl-4 space-y-1.5 min-w-0 flex-1`}
                >
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-500 hover:bg-gray-100 rounded-lg font-normal px-2 py-0.5 text-xs border-none shadow-none"
                    >
                      {item.platform}
                    </Badge>

                    <Badge
                      className={`${statusColor} rounded-lg font-medium px-2 py-0.5 text-xs flex items-center gap-1.5 border shadow-none`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusDotColor}`}
                      />
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview?.(item)}
                  className="bg-gray-50/50 hover:bg-gray-100 text-gray-600 border-gray-300 rounded-sm px-3 h-9 text-xs flex items-center gap-1.5 shadow-none"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </Button>

                {item.hasPublishButton && (
                  <Button
                    size="sm"
                    onClick={() => onPublish?.(item)}
                    className="bg-red-700 hover:bg-red-logo text-white rounded-sm px-3 h-9 text-xs flex items-center gap-1.5 border-none"
                  >
                    <Send className="h-3.5 w-3.5 rotate-45" />
                    Publish
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
