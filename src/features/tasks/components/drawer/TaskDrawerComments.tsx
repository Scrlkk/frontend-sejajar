import { AlertTriangle } from "lucide-react";
import { FeedbackComment } from "@/features/reviews/components/FeedbackComment";

interface CommentItem {
  id: string;
  sender: string;
  senderInitials: string;
  senderBg: string;
  text: string;
  timestamp: string;
  isSystem: boolean;
  isMe: boolean;
}

interface TaskDrawerCommentsProps {
  comments: CommentItem[];
  onAddComment: (text: string) => void;
  isRateLimited: boolean;
  retryAfter: number | null;
  onResetRateLimit: () => void;
  onRefetchComments: () => void;
  status: string;
  originalStatus: string;
  hasCommentedThisSession: boolean;
}

export function TaskDrawerComments({
  comments,
  onAddComment,
  isRateLimited,
  retryAfter,
  onResetRateLimit,
  onRefetchComments,
  status,
  originalStatus,
  hasCommentedThisSession,
}: TaskDrawerCommentsProps) {
  const showRevisionWarning =
    status.toLowerCase() === "revision" &&
    originalStatus.toLowerCase() !== "revision" &&
    !hasCommentedThisSession;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
          Feedback Comments Thread
        </span>
        {isRateLimited && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between gap-2.5 shadow-2xs">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="leading-normal">
                Pembaruan otomatis dijeda sementara karena lalu lintas tinggi.
                {retryAfter && ` Coba lagi dalam ${retryAfter} detik.`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onResetRateLimit();
                onRefetchComments();
              }}
              className="px-2.5 py-1 text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors cursor-pointer shrink-0"
            >
              Muat Ulang
            </button>
          </div>
        )}

        {showRevisionWarning && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2 shadow-2xs animate-pulse">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-normal font-semibold">
              Wajib menuliskan feedback revisi di kolom komentar di bawah terlebih dahulu sebelum mengonfirmasi status revisi.
            </span>
          </div>
        )}
      </div>

      <FeedbackComment comments={comments} onAddComment={onAddComment} />
    </div>
  );
}
