import { useState } from "react";
import {
  Play,
  Send,
  FileText,
  Trash2,
  Search,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface QueueItem {
  id: string | number;
  title: string;
  platform: "TikTok" | "Instagram" | "YouTube" | string;
  platformBg: string;
  category: string;
  categoryBg: string;
  dateText: string;
  status: "Draft" | "Schedule" | "Revision" | "Waiting Approval";
  caption?: string;
  isPublishable: boolean;
}

interface PublishContentProps {
  items: QueueItem[];
  onPublish?: (item: QueueItem) => void;
  onCaption?: (item: QueueItem) => void;
  onRemove?: (id: string | number) => void;
}

export function PublishContent({
  items,
  onPublish,
  onCaption,
  onRemove,
}: PublishContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const draftCount = items.filter((i) => i.status === "Draft").length;
  const scheduledCount = items.filter((i) => i.status === "Schedule").length;
  const waitingApprovalCount = items.filter(
    (i) => i.status === "Waiting Approval",
  ).length;
  const revisionCount = items.filter((i) => i.status === "Revision").length;

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeTab === "draft") return matchesSearch && item.status === "Draft";
    if (activeTab === "scheduled")
      return matchesSearch && item.status === "Schedule";
    if (activeTab === "waiting-approval")
      return matchesSearch && item.status === "Waiting Approval";
    if (activeTab === "revision")
      return matchesSearch && item.status === "Revision";

    return matchesSearch;
  });

  const statusBadgeStyle = (status: QueueItem["status"]) => {
    switch (status) {
      case "Schedule":
        return {
          bg: "bg-blue-100 text-blue-600 hover:bg-blue-100",
          dot: "bg-blue-500",
        };
      case "Waiting Approval":
        return {
          bg: "bg-amber-100 text-amber-600 hover:bg-amber-100",
          dot: "bg-amber-500",
        };
      case "Revision":
        return {
          bg: "bg-red-100 text-red-600 hover:bg-red-100",
          dot: "bg-red-500",
        };
      default:
        return {
          bg: "bg-gray-200 text-gray-500 hover:bg-gray-200",
          dot: "bg-gray-400",
        };
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-b border-gray-100">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-gray-100 p-2 rounded-xl h-10 gap-1">
            <TabsTrigger
              value="all"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              All ({items.length})
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Draft ({draftCount})
            </TabsTrigger>

            <TabsTrigger
              value="scheduled"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Ready to Publish ({scheduledCount})
            </TabsTrigger>
            <TabsTrigger
              value="waiting-approval"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Waiting Approval ({waitingApprovalCount})
            </TabsTrigger>
            <TabsTrigger
              value="revision"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Revision ({revisionCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search queue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800/60 transition-colors"
          />
        </div>
      </div>

      <div className="divide-y divide-gray-300">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0 w-full">
                <div className="h-20 w-20 bg-[#252f41] rounded-xl flex items-center justify-center shrink-0 relative shadow-sm group cursor-pointer">
                  <Play className="h-5 w-5 text-white fill-white transition-transform group-hover:scale-110" />
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2">
                    <h3 className="font-bold text-gray-900 text-base truncate">
                      {item.title}
                    </h3>
                    <Badge
                      className={`${item.platformBg} text-[10px] font-bold px-2 py-0.5 rounded-md border-none shadow-none`}
                    >
                      {item.platform}
                    </Badge>
                    <Badge
                      className={`${item.categoryBg} text-[10px] font-medium px-2 py-0.5 rounded-md border-none shadow-none`}
                    >
                      {item.category}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {item.dateText}
                    </span>
                    <Badge
                      className={`${statusBadgeStyle(item.status).bg} rounded-lg font-semibold text-[10px] px-2 py-0.5 border-none shadow-none flex items-center gap-1.5`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusBadgeStyle(item.status).dot}`}
                      />
                      {item.status}
                    </Badge>

                    {!item.caption && (
                      <span className="text-red-500 font-semibold flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> No caption
                      </span>
                    )}
                  </div>

                  {item.caption ? (
                    <div className="w-full bg-gray-50/70 border border-gray-300 rounded-xl p-3">
                      <p className="w-full text-sm text-gray-600 font-normal line-clamp-2">
                        {item.caption}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full border border-dashed border-gray-300 rounded-xl p-3 text-xs text-gray-400 font-normal cursor-pointer hover:bg-gray-50/50 transition-colors">
                      + Add caption...
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center justify-end md:items-stretch gap-2 w-full md:w-28 shrink-0 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                <Button
                  size="sm"
                  disabled={!item.isPublishable}
                  onClick={() => onPublish?.(item)}
                  className={`h-9 text-xs font-semibold rounded-lg gap-1.5 justify-center md:w-full border-none shadow-none transition-colors ${
                    item.isPublishable
                      ? "bg-red-800 hover:bg-red-logo text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="h-3.5 w-3.5 rotate-45" />
                  Publish
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCaption?.(item)}
                  className="h-9 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl gap-1.5 justify-center md:w-full"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Caption
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove?.(item.id)}
                  className="h-9 text-xs font-medium text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl gap-1.5 justify-center md:w-full"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">
            No items inside this queue matching search filter.
          </div>
        )}
      </div>
    </div>
  );
}
