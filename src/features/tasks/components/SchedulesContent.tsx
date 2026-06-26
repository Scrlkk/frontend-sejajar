import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { getTasksApi, type Task } from "@/features/tasks/api/tasksApi";
import { getTaskOutputsApi } from "@/features/tasks/api/taskOutputsApi";
import { Button } from "@/components/ui/button";
import { getTaskTypeConfig } from "@/features/tasks/constants/typeConfig";
import { PlatformBadge } from "@/features/pillars/components/PlatformBadge";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";
import { StatusBadgeContent } from "@/features/pillars/components/StatusBadgeContent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ModalPreviewPublish,
  type PreviewPublishItem,
} from "@/features/tasks/components/ModalPreviewPublish";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getContentByIdApi, type ContentPillar } from "@/features/contents/api/contentsApi";

export interface ScheduledContentItem {
  id: string | number;
  title: string;
  campaign: string;
  platform: string;
  platformColorKey?: string | null;
  platformBg: string;
  pillar: string;
  pillars?: ContentPillar[];
  pillarBg: string;
  pillarDot: string;
  postDate: string;
  time: string;
  status: "Published" | "Approved" | "On Progress" | "Draft" | string;
  statusBg: string;
  statusDot: string;
  hasPublishButton: boolean;
  type?: string;
  caption?: string;
  hashtag?: string;
  postDateRaw?: string;
  file_url?: string;
  content_url?: string;
  content_id?: number;
  publisher_name?: string;
}

interface SchedulesContentProps {
  contents: ScheduledContentItem[];
  title?: string;
  itemsPerPage?: number;
  onScheduleNew?: () => void;
  onPreview?: (item: ScheduledContentItem) => void;
  onEdit?: (item: ScheduledContentItem) => void;
  onCancel?: (item: ScheduledContentItem) => void;
  onPublish?: (
    item: ScheduledContentItem,
    date?: string,
    time?: string,
    hashtags?: string,
  ) => Promise<void> | void;
}

export function SchedulesContent({
  contents,
  title = "List All Content",
  itemsPerPage = 6,
  onPreview,
  onPublish,
}: SchedulesContentProps) {
  const navigate = useNavigate();
  const { roles } = usePermissions();
  const { user } = useAuth();

  const resolvedTitle = useMemo(() => {
    if (title !== "List All Content") return title;
    const isLeadOrOwner = roles.some((r) =>
      ["owner", "content_lead", "superadmin", "admin_social_media"].includes(r.toLowerCase()),
    );
    return isLeadOrOwner ? "List All Content & Tasks" : "My Tasks";
  }, [roles, title]);

  const handleViewTask = async (item: ScheduledContentItem) => {
    const idStr = item.id.toString();
    if (idStr.startsWith("t_")) {
      const taskId = idStr.replace("t_", "");
      navigate(`/tasks?id=${taskId}`);
    } else if (idStr.startsWith("c_")) {
      const contentId = Number(idStr.replace("c_", ""));
      try {
        const tasksForContent = await getTasksApi({
          content_id: contentId,
          limit: 100,
        });
        if (tasksForContent && tasksForContent.length > 0) {
          const myTask = tasksForContent.find(
            (t) => Number(t.assigned_to) === Number(user?.id),
          );
          const targetTask = myTask || tasksForContent[0];
          navigate(`/tasks?id=${targetTask.id}`);
        } else {
          navigate("/tasks");
        }
      } catch (err) {
        console.error("Failed to fetch tasks for content:", err);
        navigate("/tasks");
      }
    } else {
      navigate(`/tasks?id=${item.id}`);
    }
  };

  const showTypeFilterAndColumn = useMemo(() => {
    const allowed = ["owner", "content_lead", "superadmin", "admin_social_media"];
    return roles.some((r) => allowed.includes(r));
  }, [roles]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Local CRUD items state initialized from props
  const [prevContents, setPrevContents] = useState(contents);
  const [items, setItems] = useState<ScheduledContentItem[]>(() => contents);

  // Derive unique platforms and statuses for filters
  const platformsList = useMemo(() => {
    const list = new Set(items.map((it) => it.platform));
    return Array.from(list).filter(Boolean);
  }, [items]);

  const statusesList = useMemo(() => {
    const list = new Set(items.map((it) => it.status));
    return Array.from(list).filter(Boolean);
  }, [items]);

  if (contents !== prevContents) {
    setPrevContents(contents);
    setItems(contents);
  }

  // Preview modal states & actions
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [itemToPreview, setItemToPreview] =
    useState<ScheduledContentItem | null>(null);
  const [prefetchedDetails, setPrefetchedDetails] = useState<
    Record<string | number, ScheduledContentItem>
  >({});

  const handlePrefetch = async (item: ScheduledContentItem) => {
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
    item: ScheduledContentItem,
  ): Promise<ScheduledContentItem> => {
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
  };

  const openPreviewModal = async (item: ScheduledContentItem) => {
    try {
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

      setTimeout(() => {
        setIsPreviewModalOpen(true);
      }, 100);
      onPreview?.(item);
    } catch (err) {
      console.error("Failed to load preview details:", err);
    }
  };

  const handlePublish = async (
    item: PreviewPublishItem,
    date?: string,
    time?: string,
    hashtags?: string,
  ) => {
    if (onPublish) {
      const scheduledItem = items.find((it) => it.id === item.id);
      if (scheduledItem) {
        const mergedItem: ScheduledContentItem = {
          ...scheduledItem,
          caption: item.caption,
          hashtag: item.hashtag,
        };
        await onPublish(mergedItem, date, time, hashtags);
      }
    } else {
      setItems((prev) =>
        prev.map((it) => {
          if (it.id === item.id) {
            const isScheduling = it.status.toLowerCase() === "approved";
            const nextStatus = isScheduling ? "Scheduled" : "Published";
            return {
              ...it,
              status: nextStatus,
              statusBg:
                nextStatus === "Published"
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-50"
                  : "bg-amber-50 text-amber-600 hover:bg-amber-50",
              statusDot:
                nextStatus === "Published" ? "bg-blue-500" : "bg-amber-500",
            };
          }
          return it;
        }),
      );
    }
    setIsPreviewModalOpen(false);
  };

  const filteredItems = items.filter((item) => {
    const isContentItem =
      item.type === "Content" || item.id.toString().startsWith("c_");
    const itemTypeString = isContentItem ? "content" : "task";

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.campaign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pillar.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform =
      selectedPlatform === "all" ||
      item.platform.toLowerCase() === selectedPlatform.toLowerCase();

    const matchesStatus =
      selectedStatus === "all" ||
      item.status.toLowerCase() === selectedStatus.toLowerCase();

    const matchesType =
      selectedType === "all" || itemTypeString === selectedType.toLowerCase();

    return matchesSearch && matchesPlatform && matchesStatus && matchesType;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 flex flex-col gap-4">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900 shrink-0">
          {resolvedTitle}
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto xl:flex-1 xl:justify-end">
          {/* Searchbar */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, campaign, or pillar..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 transition-colors"
            />
          </div>

          {/* Platform Filter */}
          <Select
            value={selectedPlatform}
            onValueChange={(val) => {
              setSelectedPlatform(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium h-10 shadow-none">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platformsList.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={selectedStatus}
            onValueChange={(val) => {
              setSelectedStatus(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium h-10 shadow-none">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusesList.map((s) => {
                const norm = s.toLowerCase();
                const label =
                  norm === "to_do" || norm === "todo" || norm === "to do"
                    ? "To Do"
                    : norm === "on_progress" ||
                        norm === "on progress" ||
                        norm === "onprogress"
                      ? "On Progress"
                      : norm === "pending" || norm === "review"
                        ? "Review"
                        : s.charAt(0).toUpperCase() + s.slice(1);
                return (
                  <SelectItem key={s} value={s}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Type Filter */}
          {showTypeFilterAndColumn && (
            <Select
              value={selectedType}
              onValueChange={(val) => {
                setSelectedType(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium h-10 shadow-none">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto rounded-xl border border-gray-50">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-gray-400 font-medium py-3">
                Title
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                Platform
              </TableHead>
              {showTypeFilterAndColumn && (
                <TableHead className="text-gray-400 font-medium py-3">
                  Type
                </TableHead>
              )}
              <TableHead className="text-gray-400 font-medium py-3">
                Pillar
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                Deadline
              </TableHead>
              {showTypeFilterAndColumn && (
                <TableHead className="text-gray-400 font-medium py-3">
                  Publish Time
                </TableHead>
              )}
              <TableHead className="text-gray-400 font-medium py-3">
                Status
              </TableHead>
              <TableHead className="text-gray-400 font-medium text-center py-3">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-gray-50 last:border-none hover:bg-gray-50/30 transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="flex flex-col max-w-60">
                      <span className="font-bold text-gray-900 leading-snug wrap-break-word">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-400 mt-0.5 font-medium wrap-break-word">
                        {item.campaign}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <PlatformBadge
                      platform={item.platform}
                      colorKey={item.platformColorKey}
                      className="text-xs font-medium"
                    />
                  </TableCell>

                  {showTypeFilterAndColumn && (
                    <TableCell className="py-4">
                      {item.type === "Content" ||
                      item.id.toString().startsWith("c_") ? (
                        <span className="rounded-lg px-2 py-0.5 text-[10px] font-bold border border-blue-200 bg-blue-50 text-blue-700 shrink-0">
                          Content
                        </span>
                      ) : (
                        <span className="rounded-lg px-2 py-0.5 text-[10px] font-bold border border-purple-200 bg-purple-50 text-purple-700 shrink-0">
                          Task
                        </span>
                      )}
                    </TableCell>
                  )}

                  <TableCell className="py-4">
                    <div className="flex flex-col flex-wrap gap-1.5 items-center">
                      {item.pillars && item.pillars.length > 0 ? (
                        <>
                          {item.pillars.slice(0, 1).map((p) => (
                            <PillarsCard
                              key={p.id}
                              category={p.pillar_name}
                              categoryId={p.id}
                              colorKey={p.color_key}
                            />
                          ))}
                          {item.pillars.length > 1 && (
                            <span
                              title={item.pillars.slice(1).map((p) => p.pillar_name).join(", ")}
                              className="rounded-lg px-2 py-0.5 text-[10px] font-semibold border bg-gray-50 text-gray-500 border-gray-200/60 shadow-none shrink-0 cursor-help"
                            >
                              + {item.pillars.length - 1} more
                            </span>
                          )}
                        </>
                      ) : (
                        <PillarsCard category={item.pillar} />
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-gray-500 font-medium text-sm">
                    {item.postDate}
                  </TableCell>

                  {showTypeFilterAndColumn && (
                    <TableCell className="py-4 text-gray-500 font-medium text-sm">
                      {(() => {
                        const isContent =
                          item.type === "Content" ||
                          item.id.toString().startsWith("c_");
                        if (!isContent) {
                          return <span className="text-gray-300">—</span>;
                        }

                        const isScheduled =
                          item.status?.toLowerCase() === "scheduled" ||
                          item.status?.toLowerCase() === "published";
                        if (isScheduled && item.postDateRaw) {
                          try {
                            return format(new Date(item.postDateRaw), "dd/MM/yyyy HH:mm");
                          } catch {
                            // fallback
                          }
                        }
                        if (isScheduled && item.time) {
                          return item.time;
                        }

                        return (
                          <span className="text-gray-400 italic text-xs">
                            Belum Terjadwal
                          </span>
                        );
                      })()}
                    </TableCell>
                  )}

                  <TableCell className="py-4">
                    <StatusBadgeContent
                      status={item.status}
                      className="text-xs font-bold"
                    />
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center justify-center">
                      {(() => {
                        const isContentItem =
                          item.type === "Content" ||
                          item.id.toString().startsWith("c_");
                        const isTask = !isContentItem;

                        const isOwner = roles.some(
                          (r) => r.toLowerCase() === "owner",
                        );
                        if (isOwner) {
                          if (isContentItem) {
                            return (
                              <Button
                                onClick={() => openPreviewModal(item)}
                                onMouseEnter={() => handlePrefetch(item)}
                                onFocus={() => handlePrefetch(item)}
                                variant="outline"
                                size="sm"
                                className="bg-gray-50/50 hover:bg-gray-100 text-gray-600 border-gray-200/80 rounded-xl px-3 h-8 text-xs flex items-center gap-1.5 shadow-none cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Preview
                              </Button>
                            );
                          }
                          return null;
                        }

                        const isContentLead = roles.some((r) =>
                          ["content_lead", "superadmin"].includes(
                            r.toLowerCase(),
                          ),
                        );

                        if (isContentLead && isTask) {
                          return (
                            <Button
                              onClick={() => handleViewTask(item)}
                              variant="outline"
                              size="sm"
                              className="bg-gray-50/50 hover:bg-gray-100 text-gray-600 border-gray-200/80 rounded-xl px-3 h-8 text-xs flex items-center gap-1.5 shadow-none cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View Task
                            </Button>
                          );
                        }

                        if (
                          showTypeFilterAndColumn ||
                          item.status.toLowerCase() === "scheduled" ||
                          item.status.toLowerCase() === "published"
                        ) {
                          return (
                            <Button
                              onClick={() => openPreviewModal(item)}
                              onMouseEnter={() => handlePrefetch(item)}
                              onFocus={() => handlePrefetch(item)}
                              variant="outline"
                              size="sm"
                              className="bg-gray-50/50 hover:bg-gray-100 text-gray-600 border-gray-200/80 rounded-xl px-3 h-8 text-xs flex items-center gap-1.5 shadow-none cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Preview
                            </Button>
                          );
                        }

                        return (
                          <Button
                            onClick={() => handleViewTask(item)}
                            variant="outline"
                            size="sm"
                            className="bg-gray-50/50 hover:bg-gray-100 text-gray-600 border-gray-200/80 rounded-xl px-3 h-8 text-xs flex items-center gap-1.5 shadow-none cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Task
                          </Button>
                        );
                      })()}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              /* State Jika Data Sistem Kosong */
              <TableRow>
                <TableCell
                  colSpan={showTypeFilterAndColumn ? 8 : 7}
                  className="py-16 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v6a2 2 0 012-2m14-10V4a2 2 0 00-2-2H5a2 2 0 00-2 2v7"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500">
                      No content scheduled
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      There are no content records registered in the timeline
                      yet.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* State Jika Hasil Pencarian Kosong */
              <TableRow>
                <TableCell
                  colSpan={showTypeFilterAndColumn ? 8 : 7}
                  className="py-16 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500">
                      No matching content
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      We couldn't find any content matching "{searchQuery}".
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between pt-2 text-sm text-gray-500 border-t border-gray-100 mt-auto">
        <div>
          Showing{" "}
          <span className="font-medium text-gray-900">
            {totalItems === 0 ? 0 : indexOfFirstItem + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-900">
            {indexOfLastItem > totalItems ? totalItems : indexOfLastItem}
          </span>{" "}
          of <span className="font-medium text-gray-900">{totalItems}</span>{" "}
          contents
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-xl h-9 px-3 gap-1 border-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center justify-center min-w-8 font-medium text-gray-900 px-2">
            Page {currentPage} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded-xl h-9 px-3 gap-1 border-gray-200"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

       {/* Separated Preview Publish Modal */}
      <ModalPreviewPublish
        key={itemToPreview?.id ?? "preview-closed"}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        item={itemToPreview}
        onPublish={handlePublish}
        mode={
          itemToPreview?.status?.toLowerCase() === "approved"
            ? "publish"
            : "preview"
        }
      />
    </div>
  );
}
