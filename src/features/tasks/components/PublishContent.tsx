import { useState } from "react";
import {
  Send,
  Search,
  AlertCircle,
  PenLine,
  Eye,
  Hash,
  Video,
  Image as ImageIcon,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "@/features/pillars/components/PlatformBadge";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";
import { StatusBadgeContent } from "@/features/pillars/components/StatusBadgeContent";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import {
  ModalPreviewPublish,
  type PreviewPublishItem,
} from "@/features/tasks/components/ModalPreviewPublish";
import type { ContentPillar } from "@/features/contents/api/contentsApi";

export interface QueueItem {
  id: string | number;
  title: string;
  type?: "video" | "image";
  platform: "TikTok" | "Instagram" | "YouTube" | string;
  platformColorKey?: string | null;
  platformBg: string;
  category: string;
  pillars?: ContentPillar[];
  categoryBg: string;
  dateText: string;
  status:
    | "Draft"
    | "Scheduled"
    | "Approved"
    | "Revision"
    | "Waiting Approval"
    | "Pending"
    | "Published"
    | "On Progress";
  caption?: string;
  hashtag?: string;
  isPublishable: boolean;
  isOverdue?: boolean;
  assigneeName?: string;
  publisher_name?: string;
  content_id?: number;
  content_url?: string;
  file_url?: string;
}

interface PublishContentProps {
  items: QueueItem[];
  onPublish?: (
    item: QueueItem,
    date?: string,
    time?: string,
    hashtags?: string,
  ) => void;
  onCaption?: (item: QueueItem) => void;
  onRemove?: (id: string | number) => void;
  onCaptionClick?: () => void;
  onOpenCaptionDrawer?: (item: QueueItem) => void;
  canPublish?: boolean;
}

export function PublishContent({
  items,
  onPublish,
  onCaption,
  onCaptionClick,
  onOpenCaptionDrawer,
  canPublish = true,
}: PublishContentProps) {
  const [localItems, setLocalItems] = useState<QueueItem[]>(() => items);
  const [prevItems, setPrevItems] = useState(items);

  if (items !== prevItems) {
    setPrevItems(items);
    setLocalItems(items);
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleStartEdit = (item: QueueItem) => {
    const isReadOnly = ["approved", "scheduled", "published"].includes(
      item.status.toLowerCase(),
    );
    if (isReadOnly) return;
    setEditingId(item.id);
    setEditingText(item.caption || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleSaveEdit = (id: string | number) => {
    const originalItem = localItems.find((it) => it.id === id);
    if (!originalItem) return;

    const newCaption = editingText.trim() || undefined;
    const isPublishable =
      (originalItem.status === "Scheduled" ||
        originalItem.status === "Approved") &&
      !!newCaption;

    const updatedItem = {
      ...originalItem,
      caption: newCaption,
      isPublishable: isPublishable,
    };

    // Trigger side effect outside the state updater
    onCaption?.(updatedItem);

    setLocalItems((prev) =>
      prev.map((it) => (it.id === id ? updatedItem : it)),
    );
    setEditingId(null);
    setEditingText("");
    toast.success("Caption berhasil disimpan!");
  };

  // Publish preview modal states
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [itemToPublish, setItemToPublish] = useState<QueueItem | null>(null);
  const [publishModalMode, setPublishModalMode] = useState<
    "preview" | "publish"
  >("publish");

  const handleOpenPublishModal = (
    item: QueueItem,
    mode: "preview" | "publish" = "publish",
  ) => {
    setItemToPublish(item);
    setPublishModalMode(mode);
    setIsPublishModalOpen(true);
  };

  const handlePublishConfirm = (
    previewItem: PreviewPublishItem,
    date?: string,
    time?: string,
    hashtags?: string,
  ) => {
    const originalItem = localItems.find((it) => it.id === previewItem.id);
    if (!originalItem) return;

    const formattedDateText =
      date && time ? `${date} • ${time}` : originalItem.dateText;
    const updatedCaption = hashtags
      ? `${originalItem.caption || ""} ${hashtags}`.trim()
      : originalItem.caption;

    const isScheduling = originalItem.status === "Approved";
    const nextStatus = isScheduling ? "Scheduled" : "Published";

    const updated: QueueItem = {
      ...originalItem,
      status: nextStatus,
      dateText: formattedDateText,
      caption: updatedCaption,
      isPublishable: isScheduling,
    };
    onPublish?.(updated, date, time, hashtags);
    setLocalItems((prev) =>
      prev.map((it) => (it.id === originalItem.id ? updated : it)),
    );
    setIsPublishModalOpen(false);
    setItemToPublish(null);
    toast.success(
      isScheduling
        ? "Konten berhasil dijadwalkan!"
        : "Konten berhasil dipublikasikan!",
    );
  };

  const onProgressCount = localItems.filter(
    (i) => i.status === "On Progress" || i.status === "Draft",
  ).length;
  const readyToPublishCount = localItems.filter(
    (i) => i.status === "Approved",
  ).length;
  const scheduledCount = localItems.filter(
    (i) => i.status === "Scheduled",
  ).length;
  const pendingCount = localItems.filter(
    (i) => i.status === "Pending" || i.status === "Waiting Approval",
  ).length;
  const revisionCount = localItems.filter(
    (i) => i.status === "Revision",
  ).length;
  const publishedCount = localItems.filter(
    (i) => i.status === "Published",
  ).length;

  const filteredItems = localItems.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeTab === "on_progress")
      return (
        matchesSearch &&
        (item.status === "On Progress" || item.status === "Draft")
      );
    if (activeTab === "ready_to_publish")
      return matchesSearch && item.status === "Approved";
    if (activeTab === "scheduled")
      return matchesSearch && item.status === "Scheduled";
    if (activeTab === "waiting-approval" || activeTab === "pending")
      return (
        matchesSearch &&
        (item.status === "Pending" || item.status === "Waiting Approval")
      );
    if (activeTab === "revision")
      return matchesSearch && item.status === "Revision";
    if (activeTab === "published")
      return matchesSearch && item.status === "Published";

    return matchesSearch;
  });

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg">
      <div className="flex flex-col gap-3 p-4 border-b border-gray-100">
        {/* Row 2: Search + Caption Button */}
        <div className="flex items-center gap-3 justify-end">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search queue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800/60 transition-colors"
            />
          </div>
          <Button
            onClick={onCaptionClick}
            className="bg-red-800 hover:bg-red-900 text-white rounded-xl px-4 py-2 font-bold text-xs md:text-sm h-10 flex items-center gap-2 border-none shadow-none shrink-0 cursor-pointer"
          >
            <Hash className="h-4 w-4 stroke-[2.5]" />
            Caption
          </Button>
        </div>

        {/* Row 1: Filter Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="inline-flex"
        >
          <TabsList className="bg-gray-100 p-1.5 rounded-xl h-10 gap-1 flex flex-wrap">
            <TabsTrigger
              value="all"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              All ({localItems.length})
            </TabsTrigger>
            <TabsTrigger
              value="on_progress"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              On Progress ({onProgressCount})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Review ({pendingCount})
            </TabsTrigger>
            <TabsTrigger
              value="ready_to_publish"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Ready to Publish ({readyToPublishCount})
            </TabsTrigger>
            <TabsTrigger
              value="scheduled"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Scheduled ({scheduledCount})
            </TabsTrigger>
            <TabsTrigger
              value="published"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Published ({publishedCount})
            </TabsTrigger>
            <TabsTrigger
              value="revision"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Revision ({revisionCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="divide-y divide-gray-300">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
                item.isOverdue && item.status !== "Published"
                  ? "bg-red-50/10 hover:bg-red-50/20"
                  : "hover:bg-gray-50/30"
              }`}
            >
              <div className="flex items-start gap-4 flex-1 min-w-0 w-full">
                <div className="h-20 w-20 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 relative shadow-sm border border-gray-300">
                  {item.type === "video" ? (
                    <Video className="h-6 w-6 text-violet-400" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-sky-400" />
                  )}
                </div>

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2">
                    <h3 className="font-bold text-gray-900 text-base truncate">
                      {item.title}
                    </h3>
                    <StatusBadgeContent
                      status={item.status}
                      className="text-[10px]"
                    />
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                    <span
                      className={`${item.isOverdue && item.status !== "Published" ? "text-red-500 font-semibold" : ""}`}
                    >
                      {item.dateText}
                    </span>

                    <PlatformBadge
                      platform={item.platform}
                      colorKey={item.platformColorKey}
                      className="text-[10px]"
                    />
                     {item.pillars && item.pillars.length > 0 ? (
                       <>
                         {item.pillars.slice(0, 2).map((p) => (
                           <PillarsCard
                             key={p.id}
                             category={p.pillar_name}
                             categoryId={p.id}
                             colorKey={p.color_key}
                             className="text-[10px]"
                           />
                         ))}
                         {item.pillars.length > 2 && (
                           <span
                             title={item.pillars.slice(2).map((p) => p.pillar_name).join(", ")}
                             className="rounded-lg px-2 py-0.5 text-[10px] font-semibold border bg-gray-50 text-gray-500 border-gray-200/60 shadow-none shrink-0 cursor-help"
                           >
                             + {item.pillars.length - 2} more
                           </span>
                         )}
                       </>
                     ) : (
                       <PillarsCard
                         category={item.category}
                         className="text-[10px]"
                       />
                     )}

                    {!item.caption && (
                      <span className="text-red-500 font-semibold flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> No caption
                      </span>
                    )}
                  </div>

                  {(() => {
                    const isReadOnly = [
                      "approved",
                      "scheduled",
                      "published",
                    ].includes(item.status.toLowerCase());

                    if (editingId === item.id) {
                      return (
                        <div className="w-full space-y-2">
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            placeholder="Write a caption..."
                            rows={3}
                            autoFocus
                            className="w-full p-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-colors resize-none"
                          />
                          <div className="flex items-center gap-2 justify-start">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(item.id)}
                              className="h-8 text-xs font-semibold rounded-lg px-3 bg-red-800 hover:bg-red-logo text-white shadow-none border-none cursor-pointer"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="h-8 text-xs font-semibold rounded-lg px-3 hover:bg-gray-50 shadow-none border-gray-250 cursor-pointer"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      );
                    }

                    if (isReadOnly) {
                      return item.caption ? (
                        <div className="w-full bg-slate-50/50 border border-gray-200 rounded-xl p-3 text-sm text-gray-500 font-normal select-none">
                          <p className="w-full text-sm text-gray-650 font-normal line-clamp-2">
                            {item.caption}
                          </p>
                        </div>
                      ) : (
                        <div className="w-full border border-dashed border-gray-200 rounded-xl p-3 text-xs text-gray-400 font-normal select-none">
                          Belum ada caption
                        </div>
                      );
                    }

                    return item.caption ? (
                      <div
                        onClick={() => handleStartEdit(item)}
                        className="w-full bg-gray-50/70 border border-gray-300 rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <p className="w-full text-sm text-gray-600 font-normal line-clamp-2">
                          {item.caption}
                        </p>
                      </div>
                    ) : (
                      <div
                        onClick={() => handleStartEdit(item)}
                        className="w-full border border-dashed border-gray-300 rounded-xl p-3 text-xs text-gray-400 font-normal cursor-pointer hover:bg-gray-50/50 transition-colors"
                      >
                        + Add caption...
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center justify-end md:items-stretch gap-2 w-full md:w-28 shrink-0 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                {item.status === "Published" ? (
                  <>
                    <Button
                      size="sm"
                      disabled
                      className="h-9 text-xs font-semibold rounded-lg gap-1.5 justify-center md:w-full border-none shadow-none bg-emerald-50 text-emerald-600 cursor-not-allowed"
                    >
                      Published
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenPublishModal(item, "preview")}
                      className="h-9 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl gap-1.5 justify-center md:w-full cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Button>
                  </>
                ) : (
                  <>
                    {item.status === "Scheduled" ? (
                      <Button
                        size="sm"
                        disabled={!item.isPublishable}
                        onClick={() => handleOpenPublishModal(item, "preview")}
                        className={`h-9 text-xs font-semibold rounded-lg gap-1.5 justify-center md:w-full border-none shadow-none transition-colors cursor-pointer ${
                          item.isPublishable
                            ? "bg-red-800 hover:bg-red-logo text-white"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <Send className="h-3.5 w-3.5" />
                        Publish
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled={!item.isPublishable}
                        onClick={() => handleOpenPublishModal(item, "publish")}
                        className={`h-9 text-xs font-semibold rounded-lg gap-1.5 justify-center md:w-full border-none shadow-none transition-colors cursor-pointer ${
                          item.isPublishable
                            ? "bg-red-800 hover:bg-red-logo text-white"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        Schedule
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onOpenCaptionDrawer?.(item)}
                      className="h-9 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl gap-1.5 justify-center md:w-full cursor-pointer"
                    >
                      <PenLine className="h-3.5 w-3.5" />
                      Drawer
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-gray-200 bg-slate-50/10 rounded-b-xl">
            <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center border border-red-100 text-red-800 shadow-sm mb-4">
              <Send className="h-6 w-6 stroke-[1.5] rotate-45" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1">
              Publish Queue Empty
            </h4>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              There are no contents scheduled or ready to publish. You can
              assign or select captions to start drafting.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50/40 rounded-b-xl border-t border-gray-100">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-gray-400 mb-3 border border-gray-200">
              <Search className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-gray-800">
              No matching publish items
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Try adjusting your search query or switching status tabs.
            </p>
          </div>
        )}
      </div>

      <ModalPreviewPublish
        key={itemToPublish?.id ?? "publish-closed"}
        isOpen={isPublishModalOpen}
        onClose={() => {
          setIsPublishModalOpen(false);
          setItemToPublish(null);
        }}
        item={
          itemToPublish
            ? {
                id: itemToPublish.id,
                title: itemToPublish.title,
                platform: itemToPublish.platform,
                platformBg: itemToPublish.platformBg,
                postDate:
                  itemToPublish.dateText.split(" • ")[0] ||
                  itemToPublish.dateText,
                time: itemToPublish.dateText.split(" • ")[1] || "",
                file_url: itemToPublish.file_url,
                type: itemToPublish.type,
                caption: itemToPublish.caption,
                hashtag: itemToPublish.hashtag,
                status: itemToPublish.status,
                publisher_name: itemToPublish.publisher_name || itemToPublish.assigneeName,
                content_id: itemToPublish.content_id,
                content_url: itemToPublish.content_url,
              }
            : null
        }
        onPublish={handlePublishConfirm}
        mode={publishModalMode}
        canPublish={canPublish}
      />
    </div>
  );
}
