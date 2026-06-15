import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface DeadlineItem {
  id: string | number;
  title: string;
  category: string;
  categoryBg: string;
  categoryDot: string;
  status: string;
  statusBg: string;
  statusDot: string;
  dueDateText: string;
  dueDate?: Date;
}

interface UpcomingDeadlinesProps {
  title?: string;
  deadlines: DeadlineItem[];
}

export function UpcomingDeadlines({
  title = "Upcoming Deadlines",
  deadlines,
}: UpcomingDeadlinesProps) {
  return (
    <Card className="w-full max-w-3xl bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg p-6 space-y-4">

      <CardHeader className="p-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>

      
      <CardContent className="p-0 space-y-3 max-h-75 overflow-y-auto pr-1">
        {deadlines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/30">
            <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3 shadow-sm">
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-gray-900">
              No upcoming deadlines
            </p>
            <p className="text-[10px] text-gray-400 mt-1 max-w-xs">
              All your content is scheduled and on track. Nice job!
            </p>
          </div>
        ) : (
          deadlines.map((item) => {
            const isOverdue = item.dueDate
              ? new Date(item.dueDate) < new Date()
              : false;

            return (
              <div
                key={item.id}
                className={`w-full rounded-2xl p-4 flex flex-row items-center justify-between gap-4 transition-all border
                  ${
                    isOverdue
                      ? "bg-red-50 border border-red-500"
                      : "bg-white border border-gray-300"
                  }
                `}
              >
                
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base leading-snug truncate">
                    {item.title}
                  </h4>

                  <div className="flex items-center gap-2 flex-wrap">
                    
                    <Badge
                      variant="outline"
                      className={`${item.categoryBg} rounded-full font-medium px-2.5 py-0.5 text-xs flex items-center gap-1.5 shadow-none border`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${item.categoryDot}`}
                      />
                      {item.category}
                    </Badge>

                    
                    <Badge
                      className={`${item.statusBg} rounded-full font-medium px-2.5 py-0.5 text-xs border-none shadow-none flex items-center gap-1.5`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${item.statusDot}`}
                      />
                      {item.status}
                    </Badge>
                  </div>
                </div>

                
                <div className="flex items-center gap-2.5 shrink-0 text-right">
                  <div className="flex flex-col">
                    {isOverdue ? (
                      <>
                        <span className="text-xs md:text-sm font-bold text-red-600 tracking-wide">
                          Overdue
                        </span>
                        <span className="text-[11px] md:text-xs font-semibold text-red-400">
                          {item.dueDateText}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs md:text-sm font-bold text-gray-500 tracking-wide">
                          Upcoming
                        </span>
                        <span className="text-[11px] md:text-xs font-semibold text-gray-400">
                          {item.dueDateText}
                        </span>
                      </>
                    )}
                  </div>

                  {isOverdue ? (
                    <AlertTriangle className="h-5 w-5 text-red-600 stroke-[2.5]" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
