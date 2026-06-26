import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deactivateUserApi,
  restoreUserApi,
  mapUserToUserData,
} from "@/features/users/api/usersApi";
import {
  getDashboardSummaryApi,
  getDashboardSystemApi,
} from "@/features/dashboard/api/dashboardApi";
import { SUPERADMIN_CARDS_TEMPLATE } from "@/features/dashboard/constants/cardConfig";
import {
  ROLE_COLORS,
  ROLE_LABELS,
} from "@/features/users/constants/roleColors";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import {
  SystemLog,
  type ActivityLogItem,
} from "@/features/audit/components/SystemLog";
import { UserManagement } from "@/features/users/components/UserMangement";
import { GraphicDonut } from "@/features/dashboard/components/GraphicDonut";
import { SystemHealth } from "@/features/dashboard/components/SystemHealth";
import {
  getInitials,
  getAvatarBg,
  getActionBg,
  formatActionDescription,
} from "@/utils/formatter";
import { formatDate } from "@/utils/helpers";
import { getActivityLogsApi } from "@/features/audit/api/activityLogsApi";
import { useMemo } from "react";
import type { UserFormValues } from "@/features/users/components/ModalUsers";
import toast from "react-hot-toast";
import { FORM_TO_API_ROLE } from "@/features/users/constants/roleColors";

interface SuperadminSummary {
  users: { total: number; online: number };
  roles: { total: number; breakdown: Array<{ role: string; count: number }> };
  sessions: { active: number };
}

interface SystemHealthResponse {
  uptime_seconds: number;
  storage: { used_mb: number; limit_mb: number; used_percent: number };
  sessions: { active: number; online_users: number };
}

const ROLE_BG_CLASSES: Record<string, string> = {
  superadmin: "bg-[#ef4444]",
  owner: "bg-[#f59e0b]",
  content_lead: "bg-[#3b82f6]",
  content_editor: "bg-[#ec4899]",
  script_writer: "bg-[#8b5cf6]",
  admin_social_media: "bg-[#10b981]",
};

export const SuperadminPage = () => {
  const queryClient = useQueryClient();

  const { data: apiUsers = [] } = useQuery({
    queryKey: ["users", { all: true, limit: 100 }],
    queryFn: () => getUsersApi({ all: true, limit: 100 }),
  });

  const { data: summaryData } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: () => getDashboardSummaryApi<SuperadminSummary>(),
  });

  const { data: systemData } = useQuery({
    queryKey: ["dashboardSystem"],
    queryFn: () => getDashboardSystemApi<SystemHealthResponse>(),
  });

  // Fetch activity logs
  const { data: rawLogs = [] } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: () => getActivityLogsApi({ limit: 100 }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      toast.success("User created successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error.response?.data?.message || "Failed to create user";
      toast.error(msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Parameters<typeof updateUserApi>[1];
    }) => updateUserApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error.response?.data?.message || "Failed to update user";
      toast.error(msg);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      toast.success("User account deactivated");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error.response?.data?.message || "Failed to deactivate user";
      toast.error(msg);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      toast.success("User account reactivated");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error.response?.data?.message || "Failed to reactivate user";
      toast.error(msg);
    },
  });

  // Action handlers
  const handleSaveUser = (data: UserFormValues & { id?: number }) => {
    const apiRoles = data.role.map(
      (r) => FORM_TO_API_ROLE[r] || r.toLowerCase().replace(" ", "_"),
    );
    const payload = {
      full_name: data.fullName,
      email: data.email,
      roles: apiRoles,
      ...(data.password ? { password: data.password } : {}),
    };

    if (data.id) {
      updateMutation.mutate({ id: data.id, payload });

      // Handle isActive changes
      const previousUser = apiUsers.find((u) => u.id === data.id);
      if (previousUser) {
        if (data.isActive && !previousUser.is_active) {
          restoreMutation.mutate(data.id);
        } else if (!data.isActive && previousUser.is_active) {
          deactivateMutation.mutate(data.id);
        }
      }
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDeleteUser = (id: number) => {
    deactivateMutation.mutate(id);
  };

  const handleReactivateUser = (id: number) => {
    restoreMutation.mutate(id);
  };

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
        log.entity_name,
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

  const uiUsers = apiUsers.map(mapUserToUserData);

  const cards = SUPERADMIN_CARDS_TEMPLATE.map((tpl) => {
    let value: string | number = "0";
    if (summaryData) {
      if (tpl.key === "total_users") {
        value = summaryData.users?.total ?? 0;
      } else if (tpl.key === "online_users") {
        value = summaryData.users?.online ?? 0;
      } else if (tpl.key === "roles_assigned") {
        value = summaryData.roles?.total ?? 0;
      } else if (tpl.key === "active_sessions") {
        value = summaryData.sessions?.active ?? 0;
      }
    }
    return {
      title: tpl.title,
      value,
      description: tpl.description,
      icon: tpl.icon,
      iconColor: tpl.iconColor,
      iconBgColor: tpl.iconBgColor,
    };
  });

  const formatUptime = (sec: number) => {
    const d = Math.floor(sec / (3600 * 24));
    const h = Math.floor((sec % (3600 * 24)) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m`;
  };

  const systemMetricsData = systemData
    ? [
        {
          label: "API Uptime",
          valueText: formatUptime(systemData.uptime_seconds),
          percentage: 100,
          barColor: "text-emerald-500",
        },
        {
          label: "Storage Used",
          valueText: `${systemData.storage.used_percent}%`,
          percentage: systemData.storage.used_percent,
          barColor: "text-amber-500",
        },
        {
          label: "Active Sessions",
          valueText: `${systemData.sessions.active} active`,
          percentage: Math.min(100, (systemData.sessions.active / 100) * 100),
          barColor: "text-red-800",
        },
      ]
    : [];

  const rolesData = summaryData?.roles?.breakdown
    ? summaryData.roles.breakdown.map(
        (item: { role: string; count: number }) => ({
          name: ROLE_LABELS[item.role] || item.role,
          value: item.count,
          color: ROLE_BG_CLASSES[item.role] || "bg-[#6b7280]",
          fill: ROLE_COLORS[item.role]?.fill || "#6b7280",
        }),
      )
    : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>

      <div className="flex gap-5 items-stretch">
        <UserManagement
          users={uiUsers}
          onSaveUser={handleSaveUser}
          onDeleteUser={handleDeleteUser}
          onReactivateUser={handleReactivateUser}
        />

        <div className="w-110 flex flex-col gap-6">
          <GraphicDonut
            data={rolesData}
            title="Role Distribution"
            configLabel="Total Users"
          />
          <SystemHealth metrics={systemMetricsData} />
        </div>
      </div>

      <div className="w-full pt-1">
        <SystemLog logs={logs} timeframe="Last 24 hours" />
      </div>
    </div>
  );
};
