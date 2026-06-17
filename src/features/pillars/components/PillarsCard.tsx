import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PillarsCardProps {
  category: string;
  className?: string;
}

export const PillarsCard = ({
  category,
  className,
}: PillarsCardProps) => {
  const normalizedCategory = category.toLowerCase().trim();

  let resolvedBg = "bg-slate-50 text-slate-700 border-slate-200";
  let resolvedDot = "bg-slate-400";

  if (normalizedCategory === "education" || normalizedCategory === "educational") {
    resolvedBg = "bg-indigo-50 text-indigo-700 border-indigo-100";
    resolvedDot = "bg-indigo-500";
  } else if (normalizedCategory === "entertainment") {
    resolvedBg = "bg-pink-50 text-pink-700 border-pink-100";
    resolvedDot = "bg-pink-500";
  } else if (normalizedCategory === "lifestyle") {
    resolvedBg = "bg-emerald-50 text-emerald-700 border-emerald-100";
    resolvedDot = "bg-emerald-500";
  } else if (normalizedCategory === "product review" || normalizedCategory === "review") {
    resolvedBg = "bg-amber-50 text-amber-700 border-amber-100";
    resolvedDot = "bg-amber-500";
  } else if (
    normalizedCategory === "behind the scenes" ||
    normalizedCategory === "behind the scene"
  ) {
    resolvedBg = "bg-purple-50 text-purple-700 border-purple-100";
    resolvedDot = "bg-purple-500";
  } else if (normalizedCategory === "promotion") {
    resolvedBg = "bg-red-50 text-red-700 border-red-100";
    resolvedDot = "bg-red-500";
  } else if (normalizedCategory === "beauty") {
    resolvedBg = "bg-pink-50 text-pink-700 border-pink-100";
    resolvedDot = "bg-pink-500";
  } else if (normalizedCategory === "games") {
    resolvedBg = "bg-violet-50 text-violet-700 border-violet-100";
    resolvedDot = "bg-violet-500";
  } else if (normalizedCategory === "tips & tricks") {
    resolvedBg = "bg-green-50 text-green-700 border-green-100";
    resolvedDot = "bg-green-500";
  } else if (normalizedCategory === "live session") {
    resolvedBg = "bg-indigo-50 text-indigo-700 border-indigo-100";
    resolvedDot = "bg-indigo-500";
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-lg px-2 py-0.5 text-[10px] font-semibold border flex items-center gap-1.5 w-fit shadow-none shrink-0",
        resolvedBg,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", resolvedDot)} />
      {category}
    </Badge>
  );
};
