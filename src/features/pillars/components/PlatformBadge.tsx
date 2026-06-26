import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getColorToken } from "@/features/pillars/constants/colorPalette";

interface PlatformBadgeProps {
  platform: string;
  colorKey?: string | null;
  className?: string;
  showDot?: boolean;
}

const getPlatformStyle = (platform: string, colorKey?: string | null) => {
  if (colorKey) {
    const token = getColorToken(platform, colorKey);
    return {
      bg: token.badge,
      dot: token.dot,
    };
  }

  const norm = platform.toLowerCase().trim();
  switch (norm) {
    case "instagram":
      return {
        bg: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-50",
        dot: "bg-pink-500",
      };
    case "tiktok":
      return {
        bg: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-50",
        dot: "bg-slate-500",
      };
    case "youtube":
      return {
        bg: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
        dot: "bg-red-500",
      };
    default:
      return {
        bg: "bg-slate-50 text-slate-650 border-slate-150 hover:bg-slate-50",
        dot: "bg-slate-400",
      };
  }
};

export const PlatformBadge = ({
  platform,
  colorKey,
  className,
  showDot = true,
}: PlatformBadgeProps) => {
  if (!platform) return null;
  const style = getPlatformStyle(platform, colorKey);

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full font-medium px-2.5 py-0.5 text-xs flex items-center gap-1.5 w-fit shadow-none border shrink-0",
        style.bg,
        className
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", style.dot)} />
      )}
      {platform}
    </Badge>
  );
};

