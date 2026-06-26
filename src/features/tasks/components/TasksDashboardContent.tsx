import type { TaskBoardItem } from "@/features/tasks/components/TasksContent";
import { useNavigate } from "react-router-dom";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";
import { formatDateEN } from "@/utils/helpers";

interface TaskDashboardContentProps {
  task: TaskBoardItem;
}

const statusCardStyles: Record<string, string> = {
  to_do: "bg-white border-gray-300 hover:border-gray-700",
  on_progress: "bg-amber-100/20 border-amber-100 hover:border-amber-300",
  pending: "bg-purple-100/70 border-purple-100 hover:border-purple-300",
  review: "bg-purple-100/70 border-purple-100 hover:border-purple-300",
  revision: "bg-red-100/70 border-red-100 hover:border-red-300",
  approved: "bg-emerald-100/70 border-emerald-100 hover:border-emerald-300",
};

export function TaskDashboardContent({ task }: TaskDashboardContentProps) {
  const navigate = useNavigate();

  const displayDueDate = task.date
    ? `Due: ${formatDateEN(task.date)}`
    : "No deadline";

  const cardStyle = statusCardStyles[task.status] || "bg-white border-gray-100";

  return (
    <div
      onClick={() => navigate(`/tasks?id=${task.id}`)}
      className={`w-full border rounded-xl p-4 space-y-3 shadow-xs hover:shadow-sm transition-all cursor-pointer ${cardStyle}`}
    >
      <div className="space-y-1">
        <h4 className="font-semibold text-gray-900 text-sm leading-snug wrap-break-word">
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
                className="rounded-full font-medium px-3 py-0.5 text-xs"
              />
            ))}
            {task.pillars.length > 2 && (
              <span
                title={task.pillars.slice(2).map((p) => p.pillar_name).join(", ")}
                className="rounded-lg px-2 py-0.5 text-[10px] font-semibold border bg-gray-50 text-gray-500 border-gray-200/60 shadow-none shrink-0 cursor-help"
              >
                + {task.pillars.length - 2} more
              </span>
            )}
          </>
        ) : (
          <PillarsCard
            category={task.category}
            className="rounded-full font-medium px-3 py-0.5 text-xs"
          />
        )}
      </div>

      <div className="text-xs font-semibold text-gray-400 pt-0.5">
        {displayDueDate}
      </div>
    </div>
  );
}
