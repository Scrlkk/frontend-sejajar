import React, { useRef } from "react";
import {
  FileText,
  Video as VideoIcon,
  Image as ImageIcon,
  Download,
  Trash2,
  AlertTriangle,
  Loader2,
  Upload,
  History as HistoryIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

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

interface TaskDrawerUploadsProps {
  isCaptionTask: boolean;
  deliverables: TaskOutputItem[];
  loadingOutputs: boolean;
  canDelete: boolean;
  canUpload: boolean;
  isApproved: boolean;
  itemType: "upload" | "draft" | null;
  deleteConfirmIndex: number | null;
  setDeleteConfirmIndex: (index: number | null) => void;
  isPendingDelete: boolean;
  onDeleteOutput: (id: number) => void;
  onUploadFile: (formData: FormData) => void;
  isPendingUpload: boolean;
  getFileUrl: (url?: string | null) => string;
  downloadFile: (url: string, name: string) => void;
  history: TaskOutputItem[];
  canSeeHistory: boolean;
  deleteHistoryConfirmId: number | string | null;
  setDeleteHistoryConfirmId: (id: number | string | null) => void;
  formatDate: (dateStr?: string | null) => string;
}

export function TaskDrawerUploads({
  isCaptionTask,
  deliverables,
  loadingOutputs,
  canDelete,
  canUpload,
  isApproved,
  itemType,
  deleteConfirmIndex,
  setDeleteConfirmIndex,
  isPendingDelete,
  onDeleteOutput,
  onUploadFile,
  isPendingUpload,
  getFileUrl,
  downloadFile,
  history,
  canSeeHistory,
  deleteHistoryConfirmId,
  setDeleteHistoryConfirmId,
  formatDate,
}: TaskDrawerUploadsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isCaptionTask) return null;

  const handleUploadClick = () => {
    if (isApproved) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isApproved) return;
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

      if (itemType === "upload") {
        const allowedMedia = [
          ".png",
          ".jpg",
          ".jpeg",
          ".webp",
          ".gif",
          ".mp4",
          ".mpeg",
          ".mov",
          ".webm",
          ".avi",
        ];
        if (!allowedMedia.includes(ext)) {
          toast.error(
            "Format file tidak sesuai. Harap unggah file Video (MP4, MOV, AVI) atau Foto (PNG, JPG, JPEG, GIF, WEBP).",
            { duration: 5000 },
          );
          return;
        }
      } else {
        const allowedDocs = [".pdf", ".doc", ".docx", ".txt"];
        if (!allowedDocs.includes(ext)) {
          toast.error(
            "Format file tidak sesuai. Harap unggah file Dokumen (PDF, DOC, DOCX, TXT).",
            { duration: 5000 },
          );
          return;
        }
      }

      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(
          "Ukuran file melebihi batas maksimal 50MB. Harap pilih file yang lebih kecil.",
          { duration: 5000 },
        );
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      onUploadFile(formData);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Submitted File
            </span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept={
                itemType === "upload"
                  ? "video/*,image/*"
                  : ".doc,.docx,.pdf,.txt"
              }
            />
            {deliverables.length > 0 && !isApproved && canUpload && (
              <button
                type="button"
                disabled={isPendingUpload}
                onClick={handleUploadClick}
                className="text-[10px] font-bold text-red-800 hover:text-red-900 flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
              >
                {isPendingUpload ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Upload className="h-3 w-3" />
                )}
                Re-upload File
              </button>
            )}
          </div>
          <p className="text-[9px] text-gray-400 font-medium">
            {itemType === "upload"
              ? "Mendukung Video (MP4, MOV, AVI) & Gambar (PNG, JPG, JPEG, GIF, WEBP) • Maks 50MB"
              : "Mendukung Dokumen (PDF, DOC, DOCX, TXT) • Maks 50MB"}
          </p>
        </div>

        {loadingOutputs ? (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : deliverables.length > 0 ? (
          <div className="space-y-2">
            {deliverables.map((file, idx) => {
              const filename =
                file.file_url?.split("/").pop() ??
                file.filename ??
                `output-${file.id}`;
              const isVideo =
                file.file_url?.endsWith(".mp4") ||
                file.file_url?.toLowerCase().includes("video");
              const isDoc =
                file.file_url?.endsWith(".doc") ||
                file.file_url?.endsWith(".docx") ||
                file.file_url?.endsWith(".pdf") ||
                file.file_url?.endsWith(".txt");

              const size =
                file.file_size ||
                (isDoc ? "1.2 MB" : isVideo ? "12.5 MB" : "3.4 MB");
              const time =
                file.submitted_at || file.created_at
                  ? formatDate(file.submitted_at || file.created_at)
                  : "Just now";

              if (deleteConfirmIndex === idx) {
                return (
                  <div
                    key={file.id ?? idx}
                    className="flex flex-col border border-red-300 rounded-xl bg-red-100/40 p-3 space-y-2 shadow-sm transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                      <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
                        Hapus File?
                      </span>
                    </div>
                    <p className="text-[10px] text-red-600 leading-relaxed font-medium">
                      Apakah Anda yakin ingin menghapus file{" "}
                      <span className="font-bold">"{filename}"</span>?
                    </p>
                    <div className="flex items-center justify-end gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmIndex(null)}
                        className="px-2.5 py-1 text-[10px] font-semibold border border-gray-200 bg-white hover:bg-slate-50 text-gray-700 rounded-md cursor-pointer transition-all shadow-sm"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        disabled={isPendingDelete || !canDelete}
                        onClick={() => {
                          if (canDelete) {
                            onDeleteOutput(file.id);
                          }
                        }}
                        className="px-2.5 py-1 text-[10px] font-semibold bg-red-700 hover:bg-red-logo text-white rounded-md cursor-pointer transition-all shadow-sm disabled:opacity-50 flex items-center gap-1"
                      >
                        {isPendingDelete && (
                          <Loader2 className="h-3 w-3 animate-spin text-white" />
                        )}
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={file.id ?? idx}
                  className="flex flex-col border border-gray-300 rounded-xl bg-white p-3 space-y-1 shadow-sm"
                >
                  <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-400">
                    Active Version (v{file.version})
                  </span>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-gray-100">
                        {isDoc ? (
                          <FileText className="h-4 w-4 text-sky-600" />
                        ) : isVideo ? (
                          <VideoIcon className="h-4 w-4 text-violet-600" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-indigo-600" />
                        )}
                      </div>
                      <div className="min-w-0 leading-tight">
                        {file.file_url ? (
                          <a
                            href={getFileUrl(file.file_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-gray-800 truncate hover:underline hover:text-red-logo block"
                            title={filename}
                          >
                            {filename}
                          </a>
                        ) : (
                          <p
                            className="text-xs font-semibold text-gray-800 truncate"
                            title={filename}
                          >
                            {filename}
                          </p>
                        )}
                        <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                          V{file.version} • {size} • {time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {file.file_url && (
                        <button
                          type="button"
                          onClick={() =>
                            downloadFile(getFileUrl(file.file_url), filename)
                          }
                          className="h-7 w-7 rounded-lg hover:bg-slate-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Download file"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={!canDelete}
                        onClick={() => setDeleteConfirmIndex(idx)}
                        className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded-xl bg-slate-50/10 text-center">
            <div className="h-10 w-10 rounded-full bg-slate-50 border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm mb-3">
              <Upload className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs font-semibold text-gray-600">
              Belum ada file yang diunggah
            </p>
            <p className="text-[9px] text-gray-400 mt-1 max-w-65 leading-relaxed">
              {itemType === "upload"
                ? "Mendukung format Video (MP4, MOV, AVI) atau Foto (PNG, JPG, JPEG, GIF, WEBP) maksimal 50MB."
                : "Mendukung format Dokumen (PDF, DOC, DOCX, TXT) maksimal 50MB."}
            </p>
            {!isApproved && canUpload && (
              <Button
                onClick={handleUploadClick}
                disabled={isPendingUpload}
                variant="outline"
                className="mt-2.5 h-8 px-3 text-[10px] font-bold border-gray-200"
              >
                {isPendingUpload ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Unggah File Baru"
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      {canSeeHistory && history.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-gray-400">
            <HistoryIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[10px] font-semibold uppercase tracking-wider block">
              Revisions & Upload History
            </span>
          </div>
          <div className="space-y-2">
            {history.map((hist, idx) => {
              const filename =
                hist.file_url?.split("/").pop() ??
                hist.filename ??
                `history-${hist.id}`;
              const isVideo =
                hist.file_url?.endsWith(".mp4") ||
                hist.file_url?.toLowerCase().includes("video");
              const isDoc =
                hist.file_url?.endsWith(".doc") ||
                hist.file_url?.endsWith(".docx") ||
                hist.file_url?.endsWith(".pdf") ||
                hist.file_url?.endsWith(".txt");

              const size =
                hist.file_size ||
                (isDoc ? "1.2 MB" : isVideo ? "12.5 MB" : "3.4 MB");
              const time =
                hist.submitted_at || hist.created_at
                  ? formatDate(hist.submitted_at || hist.created_at)
                  : "Just now";

              return deleteHistoryConfirmId === hist.id ? (
                <div
                  key={hist.id ?? idx}
                  className="flex flex-col border border-red-300 rounded-xl bg-red-50/40 p-3 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-600" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                      Hapus riwayat ini?
                    </span>
                  </div>
                  <p className="text-[10px] text-red-600 leading-relaxed font-medium">
                    File <span className="font-bold">"{filename}"</span> (v
                    {hist.version}) akan dihapus permanen.
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
                  className="flex items-center justify-between border border-gray-100 rounded-xl bg-slate-50/40 p-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shrink-0 border border-gray-100 text-gray-400 text-xs font-bold">
                      v{hist.version}
                    </div>
                    <div className="min-w-0 leading-tight">
                      <p
                        className="text-xs font-bold text-gray-700 truncate"
                        title={filename}
                      >
                        {filename}
                      </p>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                        V{hist.version} • {size} • {time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {hist.file_url && (
                      <button
                        type="button"
                        onClick={() =>
                          downloadFile(getFileUrl(hist.file_url), filename)
                        }
                        className="h-7 w-7 rounded-lg hover:bg-slate-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                        title="Download file"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteHistoryConfirmId(hist.id ?? null)
                        }
                        className="h-7 w-7 rounded-lg hover:bg-red-50 hover:text-red-600 text-gray-400 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
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
