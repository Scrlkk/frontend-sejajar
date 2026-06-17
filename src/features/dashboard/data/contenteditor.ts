import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";
import { CircleCheckBig, Clock, FileClock, TriangleAlert } from "lucide-react";
import type { DeadlineItem } from "@/features/tasks/components/UpcomingDeadlines";

export const contentEditorCards: CardDashboardProps[] = [
  {
    title: "To Do",
    value: 12,
    description: "Awaiting Start",
    icon: FileClock,
    iconColor: "text-gray-600",
    iconBgColor: "bg-gray-600/10",
  },
  {
    title: "On Progress",
    value: 24,
    description: "Currently Editing",
    icon: Clock,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Revision",
    value: 18,
    description: "Needs Attention",
    icon: TriangleAlert,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
  {
    title: "Completed",
    value: 12,
    description: "Finalized",
    icon: CircleCheckBig,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
];

export const sampleDeadlines: DeadlineItem[] = [
  {
    id: 1,
    title: "Skincare Morning Routine Reel",
    category: "Lifestyle",
    categoryBg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    categoryDot: "bg-emerald-500",
    status: "To Do",
    statusBg: "bg-gray-50/60 text-gray-600 hover:bg-gray-50/60",
    statusDot: "bg-gray-600",
    dueDateText: "Jun 12, 2026",
    dueDate: new Date(2026, 5, 12),
  },
  {
    id: 8,
    title: "Day 1 Challenge - Full Body Warmup",
    category: "Entertainment",
    categoryBg: "bg-orange-50 text-orange-600 border-orange-200/60",
    categoryDot: "bg-orange-500",
    status: "Revision",
    statusBg: "bg-red-50 text-red-600 hover:bg-red-50",
    statusDot: "bg-red-500",
    dueDateText: "Jun 20, 2026",
    dueDate: new Date(2026, 5, 20),
  },
  {
    id: 11,
    title: "Iced Coffee DIY - 5 Easy Recipes",
    category: "Education",
    categoryBg: "bg-purple-50 text-purple-600 border-purple-200/60",
    categoryDot: "bg-purple-500",
    status: "Approved",
    statusBg: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    statusDot: "bg-emerald-500",
    dueDateText: "Jun 25, 2026",
    dueDate: new Date(2026, 5, 25),
  },
  {
    id: 2,
    title: "Coffee Bean Origins - Edu Series Ep.1",
    category: "Education",
    categoryBg: "bg-blue-50 text-blue-600 border-blue-200/60",
    categoryDot: "bg-blue-500",
    status: "To Do",
    statusBg: "bg-gray-50/60 text-gray-600 hover:bg-gray-50/60",
    statusDot: "bg-gray-600",
    dueDateText: "Jun 22, 2026",
    dueDate: new Date(2026, 5, 22),
  },
];
