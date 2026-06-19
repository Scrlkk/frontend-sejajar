import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";
import { differenceInDays } from "date-fns";
import type { ContentPlanCardItem } from "@/features/contents/components/ContentPlan";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";
import { PriorityCard } from "@/features/pillars/components/PriorityCard";
import { FormatBadgeContent } from "@/features/pillars/components/FormatBadgeContent";
import { PlatformBadge } from "@/features/pillars/components/PlatformBadge";

interface ContentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: ContentPlanCardItem | null;
}

const getStatusBadgeStyle = (status: ContentPlanCardItem["status"]) => {
  switch (status) {
    case "Draft":
      return {
        dot: "bg-slate-500",
        bg: "bg-slate-50 text-slate-600 border-slate-200",
      };
    case "Assigned":
      return {
        dot: "bg-blue-600",
        bg: "bg-blue-50 text-blue-600 border-blue-200",
      };
    case "On Progress":
      return {
        dot: "bg-amber-600",
        bg: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "Review":
      return {
        dot: "bg-purple-600",
        bg: "bg-purple-50 text-purple-600 border-purple-200",
      };
    case "Revision":
      return { dot: "bg-red-600", bg: "bg-red-50 text-red-600 border-red-200" };
    case "Approved":
      return {
        dot: "bg-emerald-600",
        bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
      };
    case "Published":
      return {
        dot: "bg-cyan-600",
        bg: "bg-cyan-50 text-cyan-600 border-cyan-200",
      };
    default:
      return {
        dot: "bg-slate-500",
        bg: "bg-slate-50 text-slate-600 border-slate-200",
      };
  }
};

export function ContentDetailModal({
  isOpen,
  onClose,
  card,
}: ContentDetailModalProps) {
  if (!card) return null;

  const overdueDays = card.overdue
    ? differenceInDays(new Date(), new Date(card.dueDate))
    : 0;
  const isOverdue = card.overdue && overdueDays > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-140 max-h-[90vh] flex flex-col rounded-2xl border border-gray-100 bg-white px-6 shadow-2xl outline-none">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Content Plan Details
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            View the full details of this content plan below.
          </p>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1.5 scrollbar-none">
            {/* Main Title and Badge Info */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900 leading-snug">
                {card.title}
              </h3>
              <div className="flex flex-wrap gap-2 items-center">
                {card.platform && (
                  <PlatformBadge platform={card.platform} showDot={false} />
                )}
                {card.category && <PillarsCard category={card.category} />}
                {card.format && <FormatBadgeContent format={card.format} />}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Overdue Alert Banner */}
            {isOverdue && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-start gap-3 mt-1 animate-pulse">
                <Clock className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider">
                    Overdue Alert
                  </h4>
                  <p className="text-xs text-red-700 font-semibold leading-relaxed">
                    This content plan is {overdueDays}{" "}
                    {overdueDays === 1 ? "day" : "days"} overdue! The deadline
                    was {card.dueDate}.
                  </p>
                </div>
              </div>
            )}

            {/* Grid Info */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Objective
                </span>
                <p className="text-xs text-gray-700 font-medium">
                  {card.objective || "-"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Target Audience
                </span>
                <p className="text-xs text-gray-700 font-medium">
                  {card.targetAudience || "-"}
                </p>
              </div>

              {/* Content Pillar */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Content Pillar
                </span>
                <div>
                  {card.pillar ? (
                    <PillarsCard category={card.pillar} />
                  ) : (
                    <p className="text-xs text-gray-400 font-medium">None</p>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Priority
                </span>
                <div>
                  <PriorityCard priority={card.priority} />
                </div>
              </div>

              <div>
                {/* Status */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </span>
                  <div>
                    <Badge
                      variant="outline"
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1.5 border shadow-none w-fit ${getStatusBadgeStyle(card.status).bg}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${getStatusBadgeStyle(card.status).dot}`}
                      />
                      {card.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div
                className={`space-y-1 p-2.5 rounded-xl border transition-all ${
                  isOverdue
                    ? "bg-red-50/50 border-red-105 text-red-850"
                    : "bg-slate-50/20 border-slate-100/70"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isOverdue ? "text-red-800" : "text-gray-450"
                  }`}
                >
                  Deadline
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isOverdue && (
                    <Clock className="h-3.5 w-3.5 text-red-700 shrink-0" />
                  )}
                  <p
                    className={`text-xs font-semibold ${isOverdue ? "text-red-700" : "text-gray-700"}`}
                  >
                    {card.dueDate || "-"}{" "}
                    {isOverdue && `(${overdueDays}d overdue)`}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Production Notes & References
              </span>
              <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100/80">
                <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {card.notes || "No production notes provided."}
                </p>
              </div>
            </div>

            {/* Published Content URL */}
            {card.status === "Published" && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Published Content URL
                </span>
                {card.fileUrl ? (
                  <a
                    href={card.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 w-full bg-cyan-50/50 border border-cyan-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100/60 hover:border-cyan-300 transition-all group"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-cyan-500 group-hover:text-cyan-700 transition-colors" />
                    <span className="truncate">{card.fileUrl}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2 bg-gray-50/50 border border-gray-100 rounded-xl px-3 py-2.5">
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                    <span className="text-xs text-gray-400 italic">No URL provided yet.</span>
                  </div>
                )}
              </div>
            )}

            {/* Revision Feedback */}
            {card.feedback && (
              <div
                className={`border rounded-xl p-3.5 space-y-1.5 mt-2 ${
                  card.status === "Revision"
                    ? "bg-red-50/20 border-red-100"
                    : "bg-slate-50/50 border-slate-200"
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 font-semibold text-[10px] uppercase tracking-wider ${
                    card.status === "Revision"
                      ? "text-red-800"
                      : "text-slate-655"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      card.status === "Revision"
                        ? "bg-red-600 animate-pulse"
                        : "bg-slate-400"
                    }`}
                  />
                  {card.status === "Revision"
                    ? "Revision Feedback"
                    : "Previous Revision Feedback"}
                </div>
                <p
                  className={`text-xs font-semibold leading-relaxed ${
                    card.status === "Revision"
                      ? "text-red-750"
                      : "text-slate-600"
                  }`}
                >
                  {card.feedback}
                </p>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <DialogFooter className="pt-4 border-t border-gray-100 flex items-center justify-end shrink-0 mt-2">
            <Button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-950 hover:bg-gray-800 text-white font-semibold px-5 py-2 text-xs cursor-pointer h-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
