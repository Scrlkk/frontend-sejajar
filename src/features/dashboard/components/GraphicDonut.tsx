import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

export interface GraphicDonutData {
  name: string;
  value: number;
  color: string;
  fill: string;
}

interface GraphicDonutProps {
  data: GraphicDonutData[];
  title?: string;
  configLabel?: string;
}

export function GraphicDonut({
  data,
  title,
  configLabel = "Total",
}: GraphicDonutProps) {
  const chartConfig = {
    value: {
      label: configLabel,
    },
  } satisfies ChartConfig;

  const isEmpty = data.length === 0 || data.every((item) => item.value === 0);
  const chartData = isEmpty
    ? [{ name: "Tidak ada data", value: 1, fill: "#E5E7EB" }]
    : data;

  return (
    <Card className="w-full h-full max-w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg p-2">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg text-center font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="h-45 w-full flex items-center justify-center mt-2">
          <ChartContainer
            config={chartConfig}
            className="h-full w-full max-w-45"
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={75}
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

        <div className="space-y-2.5 px-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${item.color} shrink-0`}
                />
                <span className="text-gray-600 font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
