import { Calendar, TriangleAlert, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type TaskBoardItem = {
  id: string | number;
  title: string;
  type: "Script" | "Production" | "Caption";
  typeBg: string;
  typeIcon: LucideIcon;
  category: string;
  categoryDot: string;
  categoryBg?: string;
  categoryBorder?: string;
  assignee: string;
  assigneeInitials: string;
  assigneeBg: string;
  status: "todo" | "onProgress" | "revision" | "done";
  isOverdue: boolean;
  date: Date;
  priority: "low" | "medium" | "high" | "critical";
};

interface TasksContentProps {
  task: TaskBoardItem;
}

export function TasksContent({ task }: TasksContentProps) {
  const TypeIcon = task.typeIcon;

  return (
    <Card className="w-full bg-white rounded-xl p-4 space-y-2.5 hover:border-red-logo hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-center justify-between">
        <Badge
          className={`${task.typeBg} rounded-md font-medium text-[10px] px-2 py-0.5 border-none shadow-none flex items-center gap-1`}
        >
          <TypeIcon className="h-3 w-3" />
          {task.type}
        </Badge>
        {task.isOverdue && <TriangleAlert className="h-4 w-4 text-red-500" />}
      </div>

      <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
        {task.title}
      </h4>

      <Badge
        variant="outline"
        className={`w-full flex justify-start gap-1.5 rounded-xl font-medium text-xs text-gray-500 shadow-none ${task.categoryBorder || "border-gray-300"} ${task.categoryBg || "bg-transparent"}`}
      >
        <span className={`h-2 w-2 rounded-full ${task.categoryDot}`} />
        {task.category}
      </Badge>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div
            className={`h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold outline-1 ${task.assigneeBg}`}
          >
            {task.assigneeInitials}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {task.assignee}
          </span>
        </div>
        {task.isOverdue && (
          <div className="flex items-center gap-1 text-xs text-red-500 font-semibold">
            <Calendar className="h-3 w-3" />
            <span>Overdue</span>
          </div>
        )}
      </div>
    </Card>
  );
}
