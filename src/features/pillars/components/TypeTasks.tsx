import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clapperboard, PenLine, Hash } from "lucide-react";

interface TypeTasksProps {
  type: string;
  className?: string;
}

const getTypeTaskStyle = (type: string) => {
  const normType = type.toLowerCase().trim();
  if (normType === "production" || normType === "editor") {
    return {
      bg: "bg-red-100 text-red-700 hover:bg-red-100",
      icon: Clapperboard,
    };
  } else if (normType === "script") {
    return {
      bg: "bg-amber-100 text-amber-700 hover:bg-amber-100",
      icon: PenLine,
    };
  } else if (normType === "caption") {
    return {
      bg: "bg-violet-100 text-violet-700 hover:bg-violet-100",
      icon: Hash,
    };
  }
  return {
    bg: "bg-slate-100 text-slate-600 hover:bg-slate-100",
    icon: Clapperboard,
  };
};

export function TypeTasks({ type, className }: TypeTasksProps) {
  const style = getTypeTaskStyle(type);
  const TypeIcon = style.icon;

  let displayType = type;
  if (type.toLowerCase().trim() === "production") {
    displayType = "Editor";
  }

  return (
    <Badge
      className={cn(
        style.bg,
        "rounded-md font-medium text-[10px] px-2 py-0.5 border-none shadow-none flex items-center gap-1 w-fit",
        className
      )}
    >
      <TypeIcon className="h-3 w-3" />
      {displayType}
    </Badge>
  );
}
