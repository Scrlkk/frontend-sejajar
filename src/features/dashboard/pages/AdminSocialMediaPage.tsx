import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { RecentComments } from "@/features/reviews/components/RecentComments";
import { UpcomingDeadlines } from "@/features/tasks/components/UpcomingDeadlines";
import { RevisionDashboard } from "@/features/reviews/components/RevisionDashboard";
import { PostSchedule } from "@/features/tasks/components/PostSchedules";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";
import {
  getDashboardWidgetApi,
  getDashboardSummaryApi,
  getDashboardChartsApi,
} from "@/features/dashboard/api/dashboardApi";
import { getUsersApi, type User } from "@/features/users/api/usersApi";
import { getContentsApi } from "@/features/contents/api/contentsApi";
import { getTasksApi } from "@/features/tasks/api/tasksApi";
import { getTaskTypeConfig } from "@/features/tasks/constants/typeConfig";
import { getInitials, getAvatarBg, getRoleBg, type DeadlineTask, mapTaskToDeadlineItem } from "@/utils/formatter";
import { formatDate } from "@/utils/helpers";
import { getRoleLabel } from "@/features/users/constants/roleColors";
import { ADMIN_SOCIAL_MEDIA_CARDS_TEMPLATE } from "@/features/dashboard/constants/cardConfig";

interface CommentWidgetData {
  id: number;
  task_id: number;
  task_title: string;
  user_id: number;
  user_name: string;
  message: string;
  created_at: string;
  assigned_to_name?: string;
}

interface StaffSummary {
  tasks: {
    published_today: number;
    on_progress: number;
    scheduled: number;
    revision: number;
  };
}



interface RevisionComment {
  id: number;
  task_id: number;
  task_title: string;
  user_id: number;
  user_name: string;
  message: string;
  created_at: string;
}

interface CommentsRevisionResponse {
  metric: string;
  comments: RevisionComment[];
}

export const AdminSocialMediaPage = () => {
  const navigate = useNavigate();
  const { roles } = usePermissions();
  const { user } = useAuth();
  const isSuperadmin = roles.includes("superadmin");

  const { data: summaryData } = useQuery<StaffSummary>({
    queryKey: ["staffSummary", "admin_social_media"],
    queryFn: () => getDashboardSummaryApi<StaffSummary>("admin_social_media"),
  });

  const { data: commentsRevisionData } = useQuery<CommentsRevisionResponse>({
    queryKey: ["dashboard-charts", "comments_revision", "admin_social_media"],
    queryFn: () =>
      getDashboardChartsApi<CommentsRevisionResponse>({
        metric: "comments_revision",
        limit: 10,
        role: "admin_social_media",
      }),
  });

  const { data: deadlinesWidget = { tasks: [] } } = useQuery<{
    tasks: DeadlineTask[];
  }>({
    queryKey: ["dashboard-widget", "upcoming-deadlines", "admin_social_media"],
    queryFn: () =>
      getDashboardWidgetApi<{ tasks: DeadlineTask[] }>("upcoming-deadlines", { role: "admin_social_media" }),
  });

  const { data: scheduledContents = [] } = useQuery({
    queryKey: ["contents", { status: "scheduled" }],
    queryFn: () => getContentsApi({ status: "scheduled", limit: 50 }),
  });

  const { data: myTasks = [] } = useQuery({
    queryKey: ["tasks", { assigned_to: isSuperadmin ? undefined : user?.id }],
    queryFn: () =>
      getTasksApi(
        isSuperadmin ? { limit: 1000 } : { assigned_to: Number(user?.id), limit: 1000 }
      ),
  });

  const { data: approvedTasks = [] } = useQuery({
    queryKey: ["tasks", { status: "approved", assigned_to: isSuperadmin ? undefined : user?.id }],
    queryFn: () =>
      getTasksApi(
        isSuperadmin
          ? { status: "approved", limit: 100 }
          : { status: "approved", assigned_to: Number(user?.id), limit: 100 }
      ),
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getUsersApi(),
  });

  const { data: commentsWidget = { comments: [] } } = useQuery<{
    comments: CommentWidgetData[];
  }>({
    queryKey: ["dashboard-widget", "recent-comments", "admin_social_media"],
    queryFn: () =>
      getDashboardWidgetApi<{ comments: CommentWidgetData[] }>(
        "recent-comments",
        { role: "admin_social_media" }
      ),
  });

  const handleReviseClick = (taskId?: number) => {
    if (taskId) {
      navigate(`/tasks?id=${taskId}`);
    } else {
      navigate("/tasks");
    }
  };

  const revisionTasks = useMemo(() => {
    return (deadlinesWidget.tasks || []).filter((t) => t.status === "revision");
  }, [deadlinesWidget.tasks]);

  const latestRevisionTask = revisionTasks[0];
  const latestRevisionComment = commentsRevisionData?.comments?.[0];

  const revisionDashboardData = useMemo(() => {
    const hasRevision = !!latestRevisionTask || !!latestRevisionComment;
    return {
      show: hasRevision,
      id: latestRevisionTask?.id || latestRevisionComment?.task_id,
      title:
        latestRevisionTask?.title ||
        latestRevisionComment?.task_title ||
        "Revision Task",
      description:
        "Tugas ini memerlukan revisi. Silakan klik 'Revise' untuk melihat detail feedback lengkap di kolom diskusi.",
      dueDateText: latestRevisionTask?.deadline
        ? `Due: ${formatDate(latestRevisionTask.deadline)}`
        : "No due date",
      category: latestRevisionTask?.content_title || "General",
    };
  }, [latestRevisionTask, latestRevisionComment]);

  const mappedComments = useMemo(() => {
    return (commentsWidget.comments || []).map((comment: CommentWidgetData) => {
      const isSystem = !comment.user_id;
      const user = isSystem
        ? null
        : users.find((u: User) => u.id === comment.user_id);
      const primaryRole = user?.role || "content_editor";
      return {
        id: comment.id,
        name: comment.user_name || "System",
        initials: getInitials(comment.user_name || "System"),
        avatarBg: getAvatarBg(comment.user_name || "System"),
        role: isSystem ? "Bot" : getRoleLabel(primaryRole),
        roleBg: isSystem
          ? "bg-slate-100 text-slate-600 border border-slate-200"
          : getRoleBg(primaryRole),
        targetContent: comment.task_title || "",
        commentText: comment.message || "",
        date: formatDate(comment.created_at),
        isSystem,
      };
    });
  }, [commentsWidget.comments, users]);

  const mappedCards = ADMIN_SOCIAL_MEDIA_CARDS_TEMPLATE.map((tpl) => {
    let value = 0;
    if (summaryData?.tasks) {
      if (tpl.key === "published_today") {
        value = summaryData.tasks.published_today;
      } else if (tpl.key === "on_progress") {
        value = summaryData.tasks.on_progress;
      } else if (tpl.key === "scheduled") {
        value = summaryData.tasks.scheduled;
      } else if (tpl.key === "revision") {
        value = summaryData.tasks.revision;
      }
    }
    return {
      title: tpl.title,
      value,
      description: tpl.description,
      icon: tpl.icon,
      iconColor: tpl.iconColor,
      iconBgColor: tpl.iconBgColor,
    };
  });

  const mappedDeadlines = useMemo(() => {
    return (deadlinesWidget.tasks || []).map(mapTaskToDeadlineItem);
  }, [deadlinesWidget.tasks]);

  const approvedCaptionTasks = useMemo(() => {
    return approvedTasks.filter((t) => {
      const role = t.assignee_roles?.[0] ?? "content_editor";
      const isCaption = getTaskTypeConfig(role).label === "Caption" && t.is_active !== false;
      const isContentScheduled = t.content_status === "scheduled";
      return isCaption && !isContentScheduled;
    });
  }, [approvedTasks]);

  const mappedSchedules = useMemo(() => {
    const myContentIds = new Set(myTasks.map((t) => Number(t.content_id)));
    const myScheduledContents = isSuperadmin
      ? scheduledContents
      : scheduledContents.filter((c) => myContentIds.has(Number(c.id)));

    const scheduledMapped = myScheduledContents.map((c) => {
      const schedDate = c.scheduled_at ? new Date(c.scheduled_at) : null;
      const time = schedDate
        ? schedDate
            .toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(".", ":")
        : "--:--";

      const postDate = formatDate(c.scheduled_at || c.due_date || "");

      return {
        id: `c_${c.id}`,
        time,
        postDate,
        title: c.title,
        platform: c.platform_name || "Instagram",
        platformColorKey: c.platform_color_key,
        status: "Scheduled",
        hasPublishButton: true,
        postDateRaw: c.scheduled_at || c.due_date || undefined,
      };
    });

    const approvedMapped = approvedCaptionTasks
      .map((t) => {
        const isPublishedContent = t.content_status === "published";
        const statusStr = isPublishedContent ? "Published" : "Approved";

        const schedDate = t.content_scheduled_at ? new Date(t.content_scheduled_at) : null;
        const time = schedDate
          ? schedDate
              .toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
              .replace(".", ":")
          : "--:--";

        return {
          id: `t_${t.id}`,
          time,
          postDate: t.deadline ? formatDate(t.deadline) : "No date",
          title: t.content_title || t.title,
          platform: t.platform_name || "Instagram",
          platformColorKey: t.platform_color_key,
          status: statusStr,
          hasPublishButton: statusStr !== "Published",
          postDateRaw: t.deadline || undefined,
        };
      })
      .filter((item) => {
        if (item.status === "Published") {
          if (!item.postDateRaw) return false;
          const pubDate = new Date(item.postDateRaw);
          const today = new Date();
          today.setHours(0, 0, 0, 0); 
          return pubDate.getTime() >= today.getTime();
        }
        return true;
      });

    const combined = [...scheduledMapped, ...approvedMapped];

    return combined.sort((a, b) => {
      const dateA = new Date(a.postDateRaw || 0).getTime();
      const dateB = new Date(b.postDateRaw || 0).getTime();
      return dateA - dateB;
    });
  }, [scheduledContents, approvedCaptionTasks, myTasks, isSuperadmin]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mappedCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      {revisionDashboardData.show && (
        <RevisionDashboard
          title={revisionDashboardData.title}
          description={revisionDashboardData.description}
          dueDateText={revisionDashboardData.dueDateText}
          category={revisionDashboardData.category}
          onRevise={() => handleReviseClick(revisionDashboardData.id)}
        />
      )}
      <div className="flex space-x-4">
        <PostSchedule schedules={mappedSchedules} />
      </div>
      <div className="flex space-x-4">
        <UpcomingDeadlines deadlines={mappedDeadlines} />
        <RecentComments
          comments={mappedComments}
          maxHeightClass="max-h-[300px]"
        />
      </div>
    </div>
  );
};
