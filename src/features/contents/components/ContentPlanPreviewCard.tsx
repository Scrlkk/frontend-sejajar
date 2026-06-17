import { Clock } from "lucide-react";
import { differenceInDays } from "date-fns";
import type { ContentPlanCardItem } from "@/features/contents/components/ContentPlan";
import { StatusBadgeContent } from "@/features/pillars/components/StatusBadgeContent";
import { PriorityCard } from "@/features/pillars/components/PriorityCard";

interface ContentPlanPreviewCardProps {
  card: ContentPlanCardItem;
}

export function ContentPlanPreviewCard({ card }: ContentPlanPreviewCardProps) {
  const overdueDays = card.overdue
    ? differenceInDays(new Date(), new Date(card.dueDate))
    : 0;
  const isOverdue = card.overdue && overdueDays > 0;

  return (
    <div
      className={`rounded-xl p-4 flex flex-col gap-2 border transition-all ${
        isOverdue
          ? "bg-red-50/60 border-red-800 outline outline-red-800/10 shadow-sm"
          : "bg-white border-gray-300"
      }`}
    >
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between items-center">
        <span>Content Plan</span>
        {isOverdue && (
          <span className="text-red-800 flex items-center gap-1 font-bold text-[9px] uppercase tracking-wider animate-pulse">
            <Clock className="h-3 w-3 shrink-0" />
            Overdue ({overdueDays}d)
          </span>
        )}
      </span>
      <h4 className="text-sm font-semibold text-slate-900 leading-snug">
        {card.title}
      </h4>
      <div className="flex flex-wrap gap-2 mt-0.5">
        <StatusBadgeContent status={card.status} />
        <PriorityCard priority={card.priority} />
        {isOverdue && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-red-50/50 border-red-200 text-red-800">
            <Clock className="h-2.5 w-2.5 shrink-0" />
            {overdueDays}d overdue (due {card.dueDate})
          </span>
        )}
      </div>
    </div>
  );
}

