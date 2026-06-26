import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getColorToken } from "@/features/pillars/constants/colorPalette";

interface PillarsCardProps {
  /** Display name of the category */
  category: string;
  /** Stable database id — preferred key for color hashing */
  categoryId?: number;
  className?: string;
  colorKey?: string | null;
}

export const PillarsCard = ({
  category,
  categoryId,
  className,
  colorKey,
}: PillarsCardProps) => {
  // Prefer numeric id (stable) over name (may change) for color hashing
  const color = getColorToken(categoryId ?? category, colorKey);

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-lg px-2 py-0.5 text-[10px] font-semibold border flex items-center gap-1.5 w-fit shadow-none shrink-0",
        color.badge,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", color.dot)} />
      {category}
    </Badge>
  );
};
