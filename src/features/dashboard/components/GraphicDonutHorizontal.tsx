import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { GraphicDonutData } from "./GraphicDonut";

interface GraphicDonutHorizontalProps {
  data: GraphicDonutData[];
  title?: string;
  configLabel?: string;
}

export function GraphicDonutHorizontal({
  data,
  title = "Content by Pillar",
  configLabel = "Total",
}: GraphicDonutHorizontalProps) {
  const chartConfig = {
    value: {
      label: configLabel,
    },
  } satisfies ChartConfig;

  const isEmpty = data.length === 0 || data.every((item) => item.value === 0);
  const chartData = isEmpty
    ? [{ name: "Tidak ada data", value: 1, fill: "#E5E7EB" }]
    : data;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex items-center gap-8">
          {/* Donut Chart - Left */}
          <div className="h-52 w-52 shrink-0 flex items-center justify-center">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={isEmpty ? 0 : 3}
                    isAnimationActive={!isEmpty}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Legend - Right */}
          <div className="flex-1 space-y-4 max-h-64 overflow-y-auto">
            {data.map((item, index) => {
              const percentage =
                total > 0 ? Math.round((item.value / total) * 100) : 0;

              return (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      {item.name}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {percentage}%
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        minWidth: percentage > 0 ? "4px" : "0px",
                        backgroundColor: item.fill,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
