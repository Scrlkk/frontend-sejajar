import { Card } from "@/components/ui/card";
import { AlertTriangle, FileText } from "lucide-react";

export interface RevisionItem {
  id: string;
  title: string;
  platform: string;
  dueDate: string;
}

export interface RevisionContractProps {
  title?: string;
  items?: RevisionItem[];
}

export function RevisionContract({
  title = "REVISION NEEDED",
  items = [],
}: RevisionContractProps) {
  const hasRevision = items.length > 0;
  const count = items.length;

  if (!hasRevision) {
    return (
      <Card className="w-full bg-slate-50/40 rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs tracking-wider uppercase">
            <span>No Revision Needed</span>
          </div>
        </div>

        {/* Empty State Inner Box */}
        <div className="w-full h-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center py-7 text-center gap-2">
          <FileText className="h-8 w-8 text-gray-300 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs text-slate-700 font-semibold leading-tight">
              All content plans are up to date
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-1">
              No revisions requested at the moment
            </span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-red-50/50 rounded-xl border border-red-100 outline outline-red-200/40 shadow-lg p-6 flex flex-col gap-4">
      {/* Alert Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs tracking-wider uppercase">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
          <span>{title}</span>
        </div>
        {count > 0 && (
          <span className="text-xs font-semibold text-red-700 bg-red-100/70 rounded-full px-2.5 py-0.5">
            {count} Revision{count > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Inner Box Scrollable Container */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-56 pr-1 scrollbar-none">
        {items.map((item) => (
          <div
            key={item.id}
            className="w-full bg-white border border-red-100 rounded-xl p-4 shadow-sm flex flex-col gap-1.5 shrink-0"
          >
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              {item.title}
            </h3>
            <p className="text-xs text-red-500 font-semibold">
              {item.platform} <span className="text-slate-350 font-medium mx-1">•</span> {item.dueDate}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
