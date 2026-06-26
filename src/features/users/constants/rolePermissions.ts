import type { UserData } from "@/features/users/api/usersApi";
import type { RolePermissionItem } from "@/features/users/components/RolePermissions";

export const rolePermissionsData: RolePermissionItem[] = [
  {
    id: 1,
    roleName: "Super Admin",
    userCount: 0,
    roleBg: "bg-red-50 text-red-600 hover:bg-red-50",
    permissions: ["Dashboard", "User & Roles", "System Logs"],
  },
  {
    id: 2,
    roleName: "Owner",
    userCount: 0,
    roleBg: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    permissions: ["Dashboard", "Contracts", "Clients", "Calendar", "Analytics"],
  },
  {
    id: 3,
    roleName: "Content Lead",
    userCount: 0,
    roleBg: "bg-blue-50 text-blue-600 hover:bg-blue-50",
    permissions: ["Dashboard", "Contracts", "Tasks", "Calendar"],
  },
  {
    id: 4,
    roleName: "Editor",
    userCount: 0,
    roleBg: "bg-pink-50 text-pink-500 hover:bg-pink-50",
    permissions: ["Dashboard", "Tasks", "Calendar", "Uploads"],
  },
  {
    id: 5,
    roleName: "Script Writer",
    userCount: 0,
    roleBg: "bg-purple-50 text-purple-600 hover:bg-purple-50",
    permissions: ["Dashboard", "Tasks", "Calendar", "Drafts"],
  },
  {
    id: 6,
    roleName: "Admin Social Media",
    userCount: 0,
    roleBg: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    permissions: ["Dashboard", "Tasks", "Calendar", "Publish", "Engagement"],
  },
];

export const getRolePermissionsData = (users: UserData[]): RolePermissionItem[] => {
  // Count users dynamically per role
  const countUsers = (roleLabel: string) => {
    return users.filter((u) => {
      if (!u.role) return false;
      const roles = u.role.split(",").map((r: string) => r.trim());
      return roles.includes(roleLabel);
    }).length;
  };

  return rolePermissionsData.map(roleItem => ({
    ...roleItem,
    userCount: countUsers(roleItem.roleName),
  }));
};
