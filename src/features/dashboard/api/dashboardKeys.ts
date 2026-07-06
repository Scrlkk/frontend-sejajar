/**
 * Query Key Factory for dashboard.
 */
export const dashboardKeys = {
  charts: (type?: string) => ["dashboard-charts", type].filter(Boolean),
  widgets: () => ["dashboard-widgets"] as const,
  staffSummary: () => ["staffSummary"] as const,
  systemData: () => ["systemData"] as const,
  logs: (filter?: object) => ["logs", filter].filter(Boolean),
};
