export const CONTRACT_STATUS_CONFIG: Record<string, { bg: string; dot: string; label: string }> = {
  active: {
    bg: "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100",
    dot: "bg-green-500",
    label: "Active",
  },
  completed: {
    bg: "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100",
    dot: "bg-blue-500",
    label: "Completed",
  },
  cancelled: {
    bg: "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200",
    dot: "bg-gray-400",
    label: "Cancel",
  },
  overdue: {
    bg: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    dot: "bg-red-500",
    label: "Overdue",
  },
};

export const getContractStatusConfig = (s: string) => {
  if (!s) return CONTRACT_STATUS_CONFIG.active;
  const normalized = s.toLowerCase();
  // Handle alias if "cancel" is passed
  if (normalized === "cancel" || normalized === "cancelled") {
    return CONTRACT_STATUS_CONFIG.cancelled;
  }
  return CONTRACT_STATUS_CONFIG[normalized] ?? CONTRACT_STATUS_CONFIG.active;
};
