import { useState, useMemo, type ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";

export interface ContentOutputData {
  month: string;
  year: number;
  [key: string]: number | string;
}

interface ContentOutputProps {
  data: ContentOutputData[];
  title?: string;
  headerAction?: ReactNode;
}

const KEY_COLORS: Record<string, string> = {
  Draft: "#94a3b8",
  "On Progress": "#d97706",
  Approved: "#10b981",
  Published: "#0891b2",
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const visibleEntries = payload.filter(
      (entry) => entry.value !== undefined && entry.value > 0
    );

    if (visibleEntries.length === 0) return null;

    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xl flex flex-col gap-2 min-w-35 animate-in fade-in-50 duration-150">
        <p className="text-sm font-bold text-gray-800">{label}</p>

        <div className="space-y-1.5 text-xs font-semibold">
          {visibleEntries.map(
            (entry: { name?: string; value?: number; color?: string }) => (
              <div
                key={entry.name || ""}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-sm shrink-0"
                    style={{ backgroundColor: entry.color || "" }}
                  />
                  <span className="text-gray-500 font-medium">
                    {entry.name || ""}
                  </span>
                </div>
                <span className="font-bold text-gray-900">
                  {entry.value || 0} items
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    );
  }
  return null;
};

const computeYDomain = (
  data: ContentOutputData[],
  keys: string[],
  hiddenKeys: string[],
  tickCount = 4,
): { domain: [number, number]; ticks: number[] } => {
  const visibleKeys = keys.filter((k) => !hiddenKeys.includes(k));
  const rawMax = Math.max(
    ...data.map((d) =>
      visibleKeys.reduce((sum, key) => sum + (Number(d[key]) || 0), 0)
    ),
    0,
  );

  if (rawMax === 0) {
    return { domain: [0, 8], ticks: [0, 2, 4, 6, 8] };
  }

  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const niceMax = Math.ceil(rawMax / magnitude) * magnitude;

  const step = niceMax / tickCount;
  const ticks = Array.from(
    new Set(
      Array.from({ length: tickCount + 1 }, (_, i) => Math.round(i * step))
    )
  );

  return { domain: [0, niceMax], ticks };
};

export function ContentOutput({
  data,
  title = "Content Output Over Time",
  headerAction,
}: ContentOutputProps) {
  const [hiddenKeys, setHiddenKeys] = useState<string[]>([]);

  const keys = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(
      (k) =>
        k !== "month" &&
        k !== "year" &&
        k !== "Assigned" &&
        k !== "Review" &&
        k !== "Revision"
    );
  }, [data]);

  const { domain, ticks: yTicks } = useMemo(() => {
    return computeYDomain(data, keys, hiddenKeys);
  }, [data, keys, hiddenKeys]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    keys.forEach((key) => {
      config[key] = {
        label: key,
        color: KEY_COLORS[key] || "#94a3b8",
      };
    });
    return config;
  }, [keys]);

  const toggleKey = (key: string) => {
    setHiddenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-4 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        {headerAction}
      </CardHeader>

      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No data available
            </h3>
            <p className="text-sm text-gray-400 text-center max-w-xs">
              There's no content output data for the selected period. Try
              selecting a different year.
            </p>
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className="h-55 w-full">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-gray-100"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  className="text-xs font-medium text-gray-400"
                  dy={12}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={domain}
                  ticks={yTicks}
                  className="text-xs font-medium text-gray-400"
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                />

                {keys.map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={chartConfig[key]?.color}
                    hide={hiddenKeys.includes(key)}
                    maxBarSize={20}
                  />
                ))}
              </BarChart>
            </ChartContainer>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-gray-500 mt-4 pt-2 border-t border-gray-50">
              {keys.map((key) => {
                const isHidden = hiddenKeys.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => toggleKey(key)}
                    className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-85 focus:outline-none ${
                      isHidden ? "opacity-35" : ""
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded shrink-0"
                      style={{ backgroundColor: chartConfig[key]?.color }}
                    />
                    <span className={isHidden ? "line-through text-gray-400 font-medium" : "text-gray-600"}>
                      {key}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
