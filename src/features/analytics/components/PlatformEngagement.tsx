import { useState, useMemo, type ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import { PLATFORM_CONFIG } from "@/features/platforms/constants/platformConfig";
import type { TopContent } from "@/features/analytics/api/analyticsApi";
import { getColorToken } from "@/features/pillars/constants/colorPalette";

// ─── palette fallback for platforms not yet in PLATFORM_CONFIG ─────────────────
const FALLBACK_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#8b5cf6",
  "#0ea5e9", "#f43f5e", "#84cc16", "#14b8a6",
];

export interface PlatformInfo {
  id: number;
  platform_name: string;
  color_key?: string | null;
}

/** One row in the chart — keys are platform names, value is cumulative metric value */
export type EngagementDataRow = {
  name: string;     // x-axis label (e.g. "26 Jun")
  date?: string;     // raw date (e.g. "2026-06-26")
  [platform: string]: number | string | undefined;
};

interface PlatformEngagementProps {
  data: EngagementDataRow[];
  platforms?: PlatformInfo[];
  title?: string;
  timeframe?: string;
  headerAction?: ReactNode;
  activeMetric?: "views" | "likes" | "comments" | "shares";
  activeGranularity?: "daily" | "weekly" | "monthly";
  onMetricChange?: (metric: "views" | "likes" | "comments" | "shares") => void;
  onGranularityChange?: (granularity: "daily" | "weekly" | "monthly") => void;
  topContents?: TopContent[];
}

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Resolve a hex color for a given platform */
const resolvePlatformColor = (
  platform: PlatformInfo,
  fallbackIndex: number
): string => {
  if (platform.color_key?.startsWith("#")) return platform.color_key;

  // Resolving hex color dynamically from the centralized palette mapping
  const token = getColorToken(platform.platform_name, platform.color_key);
  if (token?.hex) return token.hex;

  const cfg = PLATFORM_CONFIG[platform.platform_name];
  if (cfg?.chartColor) return cfg.chartColor;
  return FALLBACK_COLORS[fallbackIndex % FALLBACK_COLORS.length];
};

const formatYTick = (value: number): string => {
  if (value >= 1_000_000)
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  if (value >= 1_000)
    return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  return value.toString();
};

const computeYDomain = (
  data: EngagementDataRow[],
  platformNames: string[],
  tickCount = 5
): { domain: [number, number]; ticks: number[] } => {
  const rawMax = Math.max(
    ...data.flatMap((d) =>
      platformNames.map((p) => (typeof d[p] === "number" ? (d[p] as number) : 0))
    ),
    0
  );

  if (rawMax === 0) {
    return { domain: [0, 100], ticks: [0, 25, 50, 75, 100] };
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

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

interface TooltipEntry {
  name?: string;
  value?: number;
  color?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null;

  const entries = (payload as TooltipEntry[]).filter(
    (e) => e.name && (e.value ?? 0) > 0
  );

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xl min-w-40 animate-in fade-in-50 duration-150">
      <p className="text-xs font-semibold text-gray-500 mb-3 pb-2 border-b border-gray-100">
        {label}
      </p>
      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-xs text-gray-400 italic">Tidak ada data</p>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.name}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color || "#6b7280" }}
                />
                <span className="text-xs font-medium text-gray-700">
                  {entry.name}
                </span>
              </div>
              <span
                className="text-xs font-bold tabular-nums"
                style={{ color: entry.color || "#6b7280" }}
              >
                {(entry.value ?? 0).toLocaleString("id-ID")}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export function PlatformEngagement({
  data,
  platforms,
  title = "Platform Engagement Trend",
  timeframe,
  headerAction,
  activeMetric,
  activeGranularity,
  onMetricChange,
  onGranularityChange,
  topContents = [],
}: PlatformEngagementProps) {
  // Local fallbacks if parents don't manage states (like OwnerPage)
  const [localMetric, setLocalMetric] = useState<"views" | "likes" | "comments" | "shares">("views");
  const [localGranularity, setLocalGranularity] = useState<"daily" | "weekly" | "monthly">("daily");

  const metric = activeMetric ?? localMetric;
  const granularity = activeGranularity ?? localGranularity;

  const setMetric = (val: "views" | "likes" | "comments" | "shares") => {
    setLocalMetric(val);
    onMetricChange?.(val);
  };

  const setGranularity = (val: "daily" | "weekly" | "monthly") => {
    setLocalGranularity(val);
    onGranularityChange?.(val);
  };

  // State to manage hidden lines
  const [hiddenPlatforms, setHiddenPlatforms] = useState<string[]>([]);
  const togglePlatform = (name: string) => {
    setHiddenPlatforms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  // State to track platform selected for content breakdown
  const [selectedBreakdownPlatform, setSelectedBreakdownPlatform] = useState<string | null>(null);
  // State to track if the breakdown list is expanded
  const [isExpandedBreakdown, setIsExpandedBreakdown] = useState(false);

  const handleSelectBreakdownPlatform = (platformName: string) => {
    setSelectedBreakdownPlatform(platformName);
    setIsExpandedBreakdown(false);
  };

  // Dynamically extract platforms if not provided as a prop (useful for fallback or legacy callers)
  const resolvedPlatforms = useMemo(() => {
    if (platforms && platforms.length > 0) return platforms;
    if (!data || data.length === 0) return [];

    const excludeKeys = ["name", "date", "year"];
    const platformNames = Array.from(
      new Set(
        data.flatMap((row) =>
          Object.keys(row).filter((k) => !excludeKeys.includes(k))
        )
      )
    );

    return platformNames.map((name, index) => ({
      id: index + 1,
      platform_name: name,
      color_key: null,
    }));
  }, [platforms, data]);

  // Only render platforms that have at least one non-zero data point
  const activePlatforms = resolvedPlatforms.filter((p) =>
    data?.some(
      (d) => typeof d[p.platform_name] === "number" && (d[p.platform_name] as number) > 0
    )
  );
  const activePlatformNames = activePlatforms
    .filter((p) => !hiddenPlatforms.includes(p.platform_name))
    .map((p) => p.platform_name);

  const { domain, ticks: yTicks } = computeYDomain(data, activePlatformNames);

  const hasNoData =
    !data ||
    data.length === 0 ||
    activePlatforms.length === 0;

  // Build a minimal chartConfig for ChartContainer (required by shadcn)
  const chartConfig = Object.fromEntries(
    activePlatforms.map((p, i) => [
      p.platform_name,
      { label: p.platform_name, color: resolvePlatformColor(p, i) },
    ])
  );

  // Determine active platform for breakdown
  const activeBreakdownPlatform =
    selectedBreakdownPlatform ||
    (activePlatforms.length > 0 ? activePlatforms[0].platform_name : null);

  const getMetricValue = (item: TopContent, metricKey: "views" | "likes" | "comments" | "shares"): number => {
    const totalKey = `total_${metricKey}` as keyof TopContent;
    const directKey = metricKey as keyof TopContent;
    const val = item[directKey] ?? item[totalKey] ?? 0;
    return Number(val);
  };

  // Filter and sort topContents for activeBreakdownPlatform
  const filteredContents = useMemo(() => {
    if (!topContents || !activeBreakdownPlatform) return [];
    return topContents
      .filter(
        (item) =>
          item.platform_name?.toLowerCase() === activeBreakdownPlatform.toLowerCase()
      )
      .map((item) => {
        const val = getMetricValue(item, metric);
        return { ...item, val };
      })
      .sort((a, b) => b.val - a.val);
  }, [topContents, activeBreakdownPlatform, metric]);

  const totalPlatformMetric = useMemo(() => {
    return filteredContents.reduce((sum, item) => sum + item.val, 0);
  }, [filteredContents]);

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between p-0 mb-6 space-y-4 md:space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
          {timeframe && (
            <p className="text-xs text-gray-400 font-medium">
              {timeframe}
            </p>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Metric Selector */}
          <div className="bg-gray-100/80 p-0.5 rounded-lg flex items-center border border-gray-200">
            {(["views", "likes", "comments", "shares"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer capitalize ${
                  metric === m
                    ? "bg-white text-gray-950 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Granularity Selector */}
          <div className="bg-gray-100/80 p-0.5 rounded-lg flex items-center border border-gray-200">
            {(["daily", "weekly", "monthly"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer capitalize ${
                  granularity === g
                    ? "bg-white text-gray-950 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {headerAction}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {hasNoData ? (
          <div className="h-70 w-full flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50 space-y-2 p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shadow-sm">
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-gray-700">
                Belum Ada Data Performa
              </h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                Tren interaksi platform akan ditampilkan di sini setelah data
                performa diimpor atau tersedia.
              </p>
            </div>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-70 w-full">
            <LineChart
              data={data}
              margin={{ top: 15, right: 21, left: 0, bottom: 10 }}
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
                  stroke: "#e5e7eb",
                  strokeWidth: 1.5,
                  strokeDasharray: "4 2",
                }}
              />


              {activePlatforms.map((platform, i) => {
                const color = resolvePlatformColor(platform, i);
                return (
                  <Line
                    key={platform.id}
                    type="monotone"
                    dataKey={platform.platform_name}
                    stroke={color}
                    strokeWidth={2.5}
                    hide={hiddenPlatforms.includes(platform.platform_name)}
                    dot={{
                      stroke: color,
                      strokeWidth: 2,
                      fill: "#ffffff",
                      r: 4,
                    }}
                    activeDot={{
                      stroke: color,
                      strokeWidth: 2,
                      fill: "#ffffff",
                      r: 6,
                    }}
                    connectNulls
                  />
                );
              })}
            </LineChart>
          </ChartContainer>
        )}

        {/* Legend — only show platforms with data */}
        {activePlatforms.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-gray-500 mt-6 pt-3 border-t border-gray-100">
            {activePlatforms.map((platform, i) => {
              const color = resolvePlatformColor(platform, i);
              const isHidden = hiddenPlatforms.includes(platform.platform_name);
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.platform_name)}
                  className={`flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-85 focus:outline-none ${
                    isHidden ? "opacity-35" : ""
                  }`}
                >
                  <span
                    className="h-0.5 w-4 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className={isHidden ? "line-through text-gray-400 font-medium" : "text-gray-600"}>
                    {platform.platform_name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content Contribution Breakdown */}
        {activeBreakdownPlatform && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold text-gray-900">
                  Kontribusi Konten - {activeBreakdownPlatform}
                </h4>
                <p className="text-xs text-gray-400 font-medium">
                  Peringkat rencana konten berdasarkan persentase kontribusi terhadap total {metric}
                </p>
              </div>

              {/* Selector breakdown platform tabs */}
              <div className="flex flex-wrap items-center gap-1">
                {activePlatforms.map((p) => {
                  const isSelected = activeBreakdownPlatform === p.platform_name;
                  const token = getColorToken(p.platform_name, p.color_key);
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectBreakdownPlatform(p.platform_name)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all border cursor-pointer ${
                        isSelected
                          ? token.selected
                          : "bg-white text-slate-600 border-gray-200 hover:bg-slate-50"
                      }`}
                    >
                      {p.platform_name}
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredContents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                <p className="text-xs text-gray-400 font-medium">
                  Tidak ada konten kontribusi yang tercatat untuk platform ini.
                </p>
              </div>
            ) : (
              <>
                <div className={`space-y-3 pr-1 ${isExpandedBreakdown ? "max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent" : ""}`}>
                  {(() => {
                    const maxCollapsedItems = 3;
                    const visibleContents = isExpandedBreakdown
                      ? filteredContents
                      : filteredContents.slice(0, maxCollapsedItems);

                    return visibleContents.map((content, idx) => {
                      const percentage = totalPlatformMetric > 0
                        ? (content.val / totalPlatformMetric) * 100
                        : 0;

                      const activePlatformInfo = activePlatforms.find(
                        (p) => p.platform_name === activeBreakdownPlatform
                      );
                      const platformColor = activePlatformInfo
                        ? resolvePlatformColor(activePlatformInfo, idx)
                        : "#6366f1";

                      return (
                        <div
                          key={content.id}
                          className="group flex flex-col gap-1.5 p-3 rounded-lg border border-gray-100 hover:border-gray-200 bg-gray-50/20 hover:bg-gray-50/60 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-gray-100 text-[10px] font-extrabold text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all shrink-0">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <h5 className="text-xs font-semibold text-gray-800 line-clamp-1 group-hover:text-gray-900 transition-colors">
                                  {content.title}
                                </h5>
                                {content.contract_name && (
                                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                                    Rencana: {content.contract_name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-gray-700">
                                {content.val.toLocaleString("id-ID")}{" "}
                                <span className="text-[10px] font-semibold text-gray-400 lowercase">{metric}</span>
                              </span>
                              <span className="text-[10px] font-bold text-gray-500 ml-1.5">
                                ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="h-1.5 w-full bg-gray-100/80 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full rounded-full transition-all duration-500 ease-out"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: platformColor,
                              }}
                            />
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {filteredContents.length > 3 && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setIsExpandedBreakdown((prev) => !prev)}
                      className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {isExpandedBreakdown ? (
                        <>
                          <span>Sederhanakan</span>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>Lihat Semua ({filteredContents.length})</span>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
