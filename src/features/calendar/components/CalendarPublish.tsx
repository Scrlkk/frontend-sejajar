import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PackageOpen } from "lucide-react";

export interface MiniPublishItem {
  id: string | number;
  title: string;
  dateText: string;
}

interface CalendarPublishProps {
  title?: string;
  items: MiniPublishItem[];
  onPublishClick?: (item: MiniPublishItem) => void;
}

export function CalendarPublish({
  title = "Ready to Publish",
  items,
  onPublishClick,
}: CalendarPublishProps) {
  return (
    <Card className="w-full max-w-sm bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-5 space-y-4">
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
              <PackageOpen className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">
              No content ready
            </p>
            <p className="text-xs text-gray-400/80 mt-1">
              There are no posts ready to be published yet.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="w-full bg-emerald-50/20 border border-emerald-500/20 rounded-2xl p-4 space-y-3"
            >
              <h4 className="font-bold text-gray-900 text-sm md:text-base leading-snug truncate">
                {item.title}
              </h4>

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs md:text-sm font-medium text-gray-400">
                  {item.dateText}
                </span>

                <Button
                  size="sm"
                  onClick={() => onPublishClick?.(item)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs h-8 px-4 border-none shadow-none"
                >
                  Publish
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
