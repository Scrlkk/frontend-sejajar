import {
  Calendar,
  TriangleAlert,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { TypeTasks } from "@/features/pillars/components/TypeTasks";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/utils/helpers";
import type { TaskBoardItem } from "@/features/tasks/types";
import { TASK_STATUS } from "@/features/tasks/constants/status";

interface TasksContentProps {
  task: TaskBoardItem;
  onSelect?: (task: TaskBoardItem) => void;
  onDelete?: (task: TaskBoardItem) => void;
  onRestore?: (task: TaskBoardItem) => void;
}

export function TasksContent({
  task,
  onSelect,
  onDelete,
  onRestore,
}: TasksContentProps) {
  const { user } = useAuth();
  const isDeleted = task.is_active === false;
  const showContentStatus =
    ["admin_social_media", "content_lead"].includes(user?.role || "") &&
    !!task.contentStatus &&
    ([TASK_STATUS.SCHEDULED, TASK_STATUS.PUBLISHED] as string[]).includes(task.contentStatus.toLowerCase());

  const isSuperadmin = user?.roles?.includes("superadmin");
  const isContractCreator =
    task.contractCreatedBy != null &&
    Number(task.contractCreatedBy) === Number(user?.id);
  const isContractLead =
    task.leadId != null && Number(task.leadId) === Number(user?.id);
  const canManageTask = isSuperadmin || isContractCreator || isContractLead;

  return (
    <Card
      onClick={() => !isDeleted && onSelect?.(task)}
      className={`w-full bg-white rounded-xl p-4 space-y-2.5 hover:shadow-md transition-all group ${
        isDeleted
          ? "opacity-60 border-dashed border-gray-300 bg-gray-50/50 cursor-default"
          : "hover:border-red-logo cursor-pointer"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TypeTasks type={task.type} />
          {task.isOverdue && !isDeleted && (
            <TriangleAlert className="h-4 w-4 text-red-500" />
          )}
        </div>

        <div className="flex items-center gap-1">
          {isDeleted
            ? onRestore &&
              canManageTask && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore(task);
                  }}
                  className="h-6 w-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Restore task"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )
            : onDelete &&
              canManageTask && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task);
                  }}
                  className="h-6 w-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete task"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
          {task.title}
        </h4>
        {task.content_title && (
          <p
            className="text-[11px] font-medium text-gray-400 truncate"
            title={task.content_title}
          >
            Konten: {task.content_title}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 items-center">
        {task.pillars && task.pillars.length > 0 ? (
          <>
            {task.pillars.slice(0, 2).map((p) => (
              <PillarsCard
                key={p.id}
                category={p.pillar_name}
                categoryId={p.id}
                colorKey={p.color_key}
              />
            ))}
            {task.pillars.length > 2 && (
              <span
                title={task.pillars
                  .slice(2)
                  .map((p) => p.pillar_name)
                  .join(", ")}
                className="rounded-lg px-2 py-0.5 text-[10px] font-semibold border bg-gray-50 text-gray-500 border-gray-200/60 shadow-none shrink-0 cursor-help"
              >
                + {task.pillars.length - 2} more
              </span>
            )}
          </>
        ) : (
          task.pillar && <PillarsCard category={task.pillar} />
        )}

        {showContentStatus && (
          <div className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 w-fit capitalize">
            {task.contentStatus}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <div
            className={`h-6 w-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold outline-1 ${task.assigneeBg}`}
          >
            {task.assigneeInitials}
          </div>
          <span className="text-xs text-gray-500 font-medium line-clamp-1">
            {task.assignee}
          </span>
        </div>
        {task.isOverdue && !isDeleted ? (
          <div className="flex items-center gap-1 text-xs text-red-500 font-semibold">
            <Calendar className="h-3.5 w-3.5" />
            <span>Overdue</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>{formatDate(task.date)}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
