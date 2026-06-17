import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ProgressStatusItem {
  label: string;
  value: number;
  dotColor: string; // Tailwind color class for dot, e.g. "bg-blue-600"
  textColor: string; // Tailwind color class for value text, e.g. "text-blue-600"
}

export interface ProductionProgressProps {
  title?: string;
  current?: number;
  target?: number;
  items?: ProgressStatusItem[];
}

export function ProductionProgress({
  title = "Production Progress",
  current = 24,
  target = 24,
  items = [],
}: ProductionProgressProps) {
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0;

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6">
      {/* Header Title */}
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 flex flex-col">
        {/* Progress Text and Percentage */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-800">
            {current}/{target} content
          </span>
          <span className="text-sm font-semibold text-red-800">
            {percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-red-800 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Breakdown Items */}
        <div className="flex flex-col gap-2.5">
          {items.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center justify-between space-y-2.25 text-sm font-normal ${
                index !== items.length - 1
              }`}
            >
              {/* Left Side: Dot and Label */}
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full shrink-0 ${item.dotColor}`}
                />
                <span className="text-slate-500 font-medium">{item.label}</span>
              </div>
              {/* Right Side: Colored Value */}
              <span className={`font-semibold text-right ${item.textColor}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
