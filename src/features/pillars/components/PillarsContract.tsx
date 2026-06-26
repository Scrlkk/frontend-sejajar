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
  if (!status) return null;
  const normalizedStatus = status.trim().toLowerCase();

  let displayStatus = status;
  let resolvedBg = "bg-gray-50 text-gray-500 border border-gray-200";
  let resolvedDot = "bg-gray-400";

  if (normalizedStatus === "active") {
    displayStatus = "Active";
    resolvedBg = "bg-green-50 text-green-600 hover:bg-green-50 border border-green-100";
    resolvedDot = "bg-green-500";
  } else if (normalizedStatus === "completed" || normalizedStatus === "complete") {
    displayStatus = "Completed";
    resolvedBg = "bg-blue-50 text-blue-600 hover:bg-blue-50 border border-blue-100";
    resolvedDot = "bg-blue-500";
  } else if (normalizedStatus === "overdue") {
    displayStatus = "Overdue";
    resolvedBg = "bg-red-50 text-red-650 hover:bg-red-50 border border-red-100";
    resolvedDot = "bg-red-500";
  } else if (normalizedStatus === "cancel" || normalizedStatus === "cancelled" || normalizedStatus === "canceled") {
    displayStatus = "Cancel";
    resolvedBg = "bg-gray-50 text-gray-500 hover:bg-gray-50 border border-gray-200";
    resolvedDot = "bg-gray-400";
  }

  const isOverdue = normalizedStatus === "overdue";

  return (
    <Badge
      className={cn(
        resolvedBg,
        "rounded-lg font-bold px-2.5 py-0.5 shadow-none flex items-center gap-1.5 ml-1",
        isOverdue && "animate-pulse",
        className
      )}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${resolvedDot} shrink-0`} />
      {displayStatus}
    </Badge>
  );
};
