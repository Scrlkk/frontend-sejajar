import { Calendar, TriangleAlert, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TypeTasks } from "@/features/pillars/components/TypeTasks";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";

export type TaskCommentItem = {
  id: string;
  sender: string;
  senderInitials: string;
  senderBg: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
};

export type TaskBoardItem = {
  id: string | number;
  title: string;
  type: "Script" | "Production" | "Editor" | "Caption";
  typeBg?: string;
  typeIcon?: LucideIcon;
  category: string;
  categoryDot: string;
  categoryBg?: string;
  categoryBorder?: string;
  assignee: string;
  assigneeInitials: string;
  assigneeBg: string;
  status: "to_do" | "on_progress" | "revision" | "approved" | "pending";
  isOverdue: boolean;
  date: Date;
  priority: "low" | "medium" | "high" | "critical";
  description?: string;
  pillar?: string;
  role?: string;
  deliverables?: string[];
  comments?: TaskCommentItem[];
};

interface TasksContentProps {
  task: TaskBoardItem;
  onSelect?: (task: TaskBoardItem) => void;
}

export function TasksContent({ task, onSelect }: TasksContentProps) {
  return (
    <Card 
      onClick={() => onSelect?.(task)}
      className="w-full bg-white rounded-xl p-4 space-y-2.5 hover:border-red-logo hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <TypeTasks type={task.type} />
        {task.isOverdue && <TriangleAlert className="h-4 w-4 text-red-500" />}
      </div>

      <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
        {task.title}
      </h4>

      {task.pillar && <PillarsCard category={task.pillar} />}

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
