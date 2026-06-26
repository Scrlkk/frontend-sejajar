import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeContentProps {
  status: string;
  className?: string;
}

const getStatusBadgeStyle = (status: string) => {
  let normStatus = status.trim().toLowerCase();
  if (normStatus === "todo" || normStatus === "to do") {
    normStatus = "to_do";
  }
  if (normStatus === "on progress" || normStatus === "onprogress" || normStatus === "onprogress") {
    normStatus = "on_progress";
  }
  switch (normStatus) {
    case "to_do":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "scheduled":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "on_progress":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "pending":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "revision":
      return "bg-red-50 text-red-700 border-red-200";
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "published":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "draft":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "assigned":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "review":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

const formatStatusLabel = (status: string) => {
  const normStatus = status.trim().toLowerCase();
  if (normStatus === "to_do" || normStatus === "todo" || normStatus === "to do") {
    return "To Do";
  }
  if (normStatus === "on_progress" || normStatus === "on progress" || normStatus === "onprogress") {
    return "On Progress";
  }
  if (normStatus === "pending" || normStatus === "review") {
    return "Review";
  }
  // Capitalize first letter for others
  return normStatus.charAt(0).toUpperCase() + normStatus.slice(1);
};

export const StatusBadgeContent = ({
  status,
  className,
}: StatusBadgeContentProps) => {
  if (!status) return null;

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] font-semibold border flex items-center gap-1.5 w-fit shadow-none shrink-0",
        getStatusBadgeStyle(status),
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
      {formatStatusLabel(status)}
    </Badge>
  );
};
