import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentPlanPreviewCard } from "@/features/contents/components/ContentPlanPreviewCard";
import type { ContentPlanCardItem } from "@/features/contents/components/ContentPlan";
import { useState } from "react";

interface TasksModalAddProps {
  isOpen: boolean;
  onClose: () => void;
  card: ContentPlanCardItem | null;
  onSave?: (
    cardId: string,
    memberTasks: Record<number, { title: string; description: string }>,
  ) => void;
}

export function TasksModalAdd({
  isOpen,
  onClose,
  card,
  onSave,
}: TasksModalAddProps) {
  // State to store task title and description for each member.
  // Initialized dynamically from the card prop.
  const [memberTasks, setMemberTasks] = useState<
    Record<number, { title: string; description: string }>
  >(() => {
    const initialTasks: Record<number, { title: string; description: string }> =
      {};
    card?.assignedTeam?.forEach((_, idx) => {
      const existing = card.tasks?.[idx];
      initialTasks[idx] = {
        title: existing?.title || "",
        description: existing?.description || "",
      };
    });
    return initialTasks;
  });

  // Early return after hook declarations to follow Rules of Hooks
  if (!card) return null;

  const handleTaskChange = (
    idx: number,
    field: "title" | "description",
    value: string,
  ) => {
    setMemberTasks((prev) => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        [field]: value,
      },
    }));
  };

  const isSaveDisabled =
    !card.assignedTeam ||
    card.assignedTeam.length === 0 ||
    card.assignedTeam.some((_, idx) => {
      const task = memberTasks[idx];
      return !task || !task.title?.trim() || !task.description?.trim();
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(card.id, memberTasks);
    }
    console.log("Saving tasks for card:", card.id, memberTasks);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-160 max-h-[90vh] flex flex-col rounded-2xl border border-gray-100 bg-white px-6 shadow-2xl outline-none">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Assign Tasks to Team
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            Create specific tasks for each assigned team member of this content
            plan.
          </p>
        </DialogHeader>

        {/* Scrollable Container */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden min-h-0"
        >
          <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-1.5 scrollbar-none">
            {/* Content Plan Preview Card */}
            <div>
              <ContentPlanPreviewCard card={card} />
            </div>

            <hr className="border-gray-150" />

            {/* Member Tasks Section */}
            <div className="space-y-5">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Team Tasks Assignment
              </h4>

              {card.assignedTeam && card.assignedTeam.length > 0 ? (
                <div className="space-y-6">
                  {card.assignedTeam.map((member, idx) => {
                    const task = memberTasks[idx] || {
                      title: "",
                      description: "",
                    };
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-gray-300 bg-slate-50/40 space-y-4"
                      >
                        {/* Member Header */}
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shrink-0 ${member.avatarBg}`}
                          >
                            {member.initials}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800 leading-tight">
                              {member.name}
                            </p>
                            <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                              Assigned Member
                            </p>
                          </div>
                        </div>

                        {/* Title and Description Inputs */}
                        <div className="space-y-3">
                          <div className="space-y-1.5 flex flex-col">
                            <Label
                              htmlFor={`title-${idx}`}
                              className="text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                            >
                              Task Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`title-${idx}`}
                              placeholder={`e.g. Scriptwriting / Shooting for ${member.name}`}
                              value={task.title}
                              onChange={(e) =>
                                handleTaskChange(idx, "title", e.target.value)
                              }
                              required
                              className="rounded-lg border-gray-200 bg-white py-2 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs transition-colors"
                            />
                          </div>

                          <div className="space-y-1.5 flex flex-col">
                            <Label
                              htmlFor={`desc-${idx}`}
                              className="text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                            >
                              Task Description{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <textarea
                              id={`desc-${idx}`}
                              placeholder={`Describe what ${member.name} needs to do...`}
                              value={task.description}
                              onChange={(e) =>
                                handleTaskChange(
                                  idx,
                                  "description",
                                  e.target.value,
                                )
                              }
                              required
                              className="flex min-h-20 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl">
                  <p className="text-xs text-gray-400 font-medium">
                    No team members assigned to this content plan.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <DialogFooter className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 sm:space-x-0 shrink-0 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-lg border-gray-200 hover:bg-gray-50 text-gray-750 px-5 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaveDisabled}
              className="rounded-lg bg-red-800 hover:bg-red-900 text-white font-semibold px-5 transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Tasks
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
