import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface HealthMetric {
  label: string;
  valueText: string;
  percentage: number;
  barColor: string;
}

interface SystemHealthProps {
  metrics: HealthMetric[];
}

export function SystemHealth({ metrics }: SystemHealthProps) {
  return (
    <Card className="w-full h-full max-w-sm bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg p-2 flex flex-col justify-center">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          System Health
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-gray-400">{metric.label}</span>
              <span className="text-gray-900 font-bold">
                {metric.valueText}
              </span>
            </div>

            <Progress
              value={metric.percentage}
              className={`h-2 bg-gray-100 [&>div]:bg-current ${metric.barColor}`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
