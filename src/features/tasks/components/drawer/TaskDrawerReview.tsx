import {
  Loader2,
  FileText,
  Video as VideoIcon,
  Image as ImageIcon,
  Download,
} from "lucide-react";
interface SiblingOutputItem {
  id: number;
  file_url?: string | null;
  file_size?: string | null;
  submitted_at?: string | null;
  created_at?: string | null;
  version?: number | null;
  caption?: string | null;
  assignee_name?: string | null;
  task_title?: string | null;
  assignee_role?: string | null;
}

interface TaskDrawerReviewProps {
  otherTasksOutputs: SiblingOutputItem[];
  loadingOtherOutputs: boolean;
  getFileUrl: (url?: string | null) => string;
  downloadFile: (url: string, name: string) => void;
  formatDate: (dateStr?: string | null) => string;
}

export function TaskDrawerReview({
  otherTasksOutputs,
  loadingOtherOutputs,
  getFileUrl,
  downloadFile,
  formatDate,
}: TaskDrawerReviewProps) {
  return (
    <div className="space-y-4 border-t border-gray-100 pt-4">
      <div className="space-y-3 border-t border-gray-100 pt-4">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
          Deliverables Other Tasks
        </span>

        {loadingOtherOutputs ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : otherTasksOutputs.length > 0 ? (
          <div className="space-y-2">
            {otherTasksOutputs.map((output) => {
              const isSosmed = output.assignee_role === "admin_social_media";
              const isVideo =
                output.file_url?.endsWith(".mp4") ||
                output.file_url?.toLowerCase().includes("video");
              const isDoc =
                output.file_url?.endsWith(".doc") ||
                output.file_url?.endsWith(".docx") ||
                output.file_url?.endsWith(".pdf") ||
                output.file_url?.endsWith(".txt");
              const filename =
                output.file_url?.split("/").pop() ?? `output-${output.id}`;

              const size =
                output.file_size ||
                (isDoc ? "1.2 MB" : isVideo ? "12.5 MB" : "3.4 MB");
              const time =
                output.submitted_at || output.created_at
                  ? formatDate(output.submitted_at || output.created_at)
                  : "Just now";

              if (isSosmed) {
                return (
                  <div
                    key={output.id}
                    className="flex flex-col border border-indigo-100 rounded-xl bg-indigo-50/40 p-3 space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider">
                        Caption Publish
                      </span>
                      <span className="text-[9px] text-gray-400 font-medium">
                        V{output.version || 1} • {time}
                      </span>
                    </div>

                    <div className="w-full bg-white border border-indigo-100 rounded-lg p-2.5 text-xs text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                      {output.caption || "Tidak ada teks caption"}
                    </div>

                    <div className="border-t border-indigo-100 pt-1.5 flex flex-col gap-0.5">
                      <p className="text-[10px] text-gray-500 font-medium truncate">
                        Oleh:{" "}
                        <span className="font-semibold text-gray-700">
                          {output.assignee_name}
                        </span>
                        <span className="text-gray-300 mx-1 select-none">
                          •
                        </span>
                        {output.assignee_role
                          ?.replace(/_/g, " ")
                          .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                      </p>
                      <p className="text-[9px] text-gray-400 font-medium truncate">
                        Tugas: "{output.task_title}"
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={output.id}
                  className="flex flex-col border border-gray-300 rounded-xl bg-white p-3 space-y-2.5 shadow-sm"
                >
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
                      <div className="min-w-0">
                        <a
                          href={getFileUrl(output.file_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-gray-800 truncate hover:underline hover:text-red-logo block"
                        >
                          {output.caption || filename}
                        </a>
                        <p className="text-[9px] text-gray-400 font-medium mt-0.5">
                          V{output.version || 1} • {size} • {time}
                        </p>
                      </div>
                    </div>
                    {output.file_url && (
                      <button
                        type="button"
                        onClick={() =>
                          downloadFile(getFileUrl(output.file_url), filename)
                        }
                        className="h-7 w-7 rounded-lg hover:bg-slate-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="Download file"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex flex-col gap-1">
                    <p className="text-[10px] text-gray-500 font-medium truncate">
                      Oleh:{" "}
                      <span className="font-semibold text-gray-700">
                        {output.assignee_name}
                      </span>
                      <span className="text-gray-300 mx-1 select-none">•</span>
                      {output.assignee_role
                        ?.replace(/_/g, " ")
                        .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </p>
                    <p className="text-[9px] text-gray-400 font-medium truncate">
                      Tugas: "{output.task_title}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 border border-dashed border-gray-200 rounded-xl bg-slate-50/10 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Tidak ada deliverable dari tugas lain
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
