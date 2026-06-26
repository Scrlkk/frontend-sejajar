import type { ReactNode } from "react";
import { Eye, Heart, Share2, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PerformingContentItem {
  id: string | number;
  rank: number;
  rankColor: string;
  title: string;
  platform: string;
  platformBg: string;
  views: number;
  likes: number;
  shares: number;
  period?: "all" | "month";
}

interface PerformingContentProps {
  items: PerformingContentItem[];
  title?: string;
  headerAction?: ReactNode;
  maxItems?: number;
}

export function PerformingContent({
  items = [],
  title = "Top Performing Content",
  headerAction,
  maxItems = 5,
}: PerformingContentProps) {
  const displayedItems = items.slice(0, maxItems);

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        {headerAction}
      </CardHeader>

      <CardContent className="p-0 divide-y divide-gray-100/60">
        {displayedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-gray-400" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900">
              Belum ada konten terbaik
            </h4>
            <p className="text-xs text-gray-500 mt-1.5 max-w-65 leading-relaxed">
              Statistik performa konten Anda akan tampil di sini setelah data engagement ditambahkan.
            </p>
          </div>
        ) : (
          displayedItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0 last:pb-0 gap-4"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <span
                  className={`text-base md:text-lg font-bold min-w-8 pt-0.5 ${item.rankColor}`}
                >
                  #{item.rank}
                </span>

                <div className="space-y-1.5 min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                    {item.title}
                  </h4>
                  <Badge
                    variant="outline"
                    className={`${item.platformBg} rounded-lg font-medium px-2 py-0.5 text-xs bg-none border-gray-300 shadow-none w-fit`}
                  >
                    {item.platform}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-5 text-xs md:text-sm font-bold shrink-0 self-end sm:self-center">
                <div className="flex items-center gap-1.5 text-red-700/90">
                  <Eye className="h-4 w-4 stroke-[2.5]" />
                  <span>{item.views.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1.5 text-pink-600">
                  <Heart className="h-4 w-4 stroke-[2.5]" />
                  <span>{item.likes.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1.5 text-emerald-600">
                  <Share2 className="h-4 w-4 stroke-[2.5]" />
                  <span>{item.shares.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
