import { Flag, Clock } from "lucide-react";
import { differenceInDays } from "date-fns";
import type { ContentPlanCardItem } from "@/features/contents/components/ContentPlan";

interface ContentPlanPreviewCardProps {
  card: ContentPlanCardItem;
}

const getStatusBadgeStyle = (status: ContentPlanCardItem["status"]) => {
  switch (status) {
    case "On Progress":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Draft":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "Assigned":
      return "bg-blue-50 text-blue-700 border-blue-250";
    case "Review":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Revision":
      return "bg-red-50 text-red-700 border-red-200";
    case "Approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Published":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    default:
      return "bg-slate-50 text-slate-650 border-slate-150";
  }
};

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
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(
            card.status
          )}`}
        >
          <span className="h-1 w-1 rounded-full bg-current shrink-0" />
          {card.status}
        </span>
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            card.priority === "High"
              ? "bg-red-50 text-red-700 border-red-100"
              : card.priority === "Medium"
              ? "bg-amber-50 text-amber-700 border-amber-100"
              : "bg-blue-50 text-blue-700 border-blue-100"
          }`}
        >
          <Flag className="h-2.5 w-2.5 shrink-0" />
          {card.priority}
        </span>
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
