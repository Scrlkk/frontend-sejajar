import { TaskCalendar } from "@/features/calendar/components/TasksCalendar";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { RecentComments } from "@/features/reviews/components/RecentComments";
import { TaskDashboard } from "@/features/tasks/components/TasksDashboard";
import { UpcomingDeadlines } from "@/features/tasks/components/UpcomingDeadlines";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  getDashboardWidgetApi,
  getDashboardSummaryApi,
  getDashboardChartsApi,
} from "@/features/dashboard/api/dashboardApi";
import { RevisionDashboard } from "@/features/reviews/components/RevisionDashboard";
import { getUsersApi, type User } from "@/features/users/api/usersApi";
import { getInitials, getAvatarBg, getRoleBg, type DeadlineTask, mapTaskToDeadlineItem } from "@/utils/formatter";
import { formatDate } from "@/utils/helpers";
import { getRoleLabel } from "@/features/users/constants/roleColors";
import { STAFF_CARDS_TEMPLATE } from "@/features/dashboard/constants/cardConfig";

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
    total: number;
    to_do: number;
    on_progress: number;
    approved: number;
    revision: number;
  };
}



interface CalendarTaskItem {
  id: number;
  title: string;
  status: string;
  deadline: string;
  platform_name: string;
  content_id: number;
  content_title: string;
  priority?: string;
}

interface CalendarContentItem {
  id: number;
  title: string;
  status: string;
  due_date: string;
  platform_name: string;
}

interface CalendarDataResponse {
  contents: CalendarContentItem[];
  tasks: CalendarTaskItem[];
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

export const ContentEditorPage = () => {
  const navigate = useNavigate();

  const handleViewAllTasks = () => {
    navigate("/tasks");
  };

  const handleReviseClick = (taskId?: number) => {
    if (taskId) {
      navigate(`/tasks?id=${taskId}`);
    } else {
      navigate("/tasks");
    }
  };

  // Fetch dashboard summary
  const { data: summaryData } = useQuery<StaffSummary>({
    queryKey: ["staffSummary"],
    queryFn: () => getDashboardSummaryApi<StaffSummary>(),
  });

  // Fetch comments revision widget/chart
  const { data: commentsRevisionData } = useQuery<CommentsRevisionResponse>({
    queryKey: ["dashboard-charts", "comments_revision"],
    queryFn: () =>
      getDashboardChartsApi<CommentsRevisionResponse>({
        metric: "comments_revision",
        limit: 10,
      }),
  });

  // Fetch deadlines widget
  const { data: deadlinesWidget = { tasks: [] } } = useQuery<{
    tasks: DeadlineTask[];
  }>({
    queryKey: ["dashboard-widget", "upcoming-deadlines"],
    queryFn: () =>
      getDashboardWidgetApi<{ tasks: DeadlineTask[] }>("upcoming-deadlines"),
  });

  // Find latest revision task if any
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

  // Fetch calendar widget
  const { data: calendarData = { contents: [], tasks: [] } } =
    useQuery<CalendarDataResponse>({
      queryKey: ["dashboard-widget", "calendar"],
      queryFn: () => getDashboardWidgetApi<CalendarDataResponse>("calendar"),
    });

  // Fetch users to resolve role details for comments
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getUsersApi(),
  });

  // Fetch recent comments widget
  const { data: commentsWidget = { comments: [] } } = useQuery<{
    comments: CommentWidgetData[];
  }>({
    queryKey: ["dashboard-widget", "recent-comments"],
    queryFn: () =>
      getDashboardWidgetApi<{ comments: CommentWidgetData[] }>(
        "recent-comments",
      ),
  });

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

  const mappedCards = STAFF_CARDS_TEMPLATE.map((tpl) => {
    let value = 0;
    if (summaryData?.tasks) {
      if (tpl.key === "to_do") {
        value = summaryData.tasks.to_do;
      } else if (tpl.key === "on_progress") {
        value = summaryData.tasks.on_progress;
      } else if (tpl.key === "approved") {
        value = summaryData.tasks.approved;
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

  const mappedCalendarTasks = useMemo(() => {
    return (calendarData.tasks || []).map((t: CalendarTaskItem) => {
      const allowedStatuses = ["to_do", "on_progress", "pending", "revision", "approved"];
      const statusValue = allowedStatuses.includes(t.status)
        ? (t.status as "to_do" | "on_progress" | "pending" | "revision" | "approved")
        : "to_do";

      const priorityValue = (t.priority?.toLowerCase() as "low" | "medium" | "high" | "critical") || "medium";

      return {
        id: t.id,
        title: t.title,
        status: statusValue,
        date: t.deadline ? new Date(t.deadline) : new Date(),
        priority: priorityValue,
        category: t.content_title || "General",
        categoryDot: "bg-blue-500",
        categoryBg: "bg-blue-50",
        categoryBorder: "border-blue-200",
        type: "Editor" as const,
        assignee: "",
        assigneeInitials: "",
        assigneeBg: "",
        isOverdue: t.deadline ? new Date(t.deadline) < new Date() && t.status !== "approved" : false,
      };
    });
  }, [calendarData.tasks]);

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
        <TaskDashboard onViewAll={handleViewAllTasks} />
        <div className="w-100">
          <TaskCalendar tasks={mappedCalendarTasks} />
        </div>
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
