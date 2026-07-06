import type { UserData } from "@/features/users/api/usersApi";
import type { RolePermissionItem } from "@/features/users/components/RolePermissions";

export const rolePermissionsData: RolePermissionItem[] = [
  {
    id: 1,
    roleName: "Super Admin",
    userCount: 0,
    roleBg: "bg-red-50 text-red-600 hover:bg-red-50",
    permissions: ["Dashboard", "Users & Roles", "System Logs"],
    description: "Responsible for system administration, managing user accounts, and monitoring system-wide activity logs.",
  },
  {
    id: 2,
    roleName: "Owner",
    userCount: 0,
    roleBg: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    permissions: ["Dashboard", "Contracts", "Clients", "Calendar", "Analytics"],
    description: "Business owner with full access to monitor performance, review analytics, manage client profiles, and approve contracts.",
  },
  {
    id: 3,
    roleName: "Content Lead",
    userCount: 0,
    roleBg: "bg-blue-50 text-blue-600 hover:bg-blue-50",
    permissions: ["Dashboard", "Contracts", "Tasks", "Calendar"],
    description: "Plans content strategy, manages contract details, and coordinates/assigns tasks to the creative production team.",
  },
  {
    id: 4,
    roleName: "Editor",
    userCount: 0,
    roleBg: "bg-pink-50 text-pink-500 hover:bg-pink-50",
    permissions: ["Dashboard", "Tasks", "Calendar", "Uploads"],
    description: "Responsible for reviewing drafts, editing media (video/images), and uploading finalized content assets.",
  },
  {
    id: 5,
    roleName: "Script Writer",
    userCount: 0,
    roleBg: "bg-purple-50 text-purple-600 hover:bg-purple-50",
    permissions: ["Dashboard", "Tasks", "Calendar", "Drafts"],
    description: "Focuses on creative concept development, drafting scripts, writing dialogues, and preparing initial materials.",
  },
  {
    id: 6,
    roleName: "Admin Social Media",
    userCount: 0,
    roleBg: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    permissions: ["Dashboard", "Tasks", "Calendar", "Publish", "Engagement"],
    description: "Responsible for publishing finalized content to social media platforms, managing engagement, and monitoring audience feedback.",
  },
];

export const getRolePermissionsData = (users: UserData[]): RolePermissionItem[] => {
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
