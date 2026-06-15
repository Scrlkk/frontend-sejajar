import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface PlatformSummaryItem {
  id: string | number;
  name: "TikTok" | "Instagram" | "YouTube" | string;
  postCount: number;
  dotColor: string;
}

interface PlatformSummaryProps {
  platforms: PlatformSummaryItem[];
  title?: string;
  timeframe?: string;
}

export function PlatformSummary({
  platforms,
  title = "Platform Summary",
  timeframe = "This Month",
}: PlatformSummaryProps) {
  return (
    <Card className="w-full max-w-sm bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-5 space-y-4">
      <CardHeader className="flex flex-row items-center justify-between p-0 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        <span className="text-sm text-gray-400 font-medium">{timeframe}</span>
      </CardHeader>

      <CardContent className="p-0 space-y-3.5 pt-2">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className="flex items-center justify-between text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${platform.dotColor} shrink-0`}
              />
              <span className="text-gray-700 font-medium">{platform.name}</span>
            </div>

            <span className="text-sm font-semibold text-gray-900">
              {platform.postCount} posts
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
