import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";

export interface CommentItem {
  id: string | number;
  name: string;
  initials: string;
  avatarBg: string;
  role: string;
  roleBg: string;
  targetContent: string;
  commentText: string;
  date: string;
  isSystem?: boolean;
}

interface RecentCommentsProps {
  comments: CommentItem[];
  title?: string;
  maxHeightClass?: string;
}

export function RecentComments({
  comments,
  title = "Recent Comments",
  maxHeightClass = "max-h-[400px]",
}: RecentCommentsProps) {
  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 space-y-5">

      <CardHeader className="flex flex-row items-center justify-between p-0 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        <span className="text-sm text-gray-400 font-medium">
          {comments.length} total
        </span>
      </CardHeader>

      <CardContent
        className={`p-0 overflow-y-auto pr-1 scroll-smooth ${maxHeightClass} 
        scrollbar-none [&::-webkit-scrollbar]:hidden`}
      >
        {comments.length > 0 ? (
          comments.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 text-sm py-2.5 first:pt-0 last:pb-0 border-b border-gray-100 last:border-none"
            >

              <Avatar
                className={`h-10 w-10 ${
                  item.isSystem
                    ? "bg-slate-100 border border-slate-200 text-slate-500"
                    : item.avatarBg
                } font-semibold flex items-center justify-center text-sm shrink-0 mt-0.5`}
              >
                <AvatarFallback className="bg-transparent">
                  {item.isSystem ? (
                    <Bot className="h-5 w-5" />
                  ) : (
                    item.initials
                  )}
                </AvatarFallback>
              </Avatar>


              <div className="flex-1 min-w-0">

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-900">
                      {item.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`${item.roleBg} font-medium rounded-lg text-xs px-1 py-0 border-none shadow-none`}
                    >
                      {item.role}
                    </Badge>
                  </div>
                  <span className="text-gray-400 text-xs font-medium">
                    {item.date}
                  </span>
                </div>

                <div className="text-sm text-gray-400 font-medium truncate">
                  on {item.targetContent}
                </div>

                <p className="text-gray-600 font-normal leading-relaxed text-sm pt-0.5 wrap-break-word">
                  {item.commentText}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-100 rounded-2xl">
            No recent comments found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
