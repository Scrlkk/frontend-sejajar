import { useState, useRef } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Calendar,
  Trash2,
  Video as VideoIcon,
  Image as ImageIcon,
  FileText,
  History as HistoryIcon,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeedbackComment } from "@/features/reviews/components/FeedbackComment";
import type { UploadedMediaItem } from "@/features/tasks/components/Uploads";
import type { DraftsItem } from "@/features/tasks/data/tasksData";
import type { TaskCommentItem } from "@/features/tasks/components/TasksContent";

export interface SubmissionFile {
  version: number;
  filename: string;
  size: string;
  time: string;
  status: string;
  type: string;
}

interface SpesificDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: UploadedMediaItem | DraftsItem | null;
  itemType: "upload" | "draft";
  onSave?: (updatedItem: UploadedMediaItem | DraftsItem) => void;
}

export function SpesificDrawer({
  isOpen,
  onClose,
  item,
  itemType,
  onSave,
}: SpesificDrawerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const itemCategory = item ? (itemType === "draft" ? (item as DraftsItem).category : "Media Asset") : "";
  const itemPlatform = item ? (itemType === "upload" ? (item as UploadedMediaItem).platform : "Web / Document") : "";

  // Fallback states if item is empty
  const [status, setStatus] = useState<string>(() => item?.status || "Pending");
  const [comments, setComments] = useState<TaskCommentItem[]>(() => {
    if (item?.status === "Revision" && item.revisionNote) {
      return [
        {
          id: `comment-rev-${Date.now()}`,
          sender: "Content Lead",
          senderInitials: "CL",
          senderBg: "bg-red-100 text-red-600 border border-red-200",
          text: item.revisionNote,
          timestamp: "2 hours ago",
          isMe: false,
        },
      ];
    }
    return [];
  });

  const [deliverables, setDeliverables] = useState<SubmissionFile[]>(() => {
    if (!item) return [];
    if (itemType === "upload") {
      const u = item as UploadedMediaItem;
      return [
        {
          version: 2,
          filename: `${u.title.toLowerCase().replace(/\s+/g, "_")}_v2.${u.type === "video" ? "mp4" : "jpg"}`,
          size: u.fileSizeText,
          time: u.uploadedTimeText,
          status: u.status,
          type: u.type,
        },
      ];
    } else {
      const d = item as DraftsItem;
      return [
        {
          version: 2,
          filename: `${d.title.toLowerCase().replace(/\s+/g, "_")}_draft_v2.docx`,
          size: `${d.wordCount} words`,
          time: d.savedTimeText,
          status: d.status,
          type: "document",
        },
      ];
    }
  });

  const [history, setHistory] = useState<SubmissionFile[]>(() => {
    if (!item) return [];
    // If status is Revision or Approved, pre-populate older versions in history
    if (item.status === "Revision" || item.status === "Approved" || item.status === "Overdue") {
      if (itemType === "upload") {
        const u = item as UploadedMediaItem;
        return [
          {
            version: 1,
            filename: `${u.title.toLowerCase().replace(/\s+/g, "_")}_v1.${u.type === "video" ? "mp4" : "jpg"}`,
            size: "14.5 MB",
            time: "3 days ago",
            status: "Revision",
            type: u.type,
          },
        ];
      } else {
        const d = item as DraftsItem;
        return [
          {
            version: 1,
            filename: `${d.title.toLowerCase().replace(/\s+/g, "_")}_draft_v1.docx`,
            size: "350 words",
            time: "5 days ago",
            status: "Revision",
            type: "document",
          },
        ];
      }
    }
    return [];
  });

  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);

  if (!item) return null;

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
      if (itemType === "upload") {
        onSave({
          ...item,
          status,
          revisionNote: status === "Approved" ? undefined : item.revisionNote,
        } as UploadedMediaItem);
      } else {
        onSave({
          ...item,
          status,
          revisionNote: status === "Approved" ? undefined : item.revisionNote,
        } as DraftsItem);
      }
    }
    onClose();
  };

  // Mocking new file upload mechanism
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newVersion = deliverables.length > 0 ? deliverables[0].version + 1 : 1;
      
      // Move current deliverables to history
      if (deliverables.length > 0) {
        setHistory((prev) => [deliverables[0], ...prev]);
      }

      // Add new file to deliverables
      const newFileObj = {
        version: newVersion,
        filename: file.name,
        size: itemType === "upload" ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.floor(Math.random() * 200) + 300} words`,
        time: "Just now",
        status: "Pending",
        type: itemType === "upload" ? (file.type.startsWith("image/") ? "image" : "video") : "document",
      };

      setDeliverables([newFileObj]);
      setStatus("Pending"); // Automatically sets status to Pending once a new file is uploaded
    }
  };

  // Status visual mapping with specific active styling rules matching core colors
  const uploadStatuses = [
    {
      key: "Uploading",
      label: "Uploading",
      dotBg: "bg-blue-500",
      activeClass: "bg-blue-50 border-blue-400 text-blue-800 ring-1 ring-blue-400/50 shadow-sm",
    },
    {
      key: "Pending",
      label: "Pending",
      dotBg: "bg-yellow-500",
      activeClass: "bg-yellow-55 border-yellow-400 text-yellow-850 ring-1 ring-yellow-400/50 shadow-sm",
    },
    {
      key: "Revision",
      label: "Revision",
      dotBg: "bg-red-500",
      activeClass: "bg-red-50 border-red-400 text-red-800 ring-1 ring-red-400/50 shadow-sm",
    },
    {
      key: "Approved",
      label: "Approved",
      dotBg: "bg-emerald-500",
      activeClass: "bg-emerald-50 border-emerald-500 text-emerald-850 ring-1 ring-emerald-500/50 shadow-sm",
    },
  ];

  const draftStatuses = [
    {
      key: "Pending",
      label: "Pending",
      dotBg: "bg-yellow-500",
      activeClass: "bg-yellow-55 border-yellow-400 text-yellow-850 ring-1 ring-yellow-400/50 shadow-sm",
    },
    {
      key: "Revision",
      label: "Revision",
      dotBg: "bg-red-500",
      activeClass: "bg-red-50 border-red-400 text-red-800 ring-1 ring-red-400/50 shadow-sm",
    },
    {
      key: "Approved",
      label: "Approved",
      dotBg: "bg-emerald-500",
      activeClass: "bg-emerald-50 border-emerald-500 text-emerald-850 ring-1 ring-emerald-500/50 shadow-sm",
    },
    {
      key: "Overdue",
      label: "Overdue",
      dotBg: "bg-red-600",
      activeClass: "bg-red-105 border-red-500 text-red-650 ring-1 ring-red-500/50 shadow-sm animate-pulse",
    },
  ];

  const statuses = itemType === "upload" ? uploadStatuses : draftStatuses;

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
              {itemType === "upload" ? "Media Submission Workspace" : "Script Submission Workspace"}
            </span>
            <h2 className="text-lg font-semibold text-gray-900 leading-snug mt-0.5 max-w-88 truncate">
              {item.title}
            </h2>
          </div>
        </div>

        {/* Drawer Body Scroll Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 scrollbar-none">
          
          {/* Task Description Mock */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Task Description
            </span>
            <p className="text-xs text-gray-600 leading-relaxed bg-slate-50/50 border border-gray-200 p-3.5 rounded-xl font-medium">
              {itemType === "upload"
                ? `Please review the uploaded media deliverables for the ${itemCategory} campaign on ${itemPlatform}. Double check color grading, voice-overs, and format consistency.`
                : `Draft review workspace for the ${itemCategory} campaign script. Ensure hook and narrative alignment match brand guidelines before approval.`}
            </p>
          </div>

          {/* Badges Section */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="rounded-lg bg-indigo-50 border-indigo-150 text-indigo-700 text-[10px] font-semibold py-0.5 px-2 flex items-center gap-1.5 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
              {itemCategory}
            </Badge>
            {itemType === "upload" && (
              <Badge
                variant="outline"
                className="rounded-lg bg-slate-100 border-slate-200 text-slate-700 text-[10px] font-semibold py-0.5 px-2 flex items-center gap-1.5 shadow-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                {(item as UploadedMediaItem).platform}
              </Badge>
            )}
          </div>

          {/* Submission Status */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
              Submission Status
            </span>
            <div className="inline-flex">
              {(() => {
                const statusInfo = statuses.find((st) => st.key === status) || {
                  key: status,
                  label: status,
                  dotBg: "bg-slate-400",
                  activeClass: "bg-slate-50 border-slate-400 text-slate-800 ring-1 ring-slate-400/50 shadow-sm",
                };
                return (
                  <div
                    className={`rounded-xl border py-2 px-3 text-xs font-semibold flex items-center gap-1.5 ${statusInfo.activeClass}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusInfo.dotBg}`}
                    />
                    {statusInfo.label}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Deadline card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-gray-255 bg-slate-50/30 flex flex-col justify-between h-20 shadow-sm text-gray-700">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Submission Deadline
                </span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-base font-bold">Jul 20, 2026</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-255 bg-slate-50/30 flex flex-col justify-between h-20 shadow-sm text-gray-700">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                {item.assigner ? "Assigned By" : "Submitted By"}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-7 w-7 rounded-full bg-slate-100 border border-white text-[9px] font-bold flex items-center justify-center text-gray-600 shadow-sm">
                  {item.assigner ? item.assigner.initials : "CR"}
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-xs font-bold text-gray-800 truncate">
                    {item.assigner ? item.assigner.name : "Creator User"}
                  </span>
                  <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                    {item.assigner ? item.assigner.role : "Content Creator"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Uploads and Re-uploads Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Submitted File
              </span>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept={itemType === "upload" ? "video/*,image/*" : ".doc,.docx,.pdf,.txt"}
              />
              <button
                type="button"
                onClick={handleUploadClick}
                className="text-[10px] font-bold text-red-800 hover:text-red-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Upload className="h-3 w-3" />
                Re-upload File
              </button>
            </div>

            {deliverables.length > 0 ? (
              <div className="space-y-2">
                {deliverables.map((file, idx) => {
                  const isVideo = file.type === "video";
                  const isDoc = file.type === "document";

                  if (deleteConfirmIndex === idx) {
                    return (
                      <div
                        key={idx}
                        className="flex flex-col border border-red-300 rounded-xl bg-red-100/40 p-3 space-y-2 shadow-sm transition-all duration-300"
                      >
                        <div className="flex items-center gap-2 text-red-850">
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Hapus File?
                          </span>
                        </div>
                        <p className="text-[10px] text-red-650 leading-relaxed font-medium">
                          Apakah Anda yakin ingin menghapus file{" "}
                          <span className="font-bold">"{file.filename}"</span>?
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
                              setDeliverables((prev) => prev.filter((_, i) => i !== idx));
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
                      <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-400">
                        Active Version (v{file.version})
                      </span>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-gray-150">
                            {isDoc ? (
                              <FileText className="h-4 w-4 text-sky-600" />
                            ) : isVideo ? (
                              <VideoIcon className="h-4 w-4 text-violet-600" />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-indigo-600" />
                            )}
                          </div>
                          <div className="min-w-0 leading-tight">
                            <p className="text-xs font-semibold text-gray-800 truncate" title={file.filename}>
                              {file.filename}
                            </p>
                            <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                              {file.size} • {file.time}
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
                <div className="h-10 w-10 rounded-full bg-slate-50 border border-gray-150 flex items-center justify-center text-gray-400 shadow-sm mb-2 shrink-0">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-gray-600">
                  Belum ada file diunggah
                </p>
                <Button
                  onClick={handleUploadClick}
                  variant="outline"
                  className="mt-2.5 h-8 px-3 text-[10px] font-bold border-gray-200"
                >
                  Unggah File Baru
                </Button>
              </div>
            )}
          </div>

          {/* History Log Section */}
          {history.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-gray-400">
                <HistoryIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-wider block">
                  Revisions & Upload History
                </span>
              </div>
              <div className="space-y-2">
                {history.map((hist, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border border-gray-155 rounded-xl bg-slate-50/40 p-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shrink-0 border border-gray-150 text-gray-400 text-xs font-bold">
                        v{hist.version}
                      </div>
                      <div className="min-w-0 leading-tight">
                        <p className="text-xs font-bold text-gray-700 truncate" title={hist.filename}>
                          {hist.filename}
                        </p>
                        <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                          {hist.size} • {hist.time}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-red-50 text-red-650 hover:bg-red-50 border-none font-bold text-[9px] px-2 py-0.5 rounded-full shadow-none shrink-0">
                      {hist.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Comments Thread Section */}
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
            Confirm Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
