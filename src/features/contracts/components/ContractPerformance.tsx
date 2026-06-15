import type { ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  type TooltipProps,
} from "recharts";
import type { ContractCardItem } from "@/features/contracts/components/Contracts";

interface ContractPerformanceProps {
  data: ContractCardItem[];
  title?: string;
  headerAction?: ReactNode;
}

const chartConfig = {
  value: {
    label: "Contract Value",
  },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const statusBg =
      data.status === "Active"
        ? "bg-green-500"
        : data.status === "Completed"
          ? "bg-blue-500"
          : "bg-red-500";
    return (
      <div className="bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-4 flex flex-col gap-2 min-w-72 animate-in fade-in-50 duration-150">
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-wider">
            {data.brand}
          </p>
          <h4 className="text-sm font-semibold text-gray-900 leading-snug">
            {data.title}
          </h4>
        </div>

        <div className="w-full border-t border-gray-100 pt-2 space-y-1.5 text-xs font-semibold text-gray-600">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 font-medium shrink-0">
              Contract Value
            </span>
            <span className="font-bold text-gray-900 shrink-0">
              Rp {data.value}M
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 font-medium shrink-0">
              Content Progress
            </span>
            <span className="font-bold text-gray-900 shrink-0">
              {data.progress}% ({data.progressText} items)
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400 font-medium shrink-0">Status</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] text-white font-bold shrink-0 ${statusBg}`}
            >
              {data.status}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const computeXDomain = (
  data: { value: number }[],
  tickCount = 4,
): { domain: [number, number]; ticks: number[] } => {
  const rawMax = Math.max(...data.map((d) => d.value), 0);

  if (rawMax === 0) {
    return { domain: [0, 80], ticks: [0, 20, 40, 60, 80] };
  }

  let step: number;
  if (rawMax > 100) step = 20;
  else if (rawMax > 50) step = 10;
  else if (rawMax > 20) step = 5;
  else step = 2;

  const niceMax = Math.ceil(rawMax / step) * step;
  const tickStep = niceMax / tickCount;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round(i * tickStep),
  );

  return { domain: [0, niceMax], ticks };
};

export function ContractPerformance({
  data,
  title = "Contract Performance",
  headerAction,
}: ContractPerformanceProps) {
  const chartData = data.map((c) => {
    const numericValue = parseInt(c.valueAmount.replace(/[^0-9]/g, "")) || 0;
    const progressPercent =
      Math.round((c.currentProgress / c.targetProgress) * 100) || 0;

    return {
      id: c.id,
      title: c.title,
      brand: c.brand,
      value: numericValue,
      progress: progressPercent,
      progressText: `${c.currentProgress}/${c.targetProgress}`,
      status: c.status,
    };
  });

  const { domain, ticks } = computeXDomain(chartData);

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-4 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        {headerAction}
      </CardHeader>

      <CardContent className="p-0">
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/30 my-4">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 shadow-sm text-gray-400">
              <BarChart3 className="h-6 w-6 text-gray-300" />
            </div>
            <h3 className="text-sm font-semibold text-gray-950 mb-1">
              No contract data
            </h3>
            <p className="text-xs text-gray-400 text-center max-w-xs leading-normal">
              There is no contract performance data available for this period.
              Try selecting a different year.
            </p>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-65 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                    className="stroke-gray-100"
                  />

                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    domain={domain}
                    ticks={ticks}
                    className="text-xs font-medium text-gray-400"
                    tickFormatter={(val) => `Rp ${val}M`}
                  />

                  <YAxis
                    dataKey="brand"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    className="text-xs font-semibold text-gray-500"
                    width={120}
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(243, 244, 246, 0.4)", radius: 4 }}
                  />

                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
                    {chartData.map((entry, index) => {
                      const color =
                        entry.status === "Active"
                          ? "#2baa7a"
                          : entry.status === "Completed"
                            ? "#3b82f6"
                            : "#ef4444";
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="flex items-center gap-6 text-xs font-semibold text-gray-500 mt-4 pt-2 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-emerald-500" />
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-blue-500" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-red-500" />
                <span>Overdue</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
