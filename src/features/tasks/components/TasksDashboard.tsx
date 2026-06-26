import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { taskBoardColumns } from "@/features/tasks/constants/boardConfig";
import { getTasksApi } from "@/features/tasks/api/tasksApi";
import { getTaskTypeConfig } from "@/features/tasks/constants/typeConfig";
import { getInitialsAndBg, isTaskOverdue } from "@/utils/formatter";
import { TaskDashboardContent } from "@/features/tasks/components/TasksDashboardContent";
import type { TaskBoardItem } from "@/features/tasks/components/TasksContent";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";

interface TaskDashboardProps {
  title?: string;
  onViewAll?: () => void;
}

const getBadgeStyles = (key: string) => {
  switch (key) {
    case "to_do":
      return "text-gray-600 bg-gray-50 border border-gray-100/80";
    case "on_progress":
      return "text-amber-600 bg-amber-50 border border-amber-100/80";
    case "pending":
      return "text-purple-600 bg-purple-50 border border-purple-100/80";
    case "revision":
      return "text-red-600 bg-red-50 border border-red-100/80";
    case "approved":
      return "text-emerald-600 bg-emerald-50 border border-emerald-100/80";
    default:
      return "text-gray-600 bg-gray-50 border border-gray-100";
  }
};

export function TaskDashboard({
  title = "My Tasks",
  onViewAll,
}: TaskDashboardProps) {
  const { roles } = usePermissions();
  const { user } = useAuth();
  const isLeadOrOwner =
    roles.includes("content_lead") ||
    roles.includes("owner") ||
    roles.includes("superadmin");

  const { data: apiTasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasksApi(),
  });

  // Map API Task → TaskBoardItem (same mapping logic as TasksPage)
  const boardItems = useMemo<TaskBoardItem[]>(() => {
    const rawTasks = isLeadOrOwner
      ? apiTasks
      : apiTasks.filter((t) => Number(t.assigned_to) === Number(user?.id));

    return rawTasks.map((t) => {
      const role = t.assignee_roles?.[0] ?? "content_editor";
      const { label: type, bg: typeBg } = getTaskTypeConfig(role);
      const { initials, avatarBg } = getInitialsAndBg(t.assignee_name ?? "");
      const overdue = isTaskOverdue(t.deadline ?? null, t.status);
      const statusKey = t.status as TaskBoardItem["status"];

      return {
        id: t.id,
        content_id: t.content_id,
        title: t.title,
        type,
        typeBg,
        category: t.pillar_name ?? "General",
        categoryDot: "bg-gray-400",
        assignee: t.assignee_name ?? "Unassigned",
        assigneeInitials: initials,
        assigneeBg: avatarBg,
        status: statusKey,
        isOverdue: overdue,
        date: t.deadline ? new Date(t.deadline) : new Date(),
        priority: "medium",
        description: t.description,
        content_title: t.content_title,
        pillars: t.pillars,
      };
    });
  }, [apiTasks, isLeadOrOwner, user]);

  // In dashboard, filter tasks dynamically by type based on the logged-in user's role
  const scriptTasks = useMemo(() => {
    if (user?.role === "content_editor") {
      return boardItems.filter((t) => t.type === "Editor");
    }
    if (user?.role === "script_writer") {
      return boardItems.filter((t) => t.type === "Script");
    }
    if (user?.role === "admin_social_media") {
      return boardItems.filter((t) => t.type === "Caption");
    }
    return boardItems;
  }, [boardItems, user]);

  const activeColumns = taskBoardColumns.filter(
    (col) => col.key !== "approved",
  );

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg p-6 space-y-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        <button
          onClick={onViewAll}
          className="text-sm font-bold text-red-800 hover:text-red-900 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          All tasks
          <ArrowRight className="h-4 w-4" />
        </button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 items-start">
          {activeColumns.map((column) => {
            const columnTasks = scriptTasks.filter(
              (task) => task.status === column.key,
            );

            return (
              <div key={column.key} className="space-y-4 w-full">
                <div className="flex items-center justify-between text-sm font-bold text-gray-700 px-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${column.dotColor}`}
                    />
                    <span className="capitalize text-sm font-semibold">
                      {column.label
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </div>

                  <span
                    className={`h-6 min-w-6 px-1.5 text-xs font-bold rounded-full flex items-center justify-center ${getBadgeStyles(column.key)}`}
                  >
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnTasks.length > 0 ? (
                    <>
                      {columnTasks.slice(0, 2).map((task) => (
                        <TaskDashboardContent key={task.id} task={task} />
                      ))}
                      {columnTasks.length > 2 && (
                        <div
                          onClick={onViewAll}
                          className="py-2.5 px-4 rounded-xl border border-dashed border-gray-200 bg-slate-50/20 hover:bg-slate-50 text-center text-xs font-bold text-red-800 hover:text-red-900 cursor-pointer transition-colors"
                        >
                          + {columnTasks.length - 2} more
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-24 rounded-2xl border border-dashed border-gray-100 bg-gray-50/20 flex items-center justify-center text-xs text-gray-400 font-medium">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
