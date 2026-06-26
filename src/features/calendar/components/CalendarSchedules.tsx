import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Calendar, Clock } from "lucide-react";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";
import { FormatBadgeContent } from "@/features/pillars/components/FormatBadgeContent";
import { StatusBadgeContent } from "@/features/pillars/components/StatusBadgeContent";
import { usePermissions } from "@/hooks/usePermissions";
import { formatDate } from "@/utils/helpers";

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
  format?: string;
  priority?: string;
  date?: Date;
}

interface CalendarSchedulesProps {
  dateTitle: string;
  schedules: MiniScheduleItem[];
}

export function CalendarSchedules({
  dateTitle,
  schedules,
}: CalendarSchedulesProps) {
  const { roles } = usePermissions();
  const showContentVsTaskType = useMemo(() => {
    const allowed = ["owner", "content_lead", "superadmin"];
    return roles.some((r) => allowed.includes(r));
  }, [roles]);

  const taskCount = schedules.filter((s) =>
    s.id.toString().startsWith("t_"),
  ).length;
  const contentCount = schedules.filter((s) =>
    s.id.toString().startsWith("c_"),
  ).length;

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-5 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-0 space-y-0 pb-3 shrink-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {dateTitle}
        </CardTitle>
        {schedules.length > 0 && (
          <div className="text-xs font-bold text-gray-500 bg-gray-50 border border-gray-150 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
            {showContentVsTaskType ? (
              <>
                {taskCount > 0 && (
                  <span>
                    {taskCount} {taskCount === 1 ? "Task" : "Tasks"}
                  </span>
                )}
                {taskCount > 0 && contentCount > 0 && (
                  <span className="text-gray-300 select-none">•</span>
                )}
                {contentCount > 0 && (
                  <span>
                    {contentCount} {contentCount === 1 ? "Content" : "Contents"}
                  </span>
                )}
              </>
            ) : (
              <span>
                {schedules.length}{" "}
                {schedules.length === 1 ? "Task" : "Tasks"}
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 space-y-3 overflow-y-auto max-h-125 pr-1 scrollbar-none">
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
              <h4 className="font-medium text-gray-900 text-[12px] md:text-sm leading-snug">
                {item.title}
              </h4>

              <div className="flex items-center gap-2 flex-wrap">
                {showContentVsTaskType &&
                  (item.id.toString().startsWith("c_") ? (
                    <span className="rounded-lg px-2 py-0.5 text-[10px] font-bold border border-blue-200 bg-blue-50 text-blue-700 shrink-0">
                      Content (Schedule)
                    </span>
                  ) : (
                    <span className="rounded-lg px-2 py-0.5 text-[10px] font-bold border border-purple-200 bg-purple-50 text-purple-700 shrink-0">
                      Task (Deadline)
                    </span>
                  ))}
                <PillarsCard category={item.category} />
                {item.format && <FormatBadgeContent format={item.format} />}

                <StatusBadgeContent
                  status={item.status}
                  className="text-[10px] font-medium px-2"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-150/60">
                <div className="text-[10px] font-medium text-gray-500 flex items-center gap-1.5">
                  <span className="text-gray-400">Platform:</span>
                  <span className="font-semibold text-gray-700">{item.platform}</span>
                  {item.priority && (
                    <>
                      <span className="text-gray-300 select-none">•</span>
                      <span className="text-gray-400">Priority:</span>
                      <span className="font-semibold text-gray-700">
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1).toLowerCase()}
                      </span>
                    </>
                  )}
                </div>

                {item.id.toString().startsWith("t_") ? (
                  (() => {
                    if (!item.date) return null;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const deadlineDate = new Date(item.date);
                    deadlineDate.setHours(0, 0, 0, 0);

                    const diffTime = deadlineDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    const isCompleted = ["approved", "scheduled", "published"].includes(item.status.toLowerCase());

                    let badgeClass = "text-gray-600 bg-gray-50 border border-gray-200";
                    let label = `Deadline: ${formatDate(item.date)}`;

                    if (!isCompleted) {
                      if (diffDays < 0) {
                        badgeClass = "text-red-700 bg-red-50 border border-red-200 animate-pulse";
                        label = `Overdue: ${formatDate(item.date)}`;
                      } else if (diffDays <= 3) {
                        badgeClass = "text-rose-700 bg-rose-50 border border-rose-100";
                        label = `Deadline: ${formatDate(item.date)}`;
                      }
                    } else {
                      badgeClass = "text-emerald-700 bg-emerald-50 border border-emerald-100";
                      label = `Completed: ${formatDate(item.date)}`;
                    }

                    return (
                      <div className={`flex items-center gap-1.5 text-[10px] rounded-lg px-2.5 py-1 w-fit font-bold shadow-sm ${badgeClass}`}>
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>{label}</span>
                      </div>
                    );
                  })()
                ) : (
                  item.time && (
                    <div className="flex items-center gap-1.5 text-[10px] text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1 w-fit font-bold shadow-sm">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>Publish Time: {item.time}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
