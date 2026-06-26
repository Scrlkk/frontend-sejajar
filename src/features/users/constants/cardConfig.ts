import { UserRound } from "lucide-react";
import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";
import type { User } from "@/features/users/api/usersApi";

export const getUsersCards = (users: User[]): CardDashboardProps[] => {
  const countRole = (roleKey: string) => {
    return users.filter(u => u.is_active && u.roles && u.roles.includes(roleKey)).length;
  };

  return [
    {
      title: "Content Lead",
      value: countRole("content_lead"),
      description: "Active User",
      icon: UserRound,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-600/10",
    },
    {
      title: "Content Editor",
      value: countRole("content_editor"),
      description: "Active User",
      icon: UserRound,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-600/10",
    },
    {
      title: "Script Writer",
      value: countRole("script_writer"),
      description: "Active User",
      icon: UserRound,
      iconColor: "text-yellow-600",
      iconBgColor: "bg-yellow-600/10",
    },
    {
      title: "Admin Social Media",
      value: countRole("admin_social_media"),
      description: "Active User",
      icon: UserRound,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-600/10",
    },
  ];
};
