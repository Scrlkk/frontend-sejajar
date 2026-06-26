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
import { getUsersCards } from "@/features/users/constants/cardConfig";
import { getRolePermissionsData } from "@/features/users/constants/rolePermissions";
import { UserManagement } from "@/features/users/components/UserMangement";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { RolePermissions } from "@/features/users/components/RolePermissions";
import toast from "react-hot-toast";
import type { UserFormValues } from "@/features/users/components/ModalUsers";

import { FORM_TO_API_ROLE } from "@/features/users/constants/roleColors";

export const UserRolePage = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Users
  const {
    data: apiUsers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", { all: true, limit: 100 }],
    queryFn: () => getUsersApi({ all: true, limit: 100 }),
  });

  // 2. Map to UI format
  const uiUsers = apiUsers.map(mapUserToUserData);

  // 3. Get metrics and role permissions
  const usersCards = getUsersCards(apiUsers);
  const rolePermissions = getRolePermissionsData(uiUsers);

  // 4. Mutations
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

  // 5. Action handlers
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
      <RolePermissions roles={rolePermissions} />
    </div>
  );
};
