import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { GraphicDonutData } from "@/features/dashboard/components/GraphicDonut";
import { Inbox } from "lucide-react";

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
          <div className="h-52 w-52 shrink-0 flex items-center justify-center">
            <ChartContainer config={chartConfig} className="h-full w-full">
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
            </ChartContainer>
          </div>

          <div className="flex-1 space-y-4 max-h-64 overflow-y-auto">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center text-center p-6 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200/80 space-y-3 min-h-45 transition-all duration-300 hover:border-gray-300 group">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-gray-100 to-gray-200/50 shadow-inner">
                  <Inbox className="w-6 h-6 text-gray-400/80 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="space-y-1.5 max-w-60">
                  <h4 className="text-sm font-semibold text-gray-700 tracking-wide">
                    Belum Ada Data Konten
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Konten berdasarkan pilar belum tersedia atau tidak ditemukan
                    dalam periode yang dipilih.
                  </p>
                </div>
              </div>
            ) : (
              data.map((item, index) => {
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
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
