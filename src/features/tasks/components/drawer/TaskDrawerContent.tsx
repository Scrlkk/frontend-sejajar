import { useState } from "react";
import { AlertTriangle, Trash2, Loader2, History as HistoryIcon, Copy, Check } from "lucide-react";

interface TaskOutputItem {
  id: number;
  file_url?: string | null;
  file_size?: string | null;
  submitted_at?: string | null;
  created_at?: string | null;
  filename?: string | null;
  version?: number | null;
  caption?: string | null;
}

interface TaskDrawerContentProps {
  isCaptionTask: boolean;
  captionText: string;
  canDelete: boolean;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  isPendingDelete: boolean;
  onConfirmDelete: () => void;
  history: TaskOutputItem[];
  canSeeHistory: boolean;
  deleteHistoryConfirmId: number | string | null;
  setDeleteHistoryConfirmId: (id: number | string | null) => void;
  onDeleteOutput: (id: number) => void;
  formatDate: (dateStr?: string | null) => string;
}

export function TaskDrawerContent({
  isCaptionTask,
  captionText,
  canDelete,
  showDeleteConfirm,
  setShowDeleteConfirm,
  isPendingDelete,
  onConfirmDelete,
  history,
  canSeeHistory,
  deleteHistoryConfirmId,
  setDeleteHistoryConfirmId,
  onDeleteOutput,
  formatDate,
}: TaskDrawerContentProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  if (!isCaptionTask) return null;

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
            Caption Output
          </span>
          {captionText && canDelete && !showDeleteConfirm && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-400 flex items-center justify-center transition-colors cursor-pointer"
              title="Hapus Caption"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {showDeleteConfirm ? (
          <div className="flex flex-col border border-red-300 rounded-xl bg-red-100/40 p-3 space-y-2 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0" />
              <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
                Hapus Caption?
              </span>
            </div>
            <p className="text-[10px] text-red-600 leading-relaxed font-medium">
              Apakah Anda yakin ingin menghapus output caption ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2.5 py-1 text-[10px] font-semibold border border-gray-200 bg-white hover:bg-slate-50 text-gray-700 rounded-md cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isPendingDelete}
                onClick={onConfirmDelete}
                className="px-2.5 py-1 text-[10px] font-semibold bg-red-700 hover:bg-red-logo text-white rounded-md cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                {isPendingDelete && (
                  <Loader2 className="h-3 w-3 animate-spin text-white" />
                )}
                Hapus
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`w-full bg-slate-50 border border-gray-200 rounded-xl p-3.5 text-xs leading-relaxed font-medium whitespace-pre-wrap h-auto ${
              captionText ? "text-gray-700" : "text-gray-400 italic"
            }`}
          >
            {captionText || "Belum ada caption ditulis"}
          </div>
        )}
      </div>

      {canSeeHistory && history.length > 0 && (
        <div className="space-y-2.5 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-400">
            <HistoryIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[10px] font-semibold uppercase tracking-wider block">
              Revision & Caption History
            </span>
          </div>
          <div className="space-y-3">
            {history.map((hist, idx) => {
              const time = hist.submitted_at || hist.created_at
                ? formatDate(hist.submitted_at || hist.created_at)
                : "Just now";
              const isConfirmingDelete = deleteHistoryConfirmId === hist.id;

              return isConfirmingDelete ? (
                <div
                  key={hist.id ?? idx}
                  className="flex flex-col border border-red-300 rounded-xl bg-red-50/40 p-3 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                      Hapus riwayat caption ini?
                    </span>
                  </div>
                  <p className="text-[10px] text-red-600 leading-relaxed font-medium">
                    Caption versi <span className="font-bold">v{hist.version}</span> akan dihapus secara permanen.
                  </p>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setDeleteHistoryConfirmId(null)}
                      className="px-2.5 py-1 text-[10px] font-semibold border border-gray-200 bg-white hover:bg-slate-50 text-gray-700 rounded-md cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      disabled={isPendingDelete}
                      onClick={() => {
                        onDeleteOutput(hist.id);
                        setDeleteHistoryConfirmId(null);
                      }}
                      className="px-2.5 py-1 text-[10px] font-semibold bg-red-700 hover:bg-red-logo text-white rounded-md cursor-pointer disabled:opacity-50 flex items-center gap-1"
                    >
                      {isPendingDelete && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      )}
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={hist.id ?? idx}
                  className="flex flex-col border border-gray-100 rounded-xl bg-slate-50/40 p-3.5 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700">
                        Version {hist.version}
                      </span>
                      <span className="text-[9px] text-gray-400 font-semibold">
                        • {time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(hist.id, hist.caption || "")}
                        className="h-6 w-6 rounded-lg hover:bg-slate-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                        title="Copy Caption"
                      >
                        {copiedId === hist.id ? (
                          <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => setDeleteHistoryConfirmId(hist.id ?? null)}
                          className="h-6 w-6 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-400 flex items-center justify-center transition-colors cursor-pointer"
                          title="Hapus versi ini"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-white border border-gray-100 rounded-lg p-2.5 text-xs text-gray-600 font-medium leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto">
                    {hist.caption}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
