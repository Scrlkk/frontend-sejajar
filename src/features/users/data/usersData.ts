import type { RolePermissionItem } from "@/features/users/components/RolePermissions";
import { UserRound } from "lucide-react";
import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";

export type UserData = {
  id: number;
  name: string;
  initials: string;
  role: string;
  email: string;
  tasks: number;
  joined: string;
  status: string;
  avatarBg: string;
  roleBg: string;
};



export const usersData: UserData[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    initials: "SM",
    role: "Content Lead",
    email: "sarah@sejajar.co",
    tasks: 45,
    joined: "Jan 15, 2023",
    status: "active",
    avatarBg: "bg-blue-50 text-blue-600",
    roleBg: "bg-blue-50 text-blue-600 hover:bg-blue-50",
  },
  {
    id: 2,
    name: "James Rivera",
    initials: "JR",
    role: "Script Writer",
    email: "james@sejajar.co",
    tasks: 38,
    joined: "Feb 20, 2023",
    status: "active",
    avatarBg: "bg-purple-50 text-purple-600",
    roleBg: "bg-purple-50 text-purple-600 hover:bg-purple-50",
  },
  {
    id: 3,
    name: "Mia Chen",
    initials: "MC",
    role: "Script Writer",
    email: "mia@sejajar.co",
    tasks: 29,
    joined: "Jun 10, 2023",
    status: "active",
    avatarBg: "bg-purple-100 text-purple-700",
    roleBg: "bg-purple-50 text-purple-600 hover:bg-purple-50",
  },
  {
    id: 4,
    name: "Lucas Hoffmann",
    initials: "LH",
    role: "Editor",
    email: "lucas@sejajar.co",
    tasks: 52,
    joined: "Jan 5, 2023",
    status: "active",
    avatarBg: "bg-pink-50 text-pink-600",
    roleBg: "bg-pink-50 text-pink-500 hover:bg-pink-50",
  },
  {
    id: 5,
    name: "Aria Thompson",
    initials: "AT",
    role: "Editor",
    email: "aria@sejajar.co",
    tasks: 41,
    joined: "Apr 12, 2023",
    status: "active",
    avatarBg: "bg-pink-100 text-pink-700",
    roleBg: "bg-pink-50 text-pink-500 hover:bg-pink-50",
  },
  {
    id: 6,
    name: "Diego Santos",
    initials: "DS",
    role: "Admin Social Media",
    email: "diego@sejajar.co",
    tasks: 33,
    joined: "Mar 1, 2023",
    status: "active",
    avatarBg: "bg-emerald-50 text-emerald-600",
    roleBg: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
  },
  {
    id: 7,
    name: "Nina Patel",
    initials: "NP",
    role: "Admin Social Media",
    email: "nina@sejajar.co",
    tasks: 28,
    joined: "Jul 20, 2023",
    status: "active",
    avatarBg: "bg-emerald-100 text-emerald-700",
    roleBg: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
  },
  {
    id: 8,
    name: "Oliver Zhang",
    initials: "OZ",
    role: "Owner",
    email: "oliver@sejajar.co",
    tasks: 0,
    joined: "Jun 1, 2022",
    status: "active",
    avatarBg: "bg-amber-50 text-amber-600",
    roleBg: "bg-amber-50 text-amber-600 hover:bg-amber-50",
  },
  {
    id: 9,
    name: "Sophia Williams",
    initials: "SW",
    role: "Super Admin",
    email: "sophia@sejajar.co",
    tasks: 0,
    joined: "Jan 1, 2022",
    status: "active",
    avatarBg: "bg-red-50 text-red-600",
    roleBg: "bg-red-50 text-red-600 hover:bg-red-50",
  },
];

export const usersCards: CardDashboardProps[] = [
  {
    title: "Content Lead",
    value: 5,
    description: "Assigned Roles",
    icon: UserRound,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
  {
    title: "Content Editor",
    value: 10,
    description: "Assigned Roles",
    icon: UserRound,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "Script Writer",
    value: 6,
    description: "Assigned Roles",
    icon: UserRound,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Admin Social Media",
    value: 4,
    description: "Assigned Roles",
    icon: UserRound,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
];

export const rolePermissionsData: RolePermissionItem[] = [
  {
    id: 1,
    roleName: "Owner",
    userCount: 1,
    roleBg: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    permissions: [
      "Dashboard",
      "Contracts",
      "Content Plan",
      "Schedule",
      "Analytics",
      "Team",
      "Settings",
    ],
  },
  {
    id: 2,
    roleName: "Content Lead",
    userCount: 1,
    roleBg: "bg-blue-50 text-blue-600 hover:bg-blue-50",
    permissions: [
      "Dashboard",
      "Contracts",
      "Content Plan",
      "Tasks",
      "Schedule",
      "Analytics",
      "Settings",
    ],
  },
  {
    id: 3,
    roleName: "Editor",
    userCount: 2,
    roleBg: "bg-pink-50 text-pink-500 hover:bg-pink-50",
    permissions: ["Dashboard", "Content Plan", "Tasks", "Settings"],
  },
  {
    id: 4,
    roleName: "Script Writer",
    userCount: 2,
    roleBg: "bg-purple-50 text-purple-600 hover:bg-purple-50",
    permissions: ["Dashboard", "Content Plan", "Tasks", "Settings"],
  },
  {
    id: 5,
    roleName: "Admin Social Media",
    userCount: 2,
    roleBg: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    permissions: ["Dashboard", "Content Plan", "Tasks", "Schedule", "Settings"],
  },
];
