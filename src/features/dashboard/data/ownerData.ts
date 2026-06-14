import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";
import { ChartNoAxesColumn, FileText, TrendingUp } from "lucide-react";

export const ownerCards: CardDashboardProps[] = [
  {
    title: "Active Contracts",
    value: 12,
    description: "Active Contracts",
    icon: FileText,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
  {
    title: "Total Employee",
    value: 24,
    description: "Total Employee",
    icon: FileText,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
  {
    title: "Content Published",
    value: 18,
    description: "Content Published",
    icon: ChartNoAxesColumn,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Revenue",
    value: "Rp 115M",
    description: "Revenue of This Month",
    icon: TrendingUp,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
];

export interface EmployeePerformanceData {
  id: number;
  name: string;
  role: string;
  initials: string;
  tasksCount: number;
  completionRate: number;
  avatarBg: string;
  month: string;
  year: number;
}

export const employeePerformanceData: EmployeePerformanceData[] = [
  // 2026
  {
    id: 1,
    name: "Lucas H.",
    role: "Editor",
    initials: "LH",
    tasksCount: 52,
    completionRate: 95,
    avatarBg: "bg-pink-50 text-pink-600",
    month: "Jun",
    year: 2026,
  },
  {
    id: 2,
    name: "Aria T.",
    role: "Editor",
    initials: "AT",
    tasksCount: 41,
    completionRate: 92,
    avatarBg: "bg-pink-50 text-pink-600",
    month: "Jun",
    year: 2026,
  },
  {
    id: 3,
    name: "James R.",
    role: "Script Writer",
    initials: "JR",
    tasksCount: 38,
    completionRate: 90,
    avatarBg: "bg-indigo-50 text-indigo-600",
    month: "Jun",
    year: 2026,
  },
  {
    id: 4,
    name: "Diego S.",
    role: "Admin",
    initials: "DS",
    tasksCount: 33,
    completionRate: 88,
    avatarBg: "bg-emerald-50 text-emerald-600",
    month: "Jun",
    year: 2026,
  },
  {
    id: 5,
    name: "Mia C.",
    role: "Script Writer",
    initials: "MC",
    tasksCount: 29,
    completionRate: 85,
    avatarBg: "bg-indigo-50 text-indigo-600",
    month: "Jun",
    year: 2026,
  },
  {
    id: 6,
    name: "Nina P.",
    role: "Admin",
    initials: "NP",
    tasksCount: 28,
    completionRate: 83,
    avatarBg: "bg-emerald-50 text-emerald-600",
    month: "Jun",
    year: 2026,
  },
  // 2025
  {
    id: 1,
    name: "Lucas H.",
    role: "Editor",
    initials: "LH",
    tasksCount: 48,
    completionRate: 91,
    avatarBg: "bg-pink-50 text-pink-600",
    month: "Dec",
    year: 2025,
  },
  {
    id: 2,
    name: "Aria T.",
    role: "Editor",
    initials: "AT",
    tasksCount: 45,
    completionRate: 94,
    avatarBg: "bg-pink-50 text-pink-600",
    month: "Dec",
    year: 2025,
  },
  {
    id: 3,
    name: "James R.",
    role: "Script Writer",
    initials: "JR",
    tasksCount: 40,
    completionRate: 89,
    avatarBg: "bg-indigo-50 text-indigo-600",
    month: "Dec",
    year: 2025,
  },
  {
    id: 4,
    name: "Diego S.",
    role: "Admin",
    initials: "DS",
    tasksCount: 30,
    completionRate: 85,
    avatarBg: "bg-emerald-50 text-emerald-600",
    month: "Dec",
    year: 2025,
  },
  {
    id: 5,
    name: "Mia C.",
    role: "Script Writer",
    initials: "MC",
    tasksCount: 35,
    completionRate: 92,
    avatarBg: "bg-indigo-50 text-indigo-600",
    month: "Dec",
    year: 2025,
  },
  {
    id: 6,
    name: "Nina P.",
    role: "Admin",
    initials: "NP",
    tasksCount: 25,
    completionRate: 80,
    avatarBg: "bg-emerald-50 text-emerald-600",
    month: "Dec",
    year: 2025,
  },
];

