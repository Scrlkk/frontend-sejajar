import { AlertTriangle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RevisionDashboardProps {
  title?: string;
  description?: string;
  dueDateText?: string;
  category?: string;
  categoryBg?: string;
  categoryDot?: string;
  onRevise?: () => void;
}

export function RevisionDashboard({
  title = "Day 1 Challenge - Full Body Warmup",
  description = "Owner requested more energetic and hype tone. Please revise the opening 10 seconds to be more punchy.",
  dueDateText = "Due: May 1, 2024",
  category = "Entertainment",
  categoryBg = "bg-pink-50/30 text-pink-600 border border-pink-200/60 hover:bg-pink-50/30",
  categoryDot = "bg-pink-500",
  onRevise,
}: RevisionDashboardProps) {
  return (
    <div className="w-full bg-red-50 rounded-xl border border-red-200 outline outline-red-300/50 shadow-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-4 min-w-0 flex-1">
        <div className="h-10 w-10 rounded-xl bg-red-100/60 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="h-5 w-5 stroke-[2.5]" />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <span className="font-semibold text-red-900">
              Revision Required
            </span>
            <Badge className="bg-red-100 text-red-600 font-bold text-[10px] px-2 py-0.5 rounded-md border-none shadow-none flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-red-500" />
              Revision
            </Badge>
          </div>

          <h4 className="font-semibold text-gray-900 text-base leading-snug truncate">
            {title}
          </h4>

          <p className="text-xs md:text-sm font-medium text-red-800/80 leading-relaxed wrap-break-words max-w-4xl line-clamp-1">
            {description}
          </p>

          <div className="pt-0.5">
            <Badge
              variant="outline"
              className={`${categoryBg} rounded-full font-medium px-2.5 py-0.5 text-xs flex items-center gap-1.5 shadow-none w-fit`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${categoryDot}`} />
              {category}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 shrink-0 self-end md:self-center w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-red-200/40">
        <span className="text-xs font-bold text-red-600/80 tracking-wide md:block hidden">
          {dueDateText}
        </span>

        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <span className="text-xs font-semibold text-red-600/80 tracking-wide md:hidden block">
            {dueDateText}
          </span>

          <Button
            variant="outline"
            onClick={onRevise}
            className="bg-transparent text-red-600 border-red-200 hover:border-red-logo hover:bg-red-logo hover:text-white rounded-xl font-semibold text-xs md:text-sm h-10 px-4 flex items-center gap-1.5 transition-all cursor-pointer shadow-none w-full sm:w-auto justify-center"
          >
            <Pencil className="h-4 w-4 stroke-[2.5]" />
            Revise
          </Button>
        </div>
      </div>
    </div>
  );
}
