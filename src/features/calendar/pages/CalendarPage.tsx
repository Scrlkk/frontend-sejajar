import { useState, useMemo } from "react";
import { isSameDay, format } from "date-fns";
import {
  ContentCalendar,
  type CalendarEvent,
} from "@/features/calendar/components/Calendar";
import {
  CalendarSchedules,
  type MiniScheduleItem,
} from "@/features/calendar/components/CalendarSchedules";
import {
  SchedulesContent,
  type ScheduledContentItem,
} from "@/features/tasks/components/SchedulesContent";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTaskApi,
  getTasksApi,
  getTaskByIdApi,
} from "@/features/tasks/api/tasksApi";
import { createTaskOutputApi } from "@/features/tasks/api/taskOutputsApi";
import {
  publishContentApi,
  updateContentApi,
} from "@/features/contents/api/contentsApi";
import toast from "react-hot-toast";
import { getDashboardWidgetApi } from "@/features/dashboard/api/dashboardApi";
import {
  getPlatformConfig,
  getContentStatusConfig,
  getTaskStatusConfig,
} from "@/utils/formatter";
import { formatDate } from "@/utils/helpers";
import {
  TabletSmartphone,
  TvMinimal,
  Smartphone,
  BarChart3,
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import type { ContentPillar } from "@/features/contents/api/contentsApi";

interface CalendarTaskItem {
  id: number;
  title: string;
  status: string;
  deadline: string;
  platform_name: string;
  platform_color_key?: string | null;
  content_id: number;
  content_title: string;
  category_name?: string;
  pillar_name?: string;
  format?: string;
  priority?: string;
  pillars?: ContentPillar[];
}

interface CalendarContentItem {
  id: number;
  title: string;
  status: string;
  due_date: string;
  scheduled_at?: string;
  platform_name: string;
  platform_color_key?: string | null;
  category_name?: string;
  pillar_name?: string;
  format?: string;
  priority?: string;
  pillars?: ContentPillar[];
}

interface CalendarDataResponse {
  contents: CalendarContentItem[];
  tasks: CalendarTaskItem[];
}

export const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const { roles } = usePermissions();

  const isStaffOnly = useMemo(() => {
    const allowedAll = ["content_lead", "owner", "superadmin", "admin_social_media"];
    return !roles.some((r) => allowedAll.includes(r));
  }, [roles]);

  const monthParam = useMemo(() => {
    return format(currentDate, "yyyy-MM");
  }, [currentDate]);

  // Fetch calendar widget parameterized by active month
  const { data: calendarData = { contents: [], tasks: [] } } =
    useQuery<CalendarDataResponse>({
      queryKey: ["calendar-widget", monthParam],
      queryFn: () =>
        getDashboardWidgetApi<CalendarDataResponse>("calendar", {
          month: monthParam,
        }),
    });

  const queryClient = useQueryClient();

  const publishMutation = useMutation({
    mutationFn: async ({
      contentId,
      taskId,
      status,
      deadline,
      caption,
      hashtag,
    }: {
      contentId: number;
      taskId: number;
      status: string;
      deadline?: string;
      caption?: string;
      hashtag?: string;
    }) => {
      const targetStatus = status.toLowerCase();
      if (targetStatus === "published") {
        await publishContentApi(contentId);
      } else if (targetStatus === "scheduled") {
        await updateContentApi(contentId, {
          status: "scheduled",
          scheduled_at: deadline,
        });
        if (caption || hashtag) {
          const formData = new FormData();
          formData.append("task_id", String(taskId));
          if (caption) {
            formData.append("caption", caption);
          }
          if (hashtag) {
            formData.append("hashtag", hashtag);
          }
          await createTaskOutputApi(formData);
        }
        if (deadline) {
          await updateTaskApi(taskId, { deadline });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-widget"] });
      toast.success("Status berhasil diperbarui!");
    },
    onError: (err: unknown) => {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : "Gagal memperbarui status.";
      toast.error(msg);
    },
  });

  const getTaskIdForContent = async (contentId: number): Promise<number> => {
    // 1. Try to find in calendarData.tasks
    const localTask = (calendarData.tasks || []).find(
      (t) => Number(t.content_id) === contentId,
    );
    if (localTask) return localTask.id;

    // 2. Fetch from API
    const tasks = await getTasksApi({ content_id: contentId, limit: 100 });
    if (tasks && tasks.length > 0) {
      return tasks[0].id;
    }
    throw new Error("Tugas untuk rencana konten ini tidak ditemukan");
  };

  const handlePublish = async (
    item: ScheduledContentItem,
    date?: string,
    time?: string,
    hashtags?: string,
  ) => {
    const idStr = item.id.toString();
    const isContent = idStr.startsWith("c_");
    const dbId = Number(idStr.replace(/^[ct]_/, ""));

    try {
      const contentId = isContent
        ? dbId
        : (calendarData.tasks || []).find((t) => Number(t.id) === dbId)
            ?.content_id || (await getTaskByIdApi(dbId)).content_id;

      const taskId = isContent ? await getTaskIdForContent(dbId) : dbId;

      const nextStatus =
        item.status.toLowerCase() === "approved" ? "scheduled" : "published";
      const deadline = date && time ? `${date}T${time}:00` : undefined;

      // Append hashtags if provided
      const existingCaption = item.caption || "";
      const updatedCaption = hashtags
        ? `${existingCaption} ${hashtags}`.trim()
        : existingCaption;

      await publishMutation.mutateAsync({
        contentId,
        taskId,
        status: nextStatus,
        deadline,
        caption: updatedCaption || undefined,
        hashtag: hashtags || undefined,
      });
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Gagal memproses aksi.";
      toast.error(msg);
    }
  };

  const getEventTime = (status: string, scheduledAt?: string) => {
    const norm = status.toLowerCase();
    if ((norm === "scheduled" || norm === "published") && scheduledAt) {
      try {
        return format(new Date(scheduledAt), "HH:mm");
      } catch {
        // ignore
      }
    }
    return "";
  };

  // Map contents & tasks from calendar API response to unified CalendarEvent structures
  const mappedEvents = useMemo((): CalendarEvent[] => {
    const contents = isStaffOnly
      ? []
      : (calendarData.contents || []).map((c) => {
          const platformCfg = getPlatformConfig(c.platform_name);
          const statusCfg = getContentStatusConfig(c.status);
          return {
            id: `c_${c.id}`,
            title: c.title,
            time: getEventTime(c.status, c.scheduled_at),
            date: new Date(c.due_date),
            platform: c.platform_name,
            platformColorKey: c.platform_color_key,
            badgeBg: statusCfg.bg,
            lineColor: platformCfg.calendarBorder,
            status: c.status,
            category: c.category_name || "General",
            pillar: c.pillar_name || "General",
            format: c.format || "Video",
            priority: c.priority || "Medium",
          };
        });

    const tasks = (calendarData.tasks || []).map((t) => {
      const platformCfg = getPlatformConfig(t.platform_name || "Instagram");
      const statusCfg = getTaskStatusConfig(t.status);
      return {
        id: `t_${t.id}`,
        title: t.title,
        time: "",
        date: new Date(t.deadline),
        platform: t.platform_name || "Instagram",
        platformColorKey: t.platform_color_key,
        badgeBg: statusCfg.bg,
        lineColor: platformCfg.calendarBorder,
        status: t.status,
        category: t.category_name || "General",
        pillar: t.pillar_name || "General",
        format: t.format || "Video",
        priority: t.priority || "Medium",
      };
    });

    return [...contents, ...tasks];
  }, [calendarData, isStaffOnly]);

  // Filter events for the selected day
  const dailyEvents = selectedDay
    ? mappedEvents.filter((event) => isSameDay(event.date, selectedDay))
    : [];

  // Map CalendarEvent to MiniScheduleItem for the sidebar
  const dailySchedules: MiniScheduleItem[] = dailyEvents.map((event) => {
    const statusCfg = event.status
      ? event.id.toString().startsWith("c_")
        ? getContentStatusConfig(event.status)
        : getTaskStatusConfig(event.status)
      : { bg: "", dot: "" };

    const platformCfg = getPlatformConfig(event.platform);

    return {
      id: event.id,
      title: event.title,
      category: event.category || "General",
      categoryBg: platformCfg.bg,
      categoryDot: `bg-[${platformCfg.chartColor}]`,
      status: event.status || "Scheduled",
      statusBg: statusCfg.bg,
      statusDot: statusCfg.dot,
      platform: event.platform,
      time: event.time,
      format: event.format,
      priority: event.priority,
      date: event.date,
    };
  });

  const formatSelectedDate = (date: Date | null) => {
    if (!date) return "No Date Selected";
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Calculate stats dynamically from calendar monthly data
  const cardCounts = useMemo(() => {
    const counts = { Instagram: 0, YouTube: 0, TikTok: 0, Total: 0 };
    if (!isStaffOnly) {
      (calendarData.contents || []).forEach((c) => {
        if (c.platform_name === "Instagram") counts.Instagram++;
        if (c.platform_name === "YouTube") counts.YouTube++;
        if (c.platform_name === "TikTok") counts.TikTok++;
        counts.Total++;
      });
    }
    (calendarData.tasks || []).forEach((t) => {
      if (t.platform_name === "Instagram") counts.Instagram++;
      if (t.platform_name === "YouTube") counts.YouTube++;
      if (t.platform_name === "TikTok") counts.TikTok++;
      counts.Total++;
    });
    return counts;
  }, [calendarData, isStaffOnly]);

  const cards = [
    {
      title: "Instagram",
      value: cardCounts.Instagram,
      description: "Platform Summary",
      icon: TabletSmartphone,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-600/10",
    },
    {
      title: "Youtube",
      value: cardCounts.YouTube,
      description: "Platform Summary",
      icon: TvMinimal,
      iconColor: "text-yellow-600",
      iconBgColor: "bg-yellow-600/10",
    },
    {
      title: "Tiktok",
      value: cardCounts.TikTok,
      description: "Platform Summary",
      icon: Smartphone,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-600/10",
    },
    {
      title: "Total Summary",
      value: cardCounts.Total,
      description: "This Month",
      icon: BarChart3,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-600/10",
    },
  ];

  // Map calendarData contents and tasks to SchedulesContent table items
  const mappedSchedulesList = useMemo(() => {
    const contents = isStaffOnly
      ? []
      : (calendarData.contents || []).map((c) => {
          const platformCfg = getPlatformConfig(c.platform_name);
          const statusCfg = getContentStatusConfig(c.status);
          return {
            id: `c_${c.id}`,
            title: c.title,
            campaign: "Campaign Series",
            platform: c.platform_name,
            platformColorKey: c.platform_color_key,
            platformBg: platformCfg.bg,
            pillar: c.pillar_name || "General",
            pillars: c.pillars,
            pillarBg: "bg-blue-50 text-blue-600",
            pillarDot: "bg-blue-500",
            postDate: formatDate(c.scheduled_at || c.due_date),
            postDateRaw: c.scheduled_at || c.due_date,
            time: getEventTime(c.status, c.scheduled_at),
            status: c.status,
            statusBg: statusCfg.bg,
            statusDot: statusCfg.dot,
            hasPublishButton:
              c.status === "approved" || c.status === "scheduled",
            type: "Content",
          };
        });

    const tasks = (calendarData.tasks || []).map((t) => {
      const platformCfg = getPlatformConfig(t.platform_name || "Instagram");
      const statusCfg = getTaskStatusConfig(t.status);
      return {
        id: `t_${t.id}`,
        title: t.title,
        campaign: t.content_title || "General Task",
        platform: t.platform_name || "Instagram",
        platformColorKey: t.platform_color_key,
        platformBg: platformCfg.bg,
        pillar: t.pillar_name || "General",
        pillars: t.pillars,
        pillarBg: "bg-purple-50 text-purple-600",
        pillarDot: "bg-purple-500",
        postDate: formatDate(t.deadline),
        postDateRaw: t.deadline,
        time: "",
        status: t.status,
        statusBg: statusCfg.bg,
        statusDot: statusCfg.dot,
        hasPublishButton: false,
        type: "Task",
      };
    });

    return [...contents, ...tasks];
  }, [calendarData, isStaffOnly]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div className="w-full flex items-stretch gap-4">
        <div className="flex-1">
          <ContentCalendar
            events={mappedEvents}
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
            currentDate={currentDate}
            onCurrentDateChange={setCurrentDate}
          />
        </div>
        <div className="w-80 flex items-start">
          <CalendarSchedules
            dateTitle={formatSelectedDate(selectedDay)}
            schedules={dailySchedules}
          />
        </div>
      </div>
      <SchedulesContent
        contents={mappedSchedulesList}
        onPublish={handlePublish}
      />
    </div>
  );
};
