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
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface TasksModalAddProps {
  isOpen: boolean;
  onClose: () => void;
  card: ContentPlanCardItem | null;
  onSaveSingle?: (
    cardId: string,
    idx: number,
    taskData: { title: string; description: string; deadline: string },
  ) => Promise<void> | void;
}

const formatRoleLabel = (role?: string) => {
  if (!role) return "Assigned Member";
  const mapping: Record<string, string> = {
    superadmin: "Super Admin",
    owner: "Owner",
    content_lead: "Content Lead",
    content_editor: "Content Editor",
    script_writer: "Script Writer",
    admin_social_media: "Social Media Admin",
  };
  return mapping[role.toLowerCase()] || role.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

const formatDateToInput = (dateStr?: string | null) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
  } catch {
    // ignore
  }
  return "";
};

export function TasksModalAdd({
  isOpen,
  onClose,
  card,
  onSaveSingle,
}: TasksModalAddProps) {
  // State to store task title, description, and deadline for each member.
  const [memberTasks, setMemberTasks] = useState<
    Record<number, { title: string; description: string; deadline: string }>
  >(() => {
    const initialTasks: Record<number, { title: string; description: string; deadline: string }> =
      {};
    card?.assignedTeam?.forEach((_, idx) => {
      const existing = card.tasks?.[idx];
      const isPlaceholder = existing?.title === "Persiapan Konten";
      
      let deadlineVal = "";
      if (existing?.deadline) {
        deadlineVal = formatDateToInput(existing.deadline);
      } else if (card.dueDate) {
        deadlineVal = formatDateToInput(card.dueDate);
      }

      initialTasks[idx] = {
        title: isPlaceholder ? "" : existing?.title || "",
        description: isPlaceholder ? "" : existing?.description || "",
        deadline: deadlineVal,
      };
    });
    return initialTasks;
  });

  // Track initial tasks to compare and detect changes
  const [initialTasksState, setInitialTasksState] = useState<
    Record<number, { title: string; description: string; deadline: string; exists: boolean }>
  >(() => {
    const initialTasks: Record<number, { title: string; description: string; deadline: string; exists: boolean }> =
      {};
    card?.assignedTeam?.forEach((_, idx) => {
      const existing = card.tasks?.[idx];
      const isPlaceholder = existing?.title === "Persiapan Konten";

      let deadlineVal = "";
      if (existing?.deadline) {
        deadlineVal = formatDateToInput(existing.deadline);
      } else if (card.dueDate) {
        deadlineVal = formatDateToInput(card.dueDate);
      }

      initialTasks[idx] = {
        title: isPlaceholder ? "" : existing?.title || "",
        description: isPlaceholder ? "" : existing?.description || "",
        deadline: deadlineVal,
        exists: !!existing && !isPlaceholder,
      };
    });
    return initialTasks;
  });

  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  // Early return after hook declarations to follow Rules of Hooks
  if (!card) return null;

  const handleTaskChange = (
    idx: number,
    field: "title" | "description" | "deadline",
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

  const handleSaveSingle = async (idx: number) => {
    const task = memberTasks[idx];
    if (!task) return;

    if (!task.title?.trim() || !task.description?.trim() || !task.deadline?.trim()) {
      toast.error("Judul, deskripsi, dan tenggat waktu tugas harus diisi");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [idx]: true }));
    try {
      if (onSaveSingle) {
        await onSaveSingle(card.id, idx, task);
      }
      setInitialTasksState((prev) => ({
        ...prev,
        [idx]: { ...task, exists: true },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [idx]: false }));
    }
  };

  const isTaskChanged = (idx: number) => {
    const current = memberTasks[idx];
    const init = initialTasksState[idx];
    if (!current || !init) return false;
    return (
      current.title?.trim() !== init.title?.trim() ||
      current.description?.trim() !== init.description?.trim() ||
      current.deadline?.trim() !== init.deadline?.trim()
    );
  };

  const hasExistingTask = (idx: number) => {
    const init = initialTasksState[idx];
    return !!init?.exists;
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
        <div className="flex flex-col flex-1 overflow-hidden min-h-0">
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
                      deadline: "",
                    };
                    const isChanged = isTaskChanged(idx);
                    const hasExisting = hasExistingTask(idx);
                    const isLoading = loadingStates[idx] || false;

                    let buttonText = "Kirim Tugas";
                    let isButtonDisabled = !task.title?.trim() || !task.description?.trim() || !task.deadline?.trim() || isLoading;

                    if (hasExisting) {
                      if (isChanged) {
                        buttonText = "Perbarui Tugas";
                      } else {
                        buttonText = "Terkirim";
                        isButtonDisabled = true;
                      }
                    }

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
                            <p className="text-[9px] text-gray-400 font-semibold tracking-wider">
                              {formatRoleLabel(member.role)}
                            </p>
                          </div>
                        </div>

                        {/* Title, Deadline, and Description Inputs */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                htmlFor={`deadline-${idx}`}
                                className="text-[10px] font-semibold uppercase tracking-wider text-gray-500"
                              >
                                Task Deadline <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id={`deadline-${idx}`}
                                type="date"
                                value={task.deadline}
                                onChange={(e) =>
                                  handleTaskChange(idx, "deadline", e.target.value)
                                }
                                required
                                className="rounded-lg border-gray-200 bg-white py-2 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs transition-colors"
                              />
                            </div>
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

                        {/* Card Submit Action */}
                        <div className="flex justify-end pt-1">
                          <Button
                            type="button"
                            onClick={() => handleSaveSingle(idx)}
                            disabled={isButtonDisabled}
                            className={`rounded-lg font-semibold px-4 py-1.5 h-8 text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                              hasExisting && !isChanged
                                ? "bg-emerald-50 border border-emerald-200 text-emerald-700 disabled:opacity-100"
                                : "bg-red-800 hover:bg-red-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            }`}
                          >
                            {isLoading && <Loader2 className="h-3 w-3 animate-spin shrink-0" />}
                            <span>{buttonText}</span>
                          </Button>
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
              className="rounded-lg border-gray-200 hover:bg-gray-50 text-gray-700 px-5 text-xs font-semibold cursor-pointer"
            >
              Tutup
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
