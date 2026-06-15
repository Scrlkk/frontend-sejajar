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
    id: 2,
    title: "Day 1 Challenge - Full Body Warmup",
    category: "Entertainment",
    categoryBg: "bg-pink-50 text-pink-600 border-pink-200/60",
    categoryDot: "bg-pink-500",
    status: "To Do",
    statusBg: "bg-gray-50/60 text-gray-600 hover:bg-gray-50/60",
    statusDot: "bg-gray-600",
    dueDateText: "Jun 20, 2026",
    dueDate: new Date(2026, 5, 20),
  },
  {
    id: 3,
    title: "Iced Coffee DIY - 5 Easy Recipes",
    category: "Education",
    categoryBg: "bg-purple-50 text-purple-600 border-purple-200/60",
    categoryDot: "bg-purple-500",
    status: "On Progress",
    statusBg: "bg-amber-50 text-amber-700 hover:bg-amber-50",
    statusDot: "bg-amber-500",
    dueDateText: "Jun 25, 2026",
    dueDate: new Date(2026, 5, 25),
  },
  {
    id: 3,
    title: "Iced Coffee DIY - 5 Easy Recipes",
    category: "Education",
    categoryBg: "bg-purple-50 text-purple-600 border-purple-200/60",
    categoryDot: "bg-purple-500",
    status: "On Progress",
    statusBg: "bg-amber-50 text-amber-700 hover:bg-amber-50",
    statusDot: "bg-amber-500",
    dueDateText: "Jun 25, 2026",
    dueDate: new Date(2026, 5, 25),
  },
];
