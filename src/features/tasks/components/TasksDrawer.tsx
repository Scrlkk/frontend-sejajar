import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Calendar,
  Trash2,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeedbackComment } from "@/features/reviews/components/FeedbackComment";
import type { TaskBoardItem, TaskCommentItem } from "@/features/tasks/components/TasksContent";

interface TasksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskBoardItem | null;
  onSave?: (updatedTask: TaskBoardItem) => void;
}

export function TasksDrawer({
  isOpen,
  onClose,
  task,
  onSave,
}: TasksDrawerProps) {
  // Local states to handle user edits in the drawer, initialized from task prop
  const [status, setStatus] = useState<TaskBoardItem["status"]>(
    () => task?.status || "todo",
  );
  const [deliverables, setDeliverables] = useState<string[]>(
    () => task?.deliverables || [],
  );
  const [comments, setComments] = useState<TaskCommentItem[]>(
    () => task?.comments || [],
  );
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(
    null,
  );

  // Early return if no task is selected
  if (!task) return null;

  const handleAddComment = (text: string) => {
    const newCommentItem: TaskCommentItem = {
      id: `comment-${Date.now()}`,
      sender: "You",
      senderInitials: "YO",
      senderBg: "bg-red-800 text-white",
      text,
      timestamp: "Just now",
      isMe: true,
    };
    setComments((prev) => [...prev, newCommentItem]);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...task,
        status,
        deliverables,
        comments,
        isOverdue: status === "done" ? false : task.isOverdue, // clear overdue state if done
      });
    }
    onClose();
  };

  // Enforce workflow transitions (Finite State Machine)
  const isTransitionAllowed = (
    from: TaskBoardItem["status"],
    to: TaskBoardItem["status"],
  ) => {
    if (from === to) return true; // Can always stay in current state
    switch (from) {
      case "todo":
        return to === "onProgress";
      case "onProgress":
        return to === "pending";
      case "pending":
        return to === "revision" || to === "done";
      case "revision":
        return to === "pending";
      case "done":
      default:
        return false;
    }
  };

  // Status visual mapping with specific active styling rules matching core colors
  const statuses: {
    key: TaskBoardItem["status"];
    label: string;
    dotBg: string;
    activeClass: string;
  }[] = [
    {
      key: "todo",
      label: "To Do",
      dotBg: "bg-slate-400",
      activeClass:
        "bg-slate-50 border-slate-400 text-slate-800 ring-1 ring-slate-400/50 shadow-sm",
    },
    {
      key: "onProgress",
      label: "On Progress",
      dotBg: "bg-amber-500",
      activeClass:
        "bg-amber-50 border-amber-400 text-amber-800 ring-1 ring-amber-400/50 shadow-sm",
    },
    {
      key: "pending",
      label: "Pending",
      dotBg: "bg-purple-500",
      activeClass:
        "bg-purple-50 border-purple-400 text-purple-800 ring-1 ring-purple-400/50 shadow-sm",
    },
    {
      key: "revision",
      label: "Revision",
      dotBg: "bg-red-500",
      activeClass:
        "bg-red-50 border-red-400 text-red-800 ring-1 ring-red-400/50 shadow-sm",
    },
    {
      key: "done",
      label: "Done",
      dotBg: "bg-emerald-500",
      activeClass:
        "bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500/50 shadow-sm",
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="sm:max-w-lg bg-white border-l border-gray-200 shadow-2xl flex flex-col h-screen p-0 outline-none"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-gray-100 shadow-md flex items-center justify-between shrink-0 pr-12">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Task Workspace
            </span>
            <h2 className="text-lg font-semibold text-gray-900 leading-snug mt-0.5 max-w-88 truncate">
              {task.title}
            </h2>
          </div>
        </div>

        {/* Drawer Body Scroll Container */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4.5 scrollbar-none">
          {/* Task Description */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Task Description
            </span>
            <p className="text-xs text-gray-600 leading-relaxed bg-slate-50/50 border border-gray-200 p-3.5 rounded-xl font-medium">
              {task.description ||
                `Task details specifically defined for ${task.assignee}. Complete the assigned activity based on priority guidelines.`}
            </p>
          </div>

          {/* Badges Section */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="rounded-lg bg-indigo-50 border-indigo-150 text-indigo-700 text-[10px] font-semibold py-0.5 px-2 flex items-center gap-1.5 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
              {task.pillar || "Behind the Scenes"}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-lg bg-emerald-50 border-emerald-150 text-emerald-700 text-[10px] font-semibold py-0.5 px-2 flex items-center gap-1.5 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              {task.type}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-lg bg-slate-100 border-slate-200 text-slate-700 text-[10px] font-semibold py-0.5 px-2 flex items-center gap-1.5 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
              {task.role || "Creator"}
            </Badge>
          </div>

          {/* Task Status Selector */}
          <div className="space-y-3">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
              Task Status Selector
            </span>
            <div className="space-y-2">
              {/* 2 columns row for To Do and On Progress */}
              <div className="grid grid-cols-2 gap-2.5">
                {statuses.slice(0, 2).map((st) => {
                  const isSelected = status === st.key;
                  const isAllowed = isTransitionAllowed(task.status, st.key);
                  return (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => setStatus(st.key)}
                      disabled={!isAllowed}
                      className={`rounded-xl border py-2.5 px-4 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? st.activeClass
                          : "bg-white border-gray-250 text-gray-500 hover:bg-slate-50/80 cursor-pointer"
                      } disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-50/30 disabled:border-slate-150 disabled:text-slate-350`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${st.dotBg}`}
                      />
                      {st.label}
                    </button>
                  );
                })}
              </div>

              {/* 2 columns row for Pending and Revision */}
              <div className="grid grid-cols-2 gap-2.5">
                {statuses.slice(2, 4).map((st) => {
                  const isSelected = status === st.key;
                  const isAllowed = isTransitionAllowed(task.status, st.key);
                  return (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => setStatus(st.key)}
                      disabled={!isAllowed}
                      className={`rounded-xl border py-2.5 px-4 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? st.activeClass
                          : "bg-white border-gray-250 text-gray-500 hover:bg-slate-50/80 cursor-pointer"
                      } disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-50/30 disabled:border-slate-150 disabled:text-slate-355`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 ${st.dotBg}`}
                      />
                      {st.label}
                    </button>
                  );
                })}
              </div>

              {/* Full width Done */}
              <div>
                {statuses.slice(4).map((st) => {
                  const isSelected = status === st.key;
                  const isAllowed = isTransitionAllowed(task.status, st.key);
                  return (
                    <div className="w-full flex items-center justify-center">
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => setStatus(st.key)}
                        disabled={!isAllowed}
                        className={`w-56 rounded-xl border py-2.5 px-4 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? st.activeClass
                            : "bg-white border-gray-250 text-gray-500 hover:bg-slate-50/80 cursor-pointer"
                        } disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-50/30 disabled:border-slate-150 disabled:text-slate-355`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${st.dotBg}`}
                        />
                        {st.label}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Deadline and Assigned To Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Deadline */}
            <div
              className={`p-3.5 rounded-xl border flex flex-col justify-between h-20 transition-colors shadow-sm ${
                task.isOverdue && status !== "done"
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-slate-50/30 border-gray-200 text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <div className="flex items-center gap-1.5">
                  <Calendar
                    className={`h-3.5 w-3.5 shrink-0 ${task.isOverdue && status !== "done" ? "text-red-500" : "text-gray-400"}`}
                  />
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider ${
                      task.isOverdue && status !== "done"
                        ? "text-red-800"
                        : "text-gray-400"
                    }`}
                  >
                    Deadline
                  </span>
                </div>
                {task.isOverdue && status !== "done" && (
                  <span className="text-[8px] font-extrabold tracking-wider bg-red-100 text-red-700 px-1 py-0.5 rounded-md uppercase shrink-0 border border-red-200/50 animate-pulse">
                    Overdue
                  </span>
                )}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-base font-bold">
                  {task.date
                    ? task.date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>
            </div>

            {/* Assigned To */}
            <div className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/30 flex flex-col justify-between h-20 shadow-sm">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                Assigned To
              </span>
              <div className="flex items-center gap-2.5 mt-1 min-w-0">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm border border-white ${task.assigneeBg}`}
                >
                  {task.assigneeInitials}
                </div>
                <div className="flex flex-col min-w-0 leading-tight">
                  <span
                    className="text-xs font-bold text-gray-800 truncate"
                    title={task.assignee}
                  >
                    {task.assignee}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold mt-0.5 truncate">
                    {task.role || "Creator"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Deliverables Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Deliverables File
              </span>
            </div>

            {deliverables.length > 0 ? (
              <div className="space-y-2">
                {deliverables.map((file, idx) => {
                  const isVideo = file.endsWith(".mp4");
                  const label =
                    deliverables.length === 2
                      ? idx === 0
                        ? "Draft 1 (Original)"
                        : "Draft 2 (Revision)"
                      : null;

                  if (deleteConfirmIndex === idx) {
                    return (
                      <div
                        key={idx}
                        className="flex flex-col border border-red-300 rounded-xl bg-red-100/40 p-3 space-y-2 shadow-sm transition-all duration-300"
                      >
                        <div className="flex items-center gap-2 text-red-800">
                          <Trash2 className="h-3.5 w-3.5 shrink-0" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Hapus Deliverable?
                          </span>
                        </div>
                        <p className="text-[10px] text-red-600 leading-relaxed font-medium">
                          Apakah Anda yakin ingin menghapus file{" "}
                          <span className="font-bold">"{file}"</span>? Tindakan
                          ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmIndex(null)}
                            className="px-2.5 py-1 text-[10px] font-semibold border border-gray-250 bg-white hover:bg-slate-50 text-gray-750 rounded-md cursor-pointer transition-all shadow-sm"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeliverables((prev) =>
                                prev.filter((_, i) => i !== idx),
                              );
                              setDeleteConfirmIndex(null);
                            }}
                            className="px-2.5 py-1 text-[10px] font-semibold bg-red-700 hover:bg-red-logo text-white rounded-md cursor-pointer transition-all shadow-sm"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="flex flex-col border border-gray-300 rounded-xl bg-white p-3 space-y-1 shadow-sm"
                    >
                      {label && (
                        <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                          {label}
                        </span>
                      )}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-gray-150">
                            {isVideo ? (
                              <VideoIcon className="h-4 w-4 text-violet-600" />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-sky-600" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              {file}
                            </p>
                            <p className="text-[9px] text-gray-400 font-medium">
                              {isVideo
                                ? "Video MP4 • 12.8 MB"
                                : "Image JPG • 2.4 MB"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmIndex(idx)}
                          className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-xl bg-slate-50/10 text-center">
                <div className="h-10 w-10 rounded-full bg-slate-50 border border-gray-150 flex items-center justify-center text-gray-400 shadow-sm mb-3">
                  <VideoIcon className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs font-semibold text-gray-600">
                  No deliverables attached
                </p>
                <p className="text-[9px] text-gray-400 mt-1 max-w-60 leading-relaxed">
                  This task does not have any deliverables marked as complete.
                </p>
              </div>
            )}
          </div>

          {/* Comments Thread Section */}
          <div className="space-y-2 pb-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
              Feedback Comments Thread
            </span>
            <FeedbackComment
              comments={comments}
              onAddComment={handleAddComment}
            />
          </div>
        </div>

        {/* Drawer Footer actions */}
        <div className="p-6 border-t border-gray-150 flex items-center justify-end gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-lg border-gray-200 hover:bg-gray-50 text-gray-750 px-5 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-red-800 hover:bg-red-900 text-white font-semibold px-5 transition-all text-xs cursor-pointer shadow-sm"
          >
            Confirm
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
