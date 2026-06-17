import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { differenceInDays } from "date-fns";
import type { ContentPlanCardItem } from "@/features/contents/components/ContentPlan";

interface ContentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: ContentPlanCardItem | null;
}

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
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100">
                    {card.platform}
                  </span>
                )}
                {card.category && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {card.category}
                  </span>
                )}
                {card.format && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-violet-100 text-violet-700">
                    {card.format}
                  </span>
                )}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Overdue Alert Banner */}
            {isOverdue && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-start gap-3 mt-1">
                <Clock className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider">
                    Overdue Alert
                  </h4>
                  <p className="text-xs text-red-700 font-semibold leading-relaxed">
                    This content plan is {overdueDays}{" "}
                    {overdueDays === 1 ? "day" : "days"} overdue! The deadline was{" "}
                    {card.dueDate}.
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold bg-gray-50 text-gray-800">
                      {card.pillar}
                    </span>
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
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${
                      card.priority === "High"
                        ? "bg-red-50 text-red-700 border-red-100"
                        : card.priority === "Medium"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-blue-50 text-blue-700 border-blue-100"
                    }`}
                  >
                    <span className="h-1 w-1 rounded-full bg-current shrink-0" />
                    {card.priority}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`space-y-1 p-2 rounded-lg transition-all col-span-2 ${
                isOverdue ? "bg-red-50/50 border border-red-105 text-red-850" : ""
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isOverdue ? "text-red-800" : "text-gray-400"
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
                  {card.dueDate || "-"} {isOverdue && `(${overdueDays}d overdue)`}
                </p>
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
                    card.status === "Revision" ? "text-red-800" : "text-slate-655"
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
                    card.status === "Revision" ? "text-red-750" : "text-slate-600"
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
