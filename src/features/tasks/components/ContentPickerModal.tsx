import { useQuery } from "@tanstack/react-query";
import { getTasksApi } from "@/features/tasks/api/tasksApi";
import { getInitialsAndBg } from "@/utils/formatter";
import { useMemo } from "react";
import { ClipboardList } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";
import { PlatformBadge } from "@/features/pillars/components/PlatformBadge";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { getTaskTypeConfig } from "@/features/tasks/constants/typeConfig";


export interface AssignedContentPlan {
  id: string | number;
  content_id: number;
  title: string;
  category: string;
  platform: string;
  platformColorKey?: string | null;
  assignedBy: {
    name: string;
    role: string;
    initials: string;
  };
}

interface ContentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (plan: AssignedContentPlan) => void;
  itemType: "upload" | "draft" | "caption";
  excludeContentIds?: number[];
}

export function ContentPickerModal({
  isOpen,
  onClose,
  onSelect,
  itemType,
  excludeContentIds = [],
}: ContentPickerModalProps) {
  const { user } = useAuth();
  const { roles } = usePermissions();

  const isLeadOrOwner =
    roles.includes("content_lead") ||
    roles.includes("owner") ||
    roles.includes("superadmin");

  const { data: apiTasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasksApi(),
    enabled: isOpen,
  });

  const assignedPlans = useMemo<AssignedContentPlan[]>(() => {
    // For upload, draft, and caption, show tasks that are in 'to_do' status.
    let filteredTasks = apiTasks.filter((t) => t.status === "to_do");

    if (!isLeadOrOwner) {
      filteredTasks = filteredTasks.filter(
        (t) => Number(t.assigned_to) === Number(user?.id)
      );
    }

    // Filter by task type
    filteredTasks = filteredTasks.filter((t) => {
      const role = t.assignee_roles?.[0] ?? "content_editor";
      const label = getTaskTypeConfig(role).label;
      if (itemType === "draft") return label === "Script";
      if (itemType === "caption") return label === "Caption";
      return label !== "Script" && label !== "Caption"; // upload
    });

    // Exclude tasks whose content plans already have drafts/uploads/captions if excluded
    if (excludeContentIds.length > 0) {
      filteredTasks = filteredTasks.filter(
        (t) => !excludeContentIds.includes(Number(t.content_id))
      );
    }

    return filteredTasks.map((t) => {
      const { initials } = getInitialsAndBg(t.assignee_name ?? "");
      return {
        id: Number(t.id),
        content_id: Number(t.content_id),
        title: t.title,
        category: t.category_name ?? "General",
        platform: t.platform_name || "Instagram",
        platformColorKey: t.platform_color_key,
        assignedBy: {
          name: t.assignee_name || "Unassigned",
          role: t.assignee_roles?.[0] ?? "content_editor",
          initials,
        },
      };
    });
  }, [apiTasks, isLeadOrOwner, user, itemType, excludeContentIds]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl outline-none">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-lg font-bold text-gray-900 leading-snug">
            {itemType === "draft"
              ? "Select Content Plan for New Draft"
              : itemType === "caption"
              ? "Select Content Plan for Caption Task"
              : "Select Content Plan for Upload"}
          </DialogTitle>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            Choose one of your assigned content tasks to begin. The{" "}
            {itemType === "draft" ? "draft script" : itemType === "caption" ? "caption task" : "media file"} will be dynamically linked.
          </p>
        </DialogHeader>

        {/* List scrollable container */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 scrollbar-none min-h-0 flex flex-col justify-center">
          {assignedPlans.length > 0 ? (
            assignedPlans.map((plan) => (
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
                    <PillarsCard category={plan.category} />
                    <PlatformBadge
                      platform={plan.platform}
                      colorKey={plan.platformColorKey}
                      className="text-[10px] font-bold py-0.5 px-2 rounded-md"
                    />
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
            ))
          ) : (
            <div className="py-12 text-center flex flex-col items-center justify-center bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl px-6">
              <div className="h-12 w-12 rounded-full bg-slate-100 border border-gray-150 flex items-center justify-center text-gray-400 mb-3.5 shadow-sm">
                <ClipboardList className="h-6 w-6 stroke-2" />
              </div>
              <h5 className="text-sm font-bold text-gray-800">
                No content plans available
              </h5>
              <p className="text-xs text-gray-400 font-semibold mt-1.5 max-w-xs leading-normal">
                {itemType === "draft"
                  ? "All of your assigned tasks already have draft scripts, or no tasks are currently assigned to you."
                  : itemType === "caption"
                  ? "All of your assigned tasks already have captions, or no tasks are currently assigned to you."
                  : "All of your assigned tasks already have files uploaded, or no tasks are currently assigned to you."}
              </p>
            </div>
          )}
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
