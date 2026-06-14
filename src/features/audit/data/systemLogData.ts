import {
  Activity,
  KeyRoundIcon,
  DatabaseBackup,
  Package,
} from "lucide-react";
import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";
import type { ActivityLogItem } from "@/features/audit/components/SystemLog";



const now = new Date();
const lastWeek = new Date(now);
lastWeek.setDate(now.getDate() - 7);
const lastMonth = new Date(now);
lastMonth.setMonth(now.getMonth() - 1);
const lastYear = new Date(now);
lastYear.setFullYear(now.getFullYear() - 1);

export const activityLogs: ActivityLogItem[] = [
  {
    id: 1,
    name: "Diego Santos",
    initials: "DS",
    avatarBg: "bg-emerald-50 text-emerald-600",
    actionType: "UPDATE",
    actionBg: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    description:
      'Scheduled "Foundation Tutorial" on Instagram for Jun 25 at 9:00 AM',
    date: "Jun 10, 2026",
  },
  {
    id: 2,
    name: "Lucas Hoffmann",
    initials: "LH",
    avatarBg: "bg-pink-50 text-pink-600",
    actionType: "UPDATE",
    actionBg: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    description: 'Uploaded edited video for "Skincare Routine Reel"',
    date: "Jun 9, 2026",
  },
  {
    id: 3,
    name: "Sarah Mitchell",
    initials: "SM",
    avatarBg: "bg-blue-50 text-blue-600",
    actionType: "CREATE",
    actionBg: "bg-pink-100 text-pink-600 hover:bg-pink-100",
    description: 'Created new content item "Iced Coffee DIY - 5 Easy Recipes"',
    date: "Jun 8, 2026",
  },
  {
    id: 4,
    name: "Diego Santos",
    initials: "DS",
    avatarBg: "bg-emerald-50 text-emerald-600",
    actionType: "PUBLISH",
    actionBg: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    description:
      'Published "Behind the Glam - BTS Shoot" successfully on Instagram',
    date: "Jun 7, 2026",
  },
  {
    id: 5,
    name: "James Rivera",
    initials: "JR",
    avatarBg: "bg-purple-50 text-purple-600",
    actionType: "UPDATE",
    actionBg: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    description: 'Submitted script for "Day 1 Challenge" for review',
    date: "Jun 7, 2026",
  },
  {
    id: 6,
    name: "Sophia Williams",
    initials: "SW",
    avatarBg: "bg-red-50 text-red-600",
    actionType: "CREATE",
    actionBg: "bg-pink-100 text-pink-600 hover:bg-pink-100",
    description: 'Added new team member "Nina Patel" as Admin Social Media',
    date: "Jun 6, 2026",
  },
];

export const logsCards: CardDashboardProps[] = [
  {
    title: "Total Activity",
    value: "350",
    description: "Last 7 days",
    icon: Activity,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
  {
    title: "Login",
    value: "124",
    description: "Last 7 days",
    icon: KeyRoundIcon,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
  {
    title: "Backup Database",
    value: "18 GB",
    description: "Last backup 10 mins ago",
    icon: DatabaseBackup,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Storage Usage",
    value: "78%",
    description: "Total storage usage",
    icon: Package,
    iconColor: "text-gray-600",
    iconBgColor: "bg-gray-600/10",
  },
];
