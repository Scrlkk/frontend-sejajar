import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TaskCommentItem } from "@/features/tasks/components/TasksContent";

interface FeedbackCommentProps {
  comments: TaskCommentItem[];
  onAddComment: (text: string) => void;
}

export function FeedbackComment({
  comments,
  onAddComment,
}: FeedbackCommentProps) {
  const [newComment, setNewComment] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat list on load or when new comments are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment("");
  };

  return (
    <div className="flex flex-col border border-gray-300 rounded-xl bg-slate-50/30 overflow-hidden h-80 shadow-inner">
      {/* Scrollable messages viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none">
        {comments && comments.length > 0 ? (
          comments.map((comment) => {
            const isMe = comment.isMe;
            return (
              <div
                key={comment.id}
                className={`flex items-start gap-2.5 max-w-[85%] transition-all duration-300 ${
                  isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-[9px] font-bold border shrink-0 border-white shadow-md transition-transform hover:scale-105 ${
                    comment.senderBg
                  }`}
                  title={comment.sender}
                >
                  {comment.senderInitials}
                </div>

                {/* Message Bubble Container */}
                <div
                  className={`flex flex-col space-y-1 ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  {/* Sender Name & Date */}
                  <span
                    className={`text-[9px] font-semibold text-gray-400 uppercase tracking-widest ${
                      isMe ? "text-right" : "text-left"
                    }`}
                  >
                    {comment.sender} • {comment.timestamp}
                  </span>

                  {/* Message Bubble */}
                  <div
                    className={`px-3 py-2 rounded-lg text-xs leading-relaxed shadow-sm font-medium transition-all ${
                      isMe
                        ? "bg-linear-to-br from-red-800 to-red-900 text-white rounded-tr-none border border-red-950/20"
                        : "bg-white text-gray-800 border border-gray-300 rounded-tl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{comment.text}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              No feedback comments yet
            </p>
            <p className="text-[9px] text-gray-400 mt-1 max-w-56 leading-relaxed">
              Type in the box below to start the conversation thread.
            </p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="p-2.5 border-t bg-white flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Type feedback comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 rounded-xl border border-gray-300 bg-slate-50/20 px-3.5 py-2 text-xs focus:outline-none focus:border-red-800 focus:ring-1 focus:ring-red-800/50 transition-all font-medium"
        />
        <Button
          type="submit"
          size="icon"
          className="h-8 w-8 rounded-sm bg-red-800 hover:bg-red-900 text-white transition-all shrink-0 hover:scale-105 active:scale-95 shadow-sm"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}
