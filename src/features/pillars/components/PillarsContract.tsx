import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PillarsContractProps {
  status: string;
  className?: string;
}

export const PillarsContract = ({
  status,
  className,
}: PillarsContractProps) => {
  const displayStatus = status === "Canceled" ? "Cancel" : status;

  let resolvedBg = "bg-gray-50 text-gray-500 border border-gray-200";
  let resolvedDot = "bg-gray-400";

  if (displayStatus === "Active") {
    resolvedBg = "bg-green-100 text-green-600 hover:bg-green-100";
    resolvedDot = "bg-green-500";
  } else if (displayStatus === "Completed" || displayStatus === "Complete") {
    resolvedBg = "bg-blue-100 text-blue-600 hover:bg-blue-100";
    resolvedDot = "bg-blue-500";
  } else if (displayStatus === "Overdue") {
    resolvedBg = "bg-red-100 text-red-600 hover:bg-red-100";
    resolvedDot = "bg-red-500";
  }

  const isOverdue = displayStatus === "Overdue";

  return (
    <Badge
      className={cn(
        resolvedBg,
        "rounded-lg font-bold px-2.5 py-0.5 border-none shadow-none flex items-center gap-1.5 ml-1",
        isOverdue && "animate-pulse",
        className
      )}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${resolvedDot} shrink-0`} />
      {displayStatus}
    </Badge>
  );
};
