import {
  UsersRound,
  Activity,
  ShieldCogCorner,
  UserRoundCog,
} from "lucide-react";
import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";
import type { HealthMetric } from "@/features/dashboard/components/SystemHealth";
import type { GraphicDonutData } from "@/features/dashboard/components/GraphicDonut";



export const superadminCards: CardDashboardProps[] = [
  {
    title: "Total Users",
    value: 32,
    description: "Overall Users",
    icon: UsersRound,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
  {
    title: "Active Users",
    value: 24,
    description: "All Online Users",
    icon: Activity,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "Roles Assigned",
    value: 5,
    description: "All Roles",
    icon: UserRoundCog,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "System Event",
    value: "12",
    description: "Last 7 days",
    icon: ShieldCogCorner,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
];

export const systemMetrics: HealthMetric[] = [
  {
    label: "API Uptime",
    valueText: "99.9%",
    percentage: 99.9,
    barColor: "text-emerald-500",
  },
  {
    label: "Storage Used",
    valueText: "64%",
    percentage: 64,
    barColor: "text-amber-500",
  },
  {
    label: "Active Sessions",
    valueText: "7/50",
    percentage: (7 / 50) * 100,
    barColor: "text-red-800",
  },
];

export const sampleRoles: GraphicDonutData[] = [
  { name: "Content Lead", value: 1, color: "bg-[#6366f1]", fill: "#6366f1" },
  { name: "Scripter", value: 2, color: "bg-[#a855f7]", fill: "#a855f7" },
  { name: "Editor", value: 2, color: "bg-[#ec4899]", fill: "#ec4899" },
  { name: "Admin", value: 2, color: "bg-[#10b981]", fill: "#10b981" },
  { name: "Owner", value: 1, color: "bg-[#f59e0b]", fill: "#f59e0b" },
  { name: "Super Admin", value: 1, color: "bg-[#ef4444]", fill: "#ef4444" },
];
