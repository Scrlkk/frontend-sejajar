// src/components/PlatformEngagement.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";

export interface EngagementData {
  name: string;
  TikTok: number;
  Instagram: number;
  YouTube: number;
}

interface PlatformEngagementProps {
  data: EngagementData[];
  title?: string;
  timeframe?: string;
}

const chartConfig = {
  TikTok: {
    label: "TikTok",
    color: "#252f41",
  },
  Instagram: {
    label: "Instagram",
    color: "#ec4899",
  },
  YouTube: {
    label: "YouTube",
    color: "#ef4444",
  },
} satisfies ChartConfig;

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-md p-4 shadow-xl flex flex-col gap-2 min-w-32.5 animate-in fade-in-50 duration-150">
        <p className="text-sm font-semibold text-gray-800">{label}</p>

        <div className="space-y-1.5 text-xs font-medium">
          {payload.map(
            (entry: { name: string; value: number; color: string }) => (
              <div key={entry.name} className="flex items-center gap-1">
                <span className="font-bold" style={{ color: entry.color }}>
                  : {entry.value.toLocaleString()} views
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

const formatYTick = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  return value.toString();
};

const computeYDomain = (
  data: EngagementData[],
  tickCount = 5,
): { domain: [number, number]; ticks: number[] } => {
  const rawMax = Math.max(
    ...data.flatMap((d) => [d.TikTok, d.Instagram, d.YouTube]),
    0,
  );

  if (rawMax === 0) {
    return { domain: [0, 100], ticks: [0, 25, 50, 75, 100] };
  }

  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const niceMax = Math.ceil(rawMax / magnitude) * magnitude;

  const step = niceMax / tickCount;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round(i * step),
  );

  return { domain: [0, niceMax], ticks };
};

export function PlatformEngagement({
  data,
  title = "Platform Engagement Trend",
  timeframe = "Last 6 weeks",
}: PlatformEngagementProps) {
  const { domain, ticks: yTicks } = computeYDomain(data);

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        <span className="text-sm text-gray-400 font-medium">{timeframe}</span>
      </CardHeader>

      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-70 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 21, left: 0, bottom: 10 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="rgba(156, 163, 175, 0.5)"
              />

              <XAxis
                dataKey="name"
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
                tickFormatter={formatYTick}
                className="text-xs font-medium text-gray-400"
                width={45}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#9ca3af",
                  strokeWidth: 1.5,
                  strokeOpacity: 1,
                }}
              />

              <Line
                type="monotone"
                dataKey="TikTok"
                stroke={chartConfig.TikTok.color}
                strokeWidth={2.5}
                dot={{
                  stroke: chartConfig.TikTok.color,
                  strokeWidth: 2,
                  fill: "#ffffff",
                  r: 4,
                }}
                activeDot={{
                  stroke: chartConfig.TikTok.color,
                  strokeWidth: 2,
                  fill: "#ffffff",
                  r: 6,
                }}
              />
              <Line
                type="monotone"
                dataKey="Instagram"
                stroke={chartConfig.Instagram.color}
                strokeWidth={2.5}
                dot={{
                  stroke: chartConfig.Instagram.color,
                  strokeWidth: 2,
                  fill: "#ffffff",
                  r: 4,
                }}
                activeDot={{
                  stroke: chartConfig.Instagram.color,
                  strokeWidth: 2,
                  fill: "#ffffff",
                  r: 6,
                }}
              />

              <Line
                type="monotone"
                dataKey="YouTube"
                stroke={chartConfig.YouTube.color}
                strokeWidth={2.5}
                dot={{
                  stroke: chartConfig.YouTube.color,
                  strokeWidth: 2,
                  fill: "#ffffff",
                  r: 4,
                }}
                activeDot={{
                  stroke: chartConfig.YouTube.color,
                  strokeWidth: 2,
                  fill: "#ffffff",
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="flex items-center gap-6 text-xs font-semibold text-gray-500 mt-6 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-[#252f41]" />
            <span>TikTok</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-[#ec4899]" />
            <span>Instagram</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-[#ef4444]" />
            <span>YouTube</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
