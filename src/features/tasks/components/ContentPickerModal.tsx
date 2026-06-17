import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  sampleAssignedContentPlans,
  type AssignedContentPlan,
} from "@/features/tasks/data/tasksData";

interface ContentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (plan: AssignedContentPlan) => void;
  itemType: "upload" | "draft";
}

export function ContentPickerModal({
  isOpen,
  onClose,
  onSelect,
  itemType,
}: ContentPickerModalProps) {
  const getPlatformBg = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "tiktok":
        return "bg-[#252f41] text-white";
      case "instagram":
        return "bg-pink-600 text-white";
      case "youtube":
        return "bg-red-600 text-white";
      default:
        return "bg-slate-200 text-slate-800";
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category.toLowerCase()) {
      case "beauty":
        return "bg-pink-50 text-pink-600 border-none hover:bg-pink-50";
      case "lifestyle":
        return "bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-50";
      case "education":
        return "bg-blue-50 text-blue-600 border-none hover:bg-blue-50";
      default:
        return "bg-indigo-50 text-indigo-600 border-none hover:bg-indigo-50";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl outline-none">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-lg font-bold text-gray-900 leading-snug">
            {itemType === "draft"
              ? "Select Content Plan for New Draft"
              : "Select Content Plan for Upload"}
          </DialogTitle>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            Choose one of your assigned content tasks to begin. The new{" "}
            {itemType === "draft" ? "draft script" : "media file"} will be dynamically linked.
          </p>
        </DialogHeader>

        {/* List scrollable container */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 scrollbar-none min-h-0">
          {sampleAssignedContentPlans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => {
                onSelect(plan);
                onClose();
              }}
              className="group border border-gray-200 hover:border-red-800 bg-white hover:bg-slate-50/30 p-4 rounded-xl shadow-xs transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-red-950 transition-colors leading-tight truncate">
                  {plan.title}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={`${getCategoryBg(plan.category)} text-[10px] font-bold py-0 px-2 rounded-md`}>
                    {plan.category}
                  </Badge>
                  <Badge variant="outline" className={`${getPlatformBg(plan.platform)} border-none text-[10px] font-bold py-0 px-2 rounded-md`}>
                    {plan.platform}
                  </Badge>
                </div>
              </div>

              {/* Assigner details */}
              <div className="flex items-center gap-2.5 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4 min-w-44">
                <div className="h-7 w-7 rounded-full bg-slate-100 border border-gray-200 text-[10px] font-bold flex items-center justify-center text-gray-600 shadow-sm shrink-0">
                  {plan.assignedBy.initials}
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-[11px] font-bold text-gray-700 truncate">
                    {plan.assignedBy.name}
                  </span>
                  <span className="text-[9px] text-gray-400 font-semibold mt-0.5">
                    {plan.assignedBy.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-end shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 px-5 text-xs font-semibold cursor-pointer h-9 shadow-sm"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
