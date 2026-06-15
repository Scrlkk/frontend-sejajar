import { Badge } from "@/components/ui/badge";
import type { TaskBoardItem } from "@/features/tasks/components/TasksContent";

interface TaskDashboardContentProps {
  task: TaskBoardItem;
}

const mockDueDates: Record<number, string> = {
  1: "Due: Apr 27, 2024",
  5: "Due: May 9, 2024",
  9: "Due: Apr 22, 2024",
  11: "Due: Apr 22, 2024",
};

const statusCardStyles: Record<string, string> = {
  todo: "bg-white border-gray-300 hover:border-red-logo",
  onProgress: "bg-amber-100/30 border-amber-100 hover:border-red-logo",
  revision: "bg-red-100/30 border-red-100 hover:border-red-logo",
  done: "bg-emerald-100/30 border-emerald-100 hover:border-red-logo",
};

export function TaskDashboardContent({ task }: TaskDashboardContentProps) {
  const displayDueDate = mockDueDates[task.id as number] || "Due: Apr 24, 2024";
  const cardStyle = statusCardStyles[task.status] || "bg-white border-gray-100";

  return (
    <div
      className={`w-full border rounded-xl p-4 space-y-3 shadow-xs hover:shadow-sm transition-all ${cardStyle}`}
    >
      <h4 className="font-semibold text-gray-900 text-sm leading-snug wrap-break-word">
        {task.title}
      </h4>

      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={`${task.categoryBg} ${task.categoryBorder} text-emerald-700 rounded-full font-medium px-3 py-0.5 text-xs flex items-center gap-1.5 shadow-none border`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${task.categoryDot}`} />
          {task.category}
        </Badge>
      </div>

      <div className="text-xs font-semibold text-gray-400 pt-0.5">
        {displayDueDate}
      </div>
    </div>
  );
}
