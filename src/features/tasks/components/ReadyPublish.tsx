import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import toast from "react-hot-toast";
import { ModalPreviewPublish, type PreviewPublishItem } from "@/features/tasks/components/ModalPreviewPublish";

export interface PublishItem {
  id: string | number;
  title: string;
  iconName: LucideIcon;
  iconBg: string;
  category: string;
  categoryBg: string;
  categoryDot: string;
  postDate: string;
  status: string;
  statusBg: string;
  statusDot: string;
}

interface ReadyPublishProps {
  items: PublishItem[];
  title?: string;
  onScheduleNew?: () => void;
  onRowSchedule?: (item: PublishItem) => void;
}

export function ReadyPublish({
  items,
  title = "Ready to Publish",
  onScheduleNew,
  onRowSchedule,
}: ReadyPublishProps) {
  const [localItems, setLocalItems] = useState<PublishItem[]>(() => items);
  const [prevItems, setPrevItems] = useState(items);

  if (items !== prevItems) {
    setPrevItems(items);
    setLocalItems(items);
  }

  if (onScheduleNew) {
    // Deprecated: Schedule New button has been removed from the header
  }

  // Publish modal states & actions
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [itemToPublish, setItemToPublish] = useState<PublishItem | null>(null);

  const handleOpenPublishModal = (item: PublishItem) => {
    setItemToPublish(item);
    setIsPublishModalOpen(true);
  };

  const handlePublishConfirm = (
    previewItem: PreviewPublishItem,
    date?: string,
    time?: string,
  ) => {
    if (date) {
      // date is not needed for daily updates
    }
    setLocalItems((prev) =>
      prev.map((it) => {
        if (it.id === previewItem.id) {
          return {
            ...it,
            status: "Published",
            statusBg: "bg-emerald-500/20 text-emerald-600 hover:bg-emerald-600/20",
            statusDot: "bg-emerald-600",
            postDate: time ? `${it.postDate.split(" • ")[0]} • ${time}` : it.postDate,
          };
        }
        return it;
      }),
    );
    setIsPublishModalOpen(false);
    setItemToPublish(null);
    toast.success("Konten berhasil dipublikasikan!");

    const foundItem = localItems.find((it) => it.id === previewItem.id);
    if (foundItem) {
      onRowSchedule?.({
        ...foundItem,
        status: "Published",
      });
    }
  };

  return (
    <Card className="w-full max-h-110 flex flex-col bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg p-6 gap-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 space-y-0 shrink-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-3 flex-1 overflow-y-auto">
        {localItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-4 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/30 h-full min-h-55">
            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm mb-4 text-gray-400">
              <FileText className="h-6 w-6 stroke-[1.5] text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base mb-1.5">
              Belum Ada Konten Siap Publish
            </h3>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Kosong untuk saat ini. Konten siap publikasi akan muncul nanti
            </p>
          </div>
        ) : (
          localItems.map((item) => {
            const SelectedIcon = item.iconName;

            return (
              <div
                key={item.id}
                className="w-full border border-gray-300/80 bg-gray-50/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-gray-50/40"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div
                    className={`h-12 w-12 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <SelectedIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-3 flex-wrap text-xs">
                      <Badge
                        className={`${item.categoryBg} rounded-lg font-medium px-2 py-0.5 border-none shadow-none flex items-center gap-1.5`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${item.categoryDot}`}
                        />
                        {item.category}
                      </Badge>
                      <span className="text-gray-400 font-medium">
                        {item.postDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <Badge
                    className={`${item.statusBg} rounded-lg font-bold px-3 py-1 text-xs border-none shadow-none flex items-center gap-1.5`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${item.statusDot}`}
                    />
                    {item.status}
                  </Badge>

                  {item.status === "Scheduled" && (
                    <Button
                      size="sm"
                      onClick={() => handleOpenPublishModal(item)}
                      className="bg-red-700 hover:bg-red-logo text-white font-semibold rounded-sm px-3 h-8 text-xs flex items-center gap-1.5 border-none cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5 rotate-45" />
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>

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
                platform: "Instagram",
                platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
                postDate: itemToPublish.postDate,
                time: "09:00",
              }
            : null
        }
        onPublish={handlePublishConfirm}
        mode="publish"
      />
    </Card>
  );
}
