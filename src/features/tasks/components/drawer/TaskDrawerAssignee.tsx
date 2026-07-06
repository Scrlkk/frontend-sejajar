import { useMemo } from "react";
import { getInitialsAndBg } from "@/utils/formatter";

interface TaskDrawerAssigneeProps {
  assigneeName?: string | null;
  roleName?: string | null;
}

export function TaskDrawerAssignee({
  assigneeName,
  roleName,
}: TaskDrawerAssigneeProps) {
  const { initials, avatarBg } = useMemo(() => {
    return getInitialsAndBg(assigneeName || "Unassigned");
  }, [assigneeName]);

  return (
    <div className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/30 flex flex-col justify-between h-20 shadow-sm">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
        Assigned To
      </span>
      <div className="flex items-center gap-2.5 mt-1 min-w-0">
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm border border-white ${avatarBg}`}
        >
          {initials}
        </div>
        <div className="flex flex-col min-w-0 leading-tight">
          <span
            className="text-xs font-bold text-gray-800 truncate"
            title={assigneeName || "Unassigned"}
          >
            {assigneeName || "Unassigned"}
          </span>
          <span className="text-[10px] text-gray-400 font-semibold mt-0.5 truncate">
            {roleName || "Staff"}
          </span>
        </div>
      </div>
    </div>
  );
}
