import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Eye, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "@/features/pillars/components/PlatformBadge";
import { StatusBadgeContent } from "@/features/pillars/components/StatusBadgeContent";
import toast from "react-hot-toast";
import {
  ModalPreviewPublish,
  type PreviewPublishItem,
} from "@/features/tasks/components/ModalPreviewPublish";
import { getTasksApi, updateTaskApi, getTaskByIdApi, type Task } from "@/features/tasks/api/tasksApi";
import { getTaskOutputsApi, createTaskOutputApi, type TaskOutput } from "@/features/tasks/api/taskOutputsApi";
import { useAuth } from "@/hooks/useAuth";
import { getTaskTypeConfig } from "@/features/tasks/constants/typeConfig";
import { publishContentApi, updateContentApi, getContentByIdApi } from "@/features/contents/api/contentsApi";

export interface ScheduleItem {
  id: string | number;
  time: string;
  title: string;
  platform: string;
  platformColorKey?: string | null;
  status: "Scheduled" | "Published" | string;
  hasPublishButton: boolean;
  type?: string;
  caption?: string;
  hashtag?: string;
  postDate?: string;
  postDateRaw?: string;
  file_url?: string;
  publisher_name?: string;
}

interface PostScheduleProps {
  schedules: ScheduleItem[];
  title?: string;
  dateText?: string;
  onPreview?: (item: ScheduleItem) => void;
  onPublish?: (item: ScheduleItem) => void;
}

export function PostSchedule({
  schedules,
  title = "Posting Schedule",
  dateText = "",
  onPreview,
  onPublish,
}: PostScheduleProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<ScheduleItem[]>(() => schedules);
  const [prevSchedules, setPrevSchedules] = useState(schedules);

  if (schedules !== prevSchedules) {
    setPrevSchedules(schedules);
    setItems(schedules);
  }

  // Preview modal states & actions
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [itemToPreview, setItemToPreview] = useState<PreviewPublishItem | null>(null);
  const [modalMode, setModalMode] = useState<"preview" | "publish">("preview");
  const [prefetchedDetails, setPrefetchedDetails] = useState<
    Record<string | number, PreviewPublishItem>
  >({});

  const handlePrefetch = async (item: ScheduleItem) => {
    const key = item.id;
    if (prefetchedDetails[key]) return;
    try {
      const detailedItem = await loadDetails(item);
      setPrefetchedDetails((prev) => ({
        ...prev,
        [key]: detailedItem,
      }));
    } catch (err) {
      console.error("Prefetch error:", err);
    }
  };

  const isMediaFile = (url?: string | null) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (
      lower.endsWith(".mp4") ||
      lower.endsWith(".mov") ||
      lower.endsWith(".webm") ||
      lower.endsWith(".avi") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".png") ||
      lower.endsWith(".webp") ||
      lower.endsWith(".gif")
    );
  };

  const loadDetails = async (
    item: ScheduleItem,
  ): Promise<PreviewPublishItem> => {
    try {
      const idStr = item.id.toString();
      const isContent = idStr.startsWith("c_");
      const dbId = Number(idStr.replace(/^[ct]_/, ""));

      let taskId = 0;
      let contentId = 0;
      let tasksList: Task[] = [];

      if (isContent) {
        contentId = dbId;
        tasksList = await getTasksApi({ content_id: contentId, limit: 100 });
        if (tasksList.length > 0) {
          const myTask = tasksList.find(
            (t) => Number(t.assigned_to) === Number(user?.id),
          );
          taskId = myTask ? myTask.id : tasksList[0].id;
        }
      } else {
        taskId = dbId;
        const list = await getTasksApi({ limit: 1000 });
        const taskDetail = list.find((t) => t.id === taskId);
        if (taskDetail?.content_id) {
          contentId = taskDetail.content_id;
          tasksList = await getTasksApi({ content_id: contentId, limit: 100 });
        }
      }

      // Fetch all outputs for all tasks in parallel
      const tasksToFetch: Partial<Task>[] =
        tasksList.length > 0 ? tasksList : taskId > 0 ? [{ id: taskId }] : [];
      const allOutputsRes = await Promise.all(
        tasksToFetch.map(async (t) => {
          try {
            const outputs = await getTaskOutputsApi(t.id!);
            return outputs.map((o) => ({ ...o, task: t }));
          } catch {
            return [];
          }
        }),
      );
      const outputsFlat = allOutputsRes.flat();

      // Find caption: prefer selected task, fallback to any task in content
      const mainTaskOutputs = outputsFlat.filter((o) => o.task.id === taskId);
      const mainCaptionOut = mainTaskOutputs.find((o) => !!o.caption);
      let caption = mainCaptionOut?.caption || "";

      if (!caption && contentId > 0) {
        const anyCaptionOut = outputsFlat.find((o) => !!o.caption);
        if (anyCaptionOut) {
          caption = anyCaptionOut.caption || "";
        }
      }

      // Find hashtag: prefer selected task, fallback to any task in content
      const mainHashtagOut = mainTaskOutputs.find((o) => !!o.hashtag);
      let hashtag = mainHashtagOut?.hashtag || "";

      if (!hashtag && contentId > 0) {
        const anyHashtagOut = outputsFlat.find((o) => !!o.hashtag);
        if (anyHashtagOut) {
          hashtag = anyHashtagOut.hashtag || "";
        }
      }

      // Find file URL: prefer non-script media outputs
      const mediaOutputs = outputsFlat.filter(
        (o) => !!o.file_url && isMediaFile(o.file_url),
      );
      const nonScriptMediaOutputs = mediaOutputs.filter((o) => {
        const role = o.task?.assignee_roles?.[0] ?? "content_editor";
        return getTaskTypeConfig(role).label !== "Script";
      });

      const candidates =
        nonScriptMediaOutputs.length > 0 ? nonScriptMediaOutputs : mediaOutputs;
      let mediaOut = candidates[0];

      // If content format is video, prioritize video file types
      const isVideoFormat = tasksList.some(
        (t) => t.content_format?.toLowerCase() === "video",
      );
      if (isVideoFormat && candidates.length > 0) {
        const videoOut = candidates.find((o) => {
          const lower = o.file_url?.toLowerCase() ?? "";
          return (
            lower.endsWith(".mp4") ||
            lower.endsWith(".mov") ||
            lower.endsWith(".webm") ||
            lower.endsWith(".avi")
          );
        });
        if (videoOut) {
          mediaOut = videoOut;
        }
      }

      const fileUrl = mediaOut?.file_url || "";
      const isVideo =
        fileUrl.toLowerCase().endsWith(".mp4") ||
        fileUrl.toLowerCase().endsWith(".mov") ||
        fileUrl.toLowerCase().endsWith(".webm") ||
        fileUrl.toLowerCase().endsWith(".avi");

      let contentUrl = "";
      if (contentId > 0) {
        try {
          const contentDetail = await getContentByIdApi(contentId);
          contentUrl = contentDetail.content_url || "";
        } catch (err) {
          console.error("Failed to load content detail:", err);
        }
      }

      const publisherTask = tasksList.find((t) =>
        t.assignee_roles?.includes("admin_social_media"),
      );
      const publisherName = publisherTask?.assignee_name || "";

      return {
        ...item,
        caption: caption || undefined,
        hashtag: hashtag || undefined,
        file_url: fileUrl || undefined,
        type: fileUrl ? (isVideo ? "video" : "image") : undefined,
        content_url: contentUrl || undefined,
        content_id: contentId || undefined,
        publisher_name: publisherName || undefined,
      };
    } catch (err) {
      console.error("Failed to load preview details:", err);
      return item;
    }
  };

  const openPreviewModal = async (item: ScheduleItem) => {
    const key = item.id;
    let detailedItem = prefetchedDetails[key];
    if (!detailedItem) {
      detailedItem = await loadDetails(item);
      setPrefetchedDetails((prev) => ({
        ...prev,
        [key]: detailedItem,
      }));
    }
    setItemToPreview(detailedItem);
    setModalMode("preview");
    // Open in next tick to allow any click triggers to complete cleanly
    setTimeout(() => {
      setIsPreviewModalOpen(true);
    }, 100);
    onPreview?.(item);
  };

  const openPublishModal = async (item: ScheduleItem) => {
    const key = item.id;
    let detailedItem = prefetchedDetails[key];
    if (!detailedItem) {
      detailedItem = await loadDetails(item);
      setPrefetchedDetails((prev) => ({
        ...prev,
        [key]: detailedItem,
      }));
    }
    setItemToPreview(detailedItem);
    const mode = item.status === "Approved" ? "publish" : "preview";
    setModalMode(mode);
    setTimeout(() => {
      setIsPreviewModalOpen(true);
    }, 100);
  };

  const handlePublish = async (
    item: PreviewPublishItem,
    date?: string,
    time?: string,
    hashtags?: string,
  ) => {
    const idStr = item.id.toString();
    const isContent = idStr.startsWith("c_");
    const dbId = Number(idStr.replace(/^[ct]_/, ""));

    const isScheduling = item.status === "Approved";

    let taskId = 0;
    let contentId: number;

    try {
      if (isContent) {
        contentId = dbId;
        const tasksList = await getTasksApi({ content_id: contentId, limit: 100 });
        if (tasksList.length > 0) {
          const myTask = tasksList.find((t) => Number(t.assigned_to) === Number(user?.id));
          taskId = myTask ? myTask.id : tasksList[0].id;
        }
      } else {
        taskId = dbId;
        const taskDetail = await getTaskByIdApi(taskId);
        contentId = taskDetail.content_id;
      }

      if (isScheduling) {
        const scheduledDateTime = date && time ? `${date}T${time}` : undefined;
        await updateContentApi(contentId, {
          status: "scheduled",
          scheduled_at: scheduledDateTime,
        });

        if (taskId > 0 && scheduledDateTime) {
          await updateTaskApi(taskId, {
            deadline: `${scheduledDateTime}:00`,
          });
        }

        if (hashtags && taskId > 0) {
          let allOutputs: TaskOutput[] = [];
          try {
            allOutputs = await getTaskOutputsApi(taskId);
          } catch {
            // ignore
          }
          const rawCaption = allOutputs[0]?.caption || "";
          const newCaption = `${rawCaption} ${hashtags}`.trim();

          const formData = new FormData();
          formData.append("task_id", String(taskId));
          formData.append("caption", newCaption);
          formData.append("hashtag", hashtags);
          await createTaskOutputApi(formData);
        }
      } else {
        await publishContentApi(contentId);
      }
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["staffSummary"] });
    } catch (err) {
      console.error("Failed to publish content:", err);
      toast.error("Gagal memproses publikasi konten.");
      return;
    }

    setItems((prev) =>
      prev.map((it) => {
        if (it.id === item.id) {
          return {
            ...it,
            status: isScheduling ? "Scheduled" : "Published",
            time: time || it.time,
            hasPublishButton: isScheduling,
          };
        }
        return it;
      }),
    );
    setIsPreviewModalOpen(false);
    toast.success(isScheduling ? "Konten berhasil dijadwalkan!" : "Konten berhasil dipublikasikan!");

    const foundItem = schedules.find((it) => it.id === item.id);
    if (foundItem) {
      onPublish?.({
        ...foundItem,
        status: isScheduling ? "Scheduled" : "Published",
        time: time || foundItem.time,
        hasPublishButton: isScheduling,
      });
    }
  };

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        <span className="text-sm text-gray-400 font-medium">{dateText}</span>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-gray-100/70">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-4 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm mb-4 text-gray-400">
              <Calendar className="h-6 w-6 stroke-[1.5] text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 text-base mb-1.5">
              Belum Ada Jadwal Postingan
            </h3>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Jadwal konten yang akan dipublikasikan hari ini akan ditampilkan
              di sini.
            </p>
          </div>
        ) : (
          items.map((item) => {
            const isPublished = item.status === "Published";
            const borderColor = isPublished
              ? "border-emerald-600"
              : "border-blue-600";

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0 last:pb-0 gap-4"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <span className="text-base font-bold text-gray-900 min-w-12.5 pt-0.5">
                    {item.time}
                  </span>

                  <div
                    className={`border-l-2 ${borderColor} pl-4 space-y-1.5 min-w-0 flex-1`}
                  >
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <PlatformBadge
                        platform={item.platform}
                        colorKey={item.platformColorKey}
                        className="text-xs"
                      />

                      <StatusBadgeContent
                        status={item.status}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {isPublished ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPreviewModal(item)}
                      onMouseEnter={() => handlePrefetch(item)}
                      onFocus={() => handlePrefetch(item)}
                      className="bg-gray-50/50 hover:bg-gray-100 text-gray-600 border-gray-300 rounded-sm px-3 h-9 text-xs flex items-center gap-1.5 shadow-none cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Button>
                  ) : (
                    item.hasPublishButton && (
                      item.status === "Scheduled" ? (
                        <Button
                          size="sm"
                          onClick={() => openPublishModal(item)}
                          onMouseEnter={() => handlePrefetch(item)}
                          onFocus={() => handlePrefetch(item)}
                          className="bg-red-700 hover:bg-red-logo text-white rounded-sm px-3 h-9 text-xs flex items-center gap-1.5 border-none cursor-pointer"
                        >
                          <Send className="h-3.5 w-3.5 rotate-45" />
                          Publish
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => openPublishModal(item)}
                          onMouseEnter={() => handlePrefetch(item)}
                          onFocus={() => handlePrefetch(item)}
                          className="bg-red-700 hover:bg-red-logo text-white rounded-sm px-3 h-9 text-xs flex items-center gap-1.5 border-none cursor-pointer"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          Schedule
                        </Button>
                      )
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>

       {/* Separated Preview Publish Modal */}
      <ModalPreviewPublish
        key={itemToPreview?.id ?? "preview-closed"}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        item={itemToPreview}
        onPublish={handlePublish}
        mode={modalMode}
      />
    </Card>
  );
}
