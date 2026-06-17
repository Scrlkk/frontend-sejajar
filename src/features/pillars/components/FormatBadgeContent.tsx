import { Badge } from "@/components/ui/badge";
import { Image, Video } from "lucide-react";

interface FormatBadgeContentProps {
  format: string;
  className?: string;
}

export function FormatBadgeContent({ format, className = "" }: FormatBadgeContentProps) {
  if (!format) return null;
  const isImage = format.toLowerCase() === "image";

  return (
    <Badge
      variant="outline"
      className={`bg-violet-50 text-violet-700 border border-violet-100 rounded-lg px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1 w-fit shrink-0 ${className}`}
    >
      {isImage ? (
        <Image className="h-2.5 w-2.5 shrink-0" />
      ) : (
        <Video className="h-2.5 w-2.5 shrink-0" />
      )}
      {format}
    </Badge>
  );
}
