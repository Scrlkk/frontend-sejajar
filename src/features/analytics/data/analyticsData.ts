import type { EngagementData } from "@/features/analytics/components/PlatformEngagement";
import type { PerformingContentItem } from "@/features/analytics/components/PerformingContent";
import { Eye, Heart, Share2, TrendingUp } from "lucide-react";
import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";

export const analyticsDataCards: CardDashboardProps[] = [
  {
    title: "Total Views",
    value: "712K",
    description: "This Month",
    icon: Eye,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "Total Likes",
    value: "12K",
    description: "This Month",
    icon: Heart,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
  {
    title: "Total Shares",
    value: "3.7K",
    description: "This Month",
    icon: Share2,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
  {
    title: "Avg. Engagement",
    value: "7.1%",
    description: "This Month",
    icon: TrendingUp,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
];

export const trendData: EngagementData[] = [
  { name: "Week 1", TikTok: 4200, Instagram: 3800, YouTube: 1200 },
  { name: "Week 2", TikTok: 5800, Instagram: 4200, YouTube: 1800 },
  { name: "Week 3", TikTok: 4900, Instagram: 5100, YouTube: 2100 },
  { name: "Week 4", TikTok: 7200, Instagram: 6300, YouTube: 2800 },
  { name: "Week 5", TikTok: 6800, Instagram: 5900, YouTube: 3200 },
  { name: "Week 6", TikTok: 9000, Instagram: 7400, YouTube: 3800 },
];

export type ManualEngagementEntry = {
  id: number;
  contentTitle: string;
  platform: "Instagram" | "TikTok" | "YouTube" | "Twitter";
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
};

export const engagementEntries: ManualEngagementEntry[] = [
  {
    id: 1,
    contentTitle: "Foundation Tutorial - Spring Collection",
    platform: "Instagram",
    date: "2026-06-10",
    views: 12400,
    likes: 1800,
    comments: 245,
    shares: 320,
  },
  {
    id: 2,
    contentTitle: "Morning Coffee Routine",
    platform: "TikTok",
    date: "2026-06-08",
    views: 8900,
    likes: 2300,
    comments: 189,
    shares: 560,
  },
  {
    id: 3,
    contentTitle: "Behind the Glam - BTS Shoot",
    platform: "Instagram",
    date: "2026-06-05",
    views: 6700,
    likes: 1100,
    comments: 98,
    shares: 210,
  },
  {
    id: 4,
    contentTitle: "Iced Coffee DIY Tutorial",
    platform: "TikTok",
    date: "2026-06-01",
    views: 15200,
    likes: 3400,
    comments: 312,
    shares: 780,
  },
  {
    id: 5,
    contentTitle: "Product Review - Summer Palette",
    platform: "YouTube",
    date: "2026-05-28",
    views: 4300,
    likes: 620,
    comments: 87,
    shares: 145,
  },
];

export const topContentData: PerformingContentItem[] = [
  {
    id: 1,
    rank: 1,
    rankColor: "text-amber-500",
    title: "Foundation Tutorial - Spring Collection",
    platform: "Instagram",
    platformBg: "bg-gray-100 text-gray-500 hover:bg-gray-100",
    views: 24800,
    likes: 3200,
    shares: 890,
    period: "all",
  },
  {
    id: 2,
    rank: 2,
    rankColor: "text-slate-400",
    title: "Morning Coffee Routine",
    platform: "TikTok",
    platformBg: "bg-gray-100 text-gray-500 hover:bg-gray-100",
    views: 18600,
    likes: 5400,
    shares: 1200,
    period: "all",
  },
  {
    id: 3,
    rank: 3,
    rankColor: "text-slate-400",
    title: "Behind the Glam - BTS Shoot",
    platform: "Instagram",
    platformBg: "bg-gray-100 text-gray-500 hover:bg-gray-100",
    views: 15200,
    likes: 2800,
    shares: 640,
    period: "all",
  },
  {
    id: 4,
    rank: 4,
    rankColor: "text-slate-400",
    title: "Iced Coffee DIY Tutorial",
    platform: "TikTok",
    platformBg: "bg-gray-100 text-gray-500 hover:bg-gray-100",
    views: 12400,
    likes: 4100,
    shares: 980,
    period: "all",
  },
  {
    id: 5,
    rank: 1,
    rankColor: "text-amber-500",
    title: "Morning Coffee Routine",
    platform: "TikTok",
    platformBg: "bg-gray-100 text-gray-500 hover:bg-gray-100",
    views: 6200,
    likes: 1800,
    shares: 420,
    period: "month",
  },
  {
    id: 6,
    rank: 2,
    rankColor: "text-slate-400",
    title: "Foundation Tutorial - Spring Collection",
    platform: "Instagram",
    platformBg: "bg-gray-100 text-gray-500 hover:bg-gray-100",
    views: 4500,
    likes: 980,
    shares: 210,
    period: "month",
  },
  {
    id: 7,
    rank: 3,
    rankColor: "text-slate-400",
    title: "Iced Coffee DIY Tutorial",
    platform: "TikTok",
    platformBg: "bg-gray-100 text-gray-500 hover:bg-gray-100",
    views: 3800,
    likes: 1200,
    shares: 310,
    period: "month",
  },
];
