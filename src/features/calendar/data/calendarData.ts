import type { CalendarEvent } from "@/features/calendar/components/Calendar";
import type { MiniScheduleItem } from "@/features/calendar/components/CalendarSchedules";
import type { MiniPublishItem } from "@/features/calendar/components/CalendarPublish";
import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";
import { BarChart3, Smartphone, TabletSmartphone, TvMinimal } from "lucide-react";

export const myEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Behind the Glam...",
    time: "15:00",
    date: new Date(2026, 5, 15),
    platform: "Instagram",
    badgeBg: "bg-pink-50 text-pink-500 hover:bg-pink-100",
    lineColor: "border-pink-500",
    status: "Schedule",
  },
  {
    id: 2,
    title: "Foundation Tutor...",
    time: "09:00",
    date: new Date(2026, 5, 13),
    platform: "Instagram",
    badgeBg: "bg-pink-50 text-pink-500 hover:bg-pink-100",
    lineColor: "border-pink-500",
    status: "Schedule",
  },
  {
    id: 3,
    title: "Skincare Morning...",
    time: "18:00",
    date: new Date(2026, 5, 14),
    platform: "Youtube",
    badgeBg: "bg-red-50 text-red-500 hover:bg-red-100",
    lineColor: "border-red-500",
    status: "Revision",
  },
  {
    id: 4,
    title: "Aesthetic Mornin...",
    time: "07:00",
    date: new Date(2026, 5, 23),
    platform: "TikTok",
    badgeBg: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    lineColor: "border-gray-800",
    status: "Draft",
  },
];

export const miniSchedules: MiniScheduleItem[] = [
  {
    id: "1",
    title: "Skincare Morning Routine",
    category: "Youtube",
    categoryBg: "bg-red-50 text-red-600 border-red-200",
    categoryDot: "bg-red-600",
    status: "Revision",
    statusBg: "bg-red-100 text-red-600 hover:bg-red-100",
    statusDot: "bg-red-600",
    platform: "Youtube",
    time: "06:00",
  },
  {
    id: "2",
    title: "Morning Coffee",
    category: "Instagram",
    categoryBg: "bg-pink-50 text-pink-600 border-pink-200",
    categoryDot: "bg-pink-600",
    status: "Schedule",
    statusBg: "bg-blue-100 text-blue-600 hover:bg-blue-100",
    statusDot: "bg-blue-600",
    platform: "Instagram",
    time: "08:00",
  },
];

export const publishItems: MiniPublishItem[] = [
  {
    id: 1,
    title: "Iced Coffee DIY - 5 Easy Recipes",
    dateText: "May 12, 2024 · 11:00",
  },
  {
    id: 2,
    title: "Morning Coffee Routine Reel",
    dateText: "May 13, 2024 · 08:30",
  },
];

export const calendarCards: CardDashboardProps[] = [
  {
    title: "Instagram",
    value: 12,
    description: "Platform Summary",
    icon: TabletSmartphone,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "Youtube",
    value: 24,
    description: "Platform Summary",
    icon: TvMinimal,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Tiktok",
    value: 18,
    description: "Platform Summary",
    icon: Smartphone,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
  {
    title: "Total Summary",
    value: 6,
    description: "This Month",
    icon: BarChart3,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
];