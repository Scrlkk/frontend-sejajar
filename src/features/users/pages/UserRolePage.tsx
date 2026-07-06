import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo } from "react";
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deactivateUserApi,
  restoreUserApi,
  mapUserToUserData,
} from "@/features/users/api/usersApi";
import { getUsersCards } from "@/features/users/constants/cardConfig";
import { getRolePermissionsData } from "@/features/users/constants/rolePermissions";
import { UserManagement } from "@/features/users/components/UserMangement";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { RolePermissions } from "@/features/users/components/RolePermissions";
import { EmployeePerformance } from "@/features/contracts/components/EmployeePerformance";
import { getDashboardChartsApi } from "@/features/dashboard/api/dashboardApi";
import { useAuth } from "@/hooks/useAuth";
import { getInitialsAndBg } from "@/utils/formatter";
import toast from "react-hot-toast";
import type { UserFormValues } from "@/features/users/components/ModalUsers";

import {
  FORM_TO_API_ROLE,
  ROLE_LABELS,
} from "@/features/users/constants/roleColors";

interface UserTaskStats {
  id: number;
  full_name: string;
  tasks: Record<string, number>;
  total: number;
}

interface UsersByTasksResponse {
  metric: string;
  users: UserTaskStats[];
}

export const UserRolePage = () => {
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const isOwner = user?.roles?.includes("owner") || false;

  const {
    data: apiUsers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", { all: true, limit: 100 }],
    queryFn: () => getUsersApi({ all: true, limit: 100 }),
  });

  const uiUsers = apiUsers.map(mapUserToUserData);

  const usersCards = getUsersCards(apiUsers);
  const rolePermissions = getRolePermissionsData(uiUsers);

  const { data: usersByTasksChart } = useQuery<UsersByTasksResponse>({
    queryKey: ["dashboard-charts", "users_by_tasks"],
    queryFn: () =>
      getDashboardChartsApi<UsersByTasksResponse>({
        metric: "users_by_tasks",
      }),
    enabled: isOwner,
  });

  const userRoleMap = useMemo(() => {
    const map = new Map<number, string>();
    apiUsers.forEach((u) => {
      map.set(u.id, u.role);
    });
    return map;
  }, [apiUsers]);

  const employeePerformanceData = useMemo(() => {
    if (!usersByTasksChart?.users) return [];
    return usersByTasksChart.users.map((item) => {
      const name = item.full_name;
      const { initials, avatarBg } = getInitialsAndBg(name);
      const rawRole = userRoleMap.get(item.id) || "content_editor";
      const displayRole = ROLE_LABELS[rawRole] || rawRole;
      const approvedCount = item.tasks?.approved || 0;
      const total = item.total || 0;
      const completionRate =
        total > 0 ? Math.round((approvedCount / total) * 100) : 0;
      return {
        id: item.id,
        name,
        role: displayRole,
        initials,
        tasksCount: total,
        completionRate,
        avatarBg,
        month: "",
        year: new Date().getFullYear(),
      };
    });
  }, [usersByTasksChart, userRoleMap]);

  const createMutation = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
      toast.success("User account reactivated");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error.response?.data?.message || "Failed to reactivate user";
      toast.error(msg);
    },
  });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-600 bg-red-50 rounded-xl border border-red-100">
        <p className="font-semibold">Error loading users data.</p>
        <p className="text-sm mt-1">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {usersCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <UserManagement
        users={uiUsers}
        onSaveUser={handleSaveUser}
        onDeleteUser={handleDeleteUser}
        onReactivateUser={handleReactivateUser}
      />
      {isOwner && <EmployeePerformance data={employeePerformanceData} />}
      <RolePermissions roles={rolePermissions} />
    </div>
  );
};
