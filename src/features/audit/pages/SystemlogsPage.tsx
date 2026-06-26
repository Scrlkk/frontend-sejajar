import { useQuery } from "@tanstack/react-query";
import { getActivityLogsApi } from "@/features/audit/api/activityLogsApi";
import { getDashboardWidgetApi } from "@/features/dashboard/api/dashboardApi";
import { AUDIT_CARDS_TEMPLATE } from "@/features/audit/constants/cardConfig";
import { SystemLog, type ActivityLogItem } from "@/features/audit/components/SystemLog";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { getInitials, getAvatarBg, getActionBg, formatActionDescription } from "@/utils/formatter";
import { formatDate } from "@/utils/helpers";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";

interface SystemLogsSummary {
  widget: string;
  activity: {
    total: number;
    login: number;
    create: number;
    update: number;
    delete: number;
    read: number;
  };
  storage: {
    used_mb: number;
    limit_mb: number;
    used_percent: number;
  };
  sessions: {
    active: number;
    online_users: number;
  };
}

export const SystemlogsPage = () => {
  // Fetch summary widget stats
  const { data: summary, isLoading: loadingSummary } = useQuery<SystemLogsSummary>({
    queryKey: ["system-logs-summary"],
    queryFn: () => getDashboardWidgetApi<SystemLogsSummary>("system-logs-summary"),
  });

  // Fetch activity logs list
  const { data: rawLogs = [], isLoading: loadingLogs } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: () => getActivityLogsApi({ limit: 100 }),
  });

  // Map summary stats into card layouts
  const cards = useMemo(() => {
    return AUDIT_CARDS_TEMPLATE.map((card) => {
      let value = "0";
      let description = card.description;

      if (summary) {
        if (card.key === "total") {
          value = String(summary.activity.total);
        } else if (card.key === "login") {
          value = String(summary.activity.login);
        } else if (card.key === "storage") {
          value = `${summary.storage.used_mb} MB`;
          description = `Limit ${summary.storage.limit_mb} MB (${summary.storage.used_percent}%)`;
        } else if (card.key === "sessions") {
          value = String(summary.sessions.active);
          description = `${summary.sessions.online_users} online users`;
        }
      }

      return {
        ...card,
        value,
        description,
      };
    });
  }, [summary]);

  // Map API activity logs to UI expectations
  const logs = useMemo<ActivityLogItem[]>(() => {
    return rawLogs.map((log) => {
      const initials = getInitials(log.user_name || "System");
      const avatarBg = getAvatarBg(log.user_name || "System");
      const actionBg = getActionBg(log.action);
      const description = formatActionDescription(
        log.action,
        log.table_name,
        log.record_id,
        log.old_values,
        log.new_values,
        log.entity_name
      );
      const date = formatDate(log.created_at);

      return {
        id: log.id,
        name: log.user_name || "System",
        initials,
        avatarBg,
        actionType: log.action,
        actionBg,
        description,
        date,
      };
    });
  }, [rawLogs]);

  if (loadingSummary || loadingLogs) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-800" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ key, ...cardProps }) => (
          <CardDashboard key={key} {...cardProps} />
        ))}
      </div>
      <SystemLog logs={logs} />
    </div>
  );
};