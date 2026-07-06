import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

interface TaskDrawerContentProps {
  isCaptionTask: boolean;
  captionText: string;
  canDelete: boolean;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  isPendingDelete: boolean;
  onConfirmDelete: () => void;
}

export function TaskDrawerContent({
  isCaptionTask,
  captionText,
  canDelete,
  showDeleteConfirm,
  setShowDeleteConfirm,
  isPendingDelete,
  onConfirmDelete,
}: TaskDrawerContentProps) {
  if (!isCaptionTask) return null;

  return (
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
  );
}
