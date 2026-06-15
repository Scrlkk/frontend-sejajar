import type { ReactNode } from "react";
import { UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EmployeePerformanceData } from "@/features/dashboard/data/ownerData";

interface EmployeePerformanceProps {
  data: EmployeePerformanceData[];
  title?: string;
  headerAction?: ReactNode;
}

export function EmployeePerformance({
  data,
  title = "Employee Performance",
  headerAction,
}: EmployeePerformanceProps) {
  const sortedData = [...data].sort((a, b) => b.tasksCount - a.tasksCount);
  const maxTasks = sortedData[0]?.tasksCount || 1;
  const displayedData = sortedData.slice(0, 5);

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-5 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        {headerAction}
      </CardHeader>

      <CardContent className="p-0">
        {sortedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 shadow-sm text-gray-400">
              <UserRound className="h-6 w-6 text-gray-300" />
            </div>
            <h3 className="text-sm font-semibold text-gray-950 mb-1">
              No employee performance data
            </h3>
            <p className="text-xs text-gray-400 text-center max-w-xs leading-normal">
              There is no performance metrics available for this period.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedData.map((employee, index) => {
              const rank = index + 1;
              const rate = employee.completionRate;
              const barWidthPercent = Math.min(
                100,
                Math.max(
                  0,
                  Math.round((employee.tasksCount * rate) / maxTasks),
                ),
              );
              const isTopRank = rank === 1;

              const rateColor =
                rate >= 90 ? "text-emerald-500" : "text-amber-500";
              const progressColor =
                rate >= 90 ? "bg-emerald-500" : "bg-amber-500";

              return (
                <div
                  key={employee.id}
                  className={`flex items-center justify-between px-3.5 py-1.75 rounded-xl border transition-all ${
                    isTopRank
                      ? "border-amber-200 bg-amber-50/15 shadow-sm"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-bold w-6 text-center ${
                        isTopRank ? "text-amber-500 text-sm" : "text-gray-400"
                      }`}
                    >
                      #{rank}
                    </span>

                    <div
                      className={`h-9 w-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ${employee.avatarBg}`}
                    >
                      {employee.initials}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 leading-none mb-1">
                        {employee.name}
                      </h4>
                      <p className="text-xs font-medium text-gray-400">
                        {employee.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-xs font-bold text-gray-950">
                      {employee.tasksCount} tasks
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden shrink-0 flex justify-end">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                          style={{ width: `${barWidthPercent}%` }}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-bold shrink-0 w-8 text-right ${rateColor}`}
                      >
                        {rate}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
