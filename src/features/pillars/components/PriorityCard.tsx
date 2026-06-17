import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Flag } from "lucide-react";

interface PriorityCardProps {
  priority: string;
  className?: string;
}

export const PriorityCard = ({
  priority,
  className,
}: PriorityCardProps) => {
  const normPriority = priority.toLowerCase().trim();

  let resolvedColor = "bg-blue-50 text-blue-700 border-blue-100";

  if (normPriority === "high") {
    resolvedColor = "bg-red-50 text-red-700 border-red-100";
  } else if (normPriority === "medium") {
    resolvedColor = "bg-amber-50 text-amber-700 border-amber-100";
  } else if (normPriority === "low") {
    resolvedColor = "bg-blue-50 text-blue-700 border-blue-100";
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-lg px-2 py-0.5 text-[10px] font-semibold border flex items-center gap-1 w-fit capitalize",
        resolvedColor,
        className,
      )}
    >
      <Flag className="h-2.5 w-2.5 shrink-0" />
      {priority}
    </Badge>
  );
};
