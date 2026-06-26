import { formatDate } from "./helpers";

export const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const AVATAR_COLORS = [
  'bg-blue-50 text-blue-600',
  'bg-purple-50 text-purple-600',
  'bg-emerald-50 text-emerald-600',
  'bg-pink-50 text-pink-600',
  'bg-amber-50 text-amber-600',
  'bg-red-50 text-red-600',
  'bg-teal-50 text-teal-600',
  'bg-indigo-50 text-indigo-600',
];

export const getAvatarBg = (name: string) => {
  if (!name) return AVATAR_COLORS[0];
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
};

export const getInitialsAndBg = (name: string) => ({
  initials: getInitials(name),
  avatarBg: getAvatarBg(name),
});

export const getRankColor = (rank: number) =>
  rank === 1 ? 'text-amber-500' : 'text-slate-400';

export const isTaskOverdue = (deadline: string | null, status: string) =>
  !!deadline &&
  new Date(deadline) < new Date() &&
  !['published', 'approved'].includes(status);

export { getPlatformConfig } from '@/features/platforms/constants/platformConfig';
export { getRoleBg } from '@/features/users/constants/roleColors';
export { getContractStatusConfig } from '@/features/contracts/constants/statusConfig';
export { getContentStatusConfig } from '@/features/contents/constants/statusConfig';
export { getCategoryBg } from '@/features/contents/constants/categoryConfig';
export { getTaskStatusConfig } from '@/features/tasks/constants/statusConfig';
export { getTaskTypeConfig } from '@/features/tasks/constants/typeConfig';

export { getActionBg, getActionConfig } from '@/features/audit/constants/actionConfig';

const parseJsonValues = (val: unknown): Record<string, unknown> | null => {
  if (!val) return null;
  if (typeof val === "object") return val as Record<string, unknown>;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return null;
    }
  }
  return null;
};

const getEntityName = (
  oldValues: unknown,
  newValues: unknown
): string | null => {
  const checkKeys = ["title", "full_name", "name", "brand"];
  
  const parsedNew = parseJsonValues(newValues);
  if (parsedNew) {
    for (const key of checkKeys) {
      if (key in parsedNew && typeof parsedNew[key] === "string" && parsedNew[key]) {
        return parsedNew[key] as string;
      }
    }
  }
  
  const parsedOld = parseJsonValues(oldValues);
  if (parsedOld) {
    for (const key of checkKeys) {
      if (key in parsedOld && typeof parsedOld[key] === "string" && parsedOld[key]) {
        return parsedOld[key] as string;
      }
    }
  }
  
  return null;
};

export const formatActionDescription = (
  action: string,
  tableName: string | null,
  recordId: number | null,
  oldValues?: unknown,
  newValues?: unknown,
  entityName?: string | null
): string => {
  const tableDisplay = tableName ? tableName.replace("core.", "").replace("public.", "").replace("analytics.", "").replace("audit.", "").replace("notification.", "") : "";
  
  if (action === "LOGIN") {
    return "Logged into the system";
  }
  if (action === "LOGOUT") {
    return "Logged out of the system";
  }
  
  const formattedTable = tableDisplay ? (tableDisplay.charAt(0).toUpperCase() + tableDisplay.slice(1)) : "System";
  const actionVerb = action === "CREATE" ? "Created" : action === "UPDATE" ? "Updated" : action === "DELETE" ? "Deleted" : action === "PUBLISH" ? "Published" : action;
  
  const finalEntityName = entityName || getEntityName(oldValues || null, newValues || null);

  if (finalEntityName) {
    return `${actionVerb} ${formattedTable}: "${finalEntityName}"`;
  } else if (recordId) {
    return `${actionVerb} ${formattedTable} (ID: ${recordId})`;
  } else {
    return `${actionVerb} ${formattedTable}`;
  }
};

export const formatCommentTimestamp = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffSec < 60) {
      return "just now";
    } else if (diffMin === 1) {
      return "a minute ago";
    } else if (diffMin < 60) {
      return `${diffMin} minutes ago`;
    } else if (diffHr === 1) {
      return "an hour ago";
    } else if (diffHr < 24) {
      return `${diffHr} hours ago`;
    }

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export interface DeadlineTask {
  id: number;
  title: string;
  status: string;
  deadline: string;
  content_title?: string;
  assigned_to_name?: string;
}

export const mapTaskToDeadlineItem = (task: DeadlineTask) => ({
  id: task.id,
  title: task.title,
  category: task.content_title || "General",
  categoryBg: "bg-blue-50 text-blue-600 border-blue-200/60",
  categoryDot: "bg-blue-500",
  status: task.status,
  statusBg: "bg-gray-50/60 text-gray-600 hover:bg-gray-50/60",
  statusDot: "bg-gray-600",
  dueDateText: formatDate(task.deadline),
  dueDate: task.deadline ? new Date(task.deadline) : undefined,
});

