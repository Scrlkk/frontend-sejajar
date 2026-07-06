import type { ReactNode } from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  type TooltipProps,
} from "recharts";

export interface EmployeePerformanceData {
  id: number;
  name: string;
  role: string;
  initials: string;
  tasksCount: number;
  completionRate: number;
  avatarBg: string;
  month: string;
  year: number;
}

interface EmployeeAnalyticsProps {
  data: EmployeePerformanceData[];
  title?: string;
  headerAction?: ReactNode;
}

const chartConfig = {
  tasksCount: {
    label: "Total Tasks",
  },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const rateColor =
      data.completionRate >= 90
        ? "text-emerald-500"
        : data.completionRate >= 70
          ? "text-amber-500"
          : "text-rose-500";

    return (
      <div className="bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-4 flex flex-col gap-2 min-w-64 animate-in fade-in-50 duration-150">
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-wider">
            {data.role}
          </p>
          <h4 className="text-sm font-semibold text-gray-900 leading-snug">
            {data.name}
          </h4>
        </div>

        <div className="w-full border-t border-gray-100 pt-2 space-y-1.5 text-xs font-semibold text-gray-600">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 font-medium shrink-0">
              Total Tasks
            </span>
            <span className="font-bold text-gray-900 shrink-0">
              {data.tasksCount} tasks
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 font-medium shrink-0">
              Completion Rate
            </span>
            <span className={`font-bold shrink-0 ${rateColor}`}>
              {data.completionRate}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const EmployeeAnalytics = ({
  data,
  title = "Top 5 Employee Analytics",
  headerAction,
}: EmployeeAnalyticsProps) => {
  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => b.tasksCount - a.tasksCount)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        displayName: item.name.length > 15 ? item.name.slice(0, 15) + "..." : item.name,
      }));
  }, [data]);

  const maxTasks = useMemo(() => {
    const rawMax = Math.max(...chartData.map((d) => d.tasksCount), 0);
    return rawMax === 0 ? 10 : Math.ceil(rawMax * 1.1);
  }, [chartData]);

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-4 space-y-0">
        <div className="space-y-0.5">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
        </div>
        {headerAction}
      </CardHeader>

      <CardContent className="p-0">
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 my-4">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 shadow-sm text-gray-400">
              <Users className="h-6 w-6 text-gray-300" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              No employee performance data
            </h3>
            <p className="text-xs text-gray-400 text-center max-w-xs leading-normal">
              There is no performance metrics available for this period.
            </p>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-65 w-full">
              <BarChart
                data={chartData}
                layout="horizontal"
                margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-gray-100"
                />

                <XAxis
                  dataKey="displayName"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  className="text-xs font-semibold text-gray-500"
                />

                <YAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  domain={[0, maxTasks]}
                  allowDecimals={false}
                  className="text-xs font-medium text-gray-400"
                  tickFormatter={(val) => `${val}`}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(243, 244, 246, 0.4)", radius: 4 }}
                />

                <Bar
                  dataKey="tasksCount"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                  label={{ position: "top", fill: "#6b7280", fontSize: 11, fontWeight: "bold" }}
                >
                  {chartData.map((entry, index) => {
                    const color =
                      entry.completionRate >= 90
                        ? "#10b981"
                        : entry.completionRate >= 70
                          ? "#f59e0b"
                          : "#ef4444";
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ChartContainer>

            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-gray-500 mt-4 pt-2 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-emerald-500" />
                <span>Excellent (&ge;90%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-amber-500" />
                <span>Good (70% - 89%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-red-500" />
                <span>Needs Improvement (&lt;70%)</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};