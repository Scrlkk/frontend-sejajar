// =============================================================================
// CENTRALIZED MOCK DATA
// All mock/sample data consolidated from src/features/*/data/ directories.
// =============================================================================

// --- Type Imports from Components ---
import type { EngagementData } from "@/features/analytics/components/PlatformEngagement";
import type { PerformingContentItem } from "@/features/analytics/components/PerformingContent";
import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";
import type { ActivityLogItem } from "@/features/audit/components/SystemLog";
import type { CalendarEvent } from "@/features/calendar/components/Calendar";
import type { MiniScheduleItem } from "@/features/calendar/components/CalendarSchedules";
import type { MiniPublishItem } from "@/features/calendar/components/CalendarPublish";
import type { GraphicDonutData } from "@/features/dashboard/components/GraphicDonut";
import type { ContentOutputData } from "@/features/contents/components/ContentOutput";
import type { ContractItem } from "@/features/contracts/components/ActiveContracts";
import type { ContractCardItem } from "@/features/contracts/components/Contracts";
import type { ContentPlanCardItem } from "@/features/contents/components/ContentPlan";
import type { HealthMetric } from "@/features/dashboard/components/SystemHealth";
import type { DeadlineItem } from "@/features/tasks/components/UpcomingDeadlines";
import type { RolePermissionItem } from "@/features/users/components/RolePermissions";
import type { FeedbackItem } from "@/features/reviews/components/Feedback";
import type { CommentItem } from "@/features/reviews/components/RecentComments";
import type { ScheduleItem } from "@/features/tasks/components/PostSchedules";
import type { PublishItem } from "@/features/tasks/components/ReadyPublish";
import type { QueueItem } from "@/features/tasks/components/PublishContent";
import type { ScheduledContentItem } from "@/features/tasks/components/SchedulesContent";
import type { TaskBoardItem } from "@/features/tasks/components/TasksContent";
import type { UploadedVideoItem } from "@/features/tasks/components/Uploads";

// --- Icon Imports ---
import {
  Eye, Heart, Share2, TrendingUp,
  Activity, KeyRoundIcon, DatabaseBackup, Package,
  BarChart3, Smartphone, TabletSmartphone, TvMinimal,
  FileText, UserRound, UsersRound, Send, Video,
  CheckCircle, Clock, SquareDashedText,
  CircleCheckBig, FileClock, TriangleAlert,
  PenLine, ChartNoAxesColumn, UserRoundCog,
  CalendarCheck, Image,
  Hourglass, FileWarning, Clapperboard, Hash, FileUp, FilePen, ClipboardPen,
  Calendar,
} from "lucide-react";

// =============================================================================
// ANALYTICS
// =============================================================================

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
  // 2025
  { name: "Jan", TikTok: 15000, Instagram: 12000, YouTube: 4500, year: 2025 },
  { name: "Feb", TikTok: 18500, Instagram: 14200, YouTube: 5800, year: 2025 },
  { name: "Mar", TikTok: 17000, Instagram: 16500, YouTube: 6100, year: 2025 },
  { name: "Apr", TikTok: 22000, Instagram: 18300, YouTube: 7800, year: 2025 },
  { name: "May", TikTok: 21800, Instagram: 17900, YouTube: 8200, year: 2025 },
  { name: "Jun", TikTok: 26000, Instagram: 21400, YouTube: 9800, year: 2025 },
  { name: "Jul", TikTok: 28000, Instagram: 23000, YouTube: 11000, year: 2025 },
  { name: "Aug", TikTok: 31000, Instagram: 25000, YouTube: 12500, year: 2025 },
  { name: "Sep", TikTok: 29500, Instagram: 24200, YouTube: 11800, year: 2025 },
  { name: "Oct", TikTok: 34000, Instagram: 28000, YouTube: 13200, year: 2025 },
  { name: "Nov", TikTok: 38000, Instagram: 31000, YouTube: 14500, year: 2025 },
  { name: "Dec", TikTok: 42000, Instagram: 35000, YouTube: 16000, year: 2025 },
  // 2026
  { name: "Jan", TikTok: 32000, Instagram: 27000, YouTube: 12500, year: 2026 },
  { name: "Feb", TikTok: 35500, Instagram: 29200, YouTube: 13800, year: 2026 },
  { name: "Mar", TikTok: 39000, Instagram: 32500, YouTube: 15100, year: 2026 },
  { name: "Apr", TikTok: 44000, Instagram: 36300, YouTube: 17800, year: 2026 },
  { name: "May", TikTok: 46800, Instagram: 38900, YouTube: 19200, year: 2026 },
  { name: "Jun", TikTok: 52000, Instagram: 43400, YouTube: 22800, year: 2026 },
  { name: "Jul", TikTok: 55000, Instagram: 45000, YouTube: 23500, year: 2026 },
  { name: "Aug", TikTok: 58000, Instagram: 48000, YouTube: 25000, year: 2026 },
  { name: "Sep", TikTok: 61000, Instagram: 51000, YouTube: 27000, year: 2026 },
  { name: "Oct", TikTok: 65000, Instagram: 54000, YouTube: 29000, year: 2026 },
  { name: "Nov", TikTok: 70000, Instagram: 59000, YouTube: 32000, year: 2026 },
  { name: "Dec", TikTok: 75000, Instagram: 63000, YouTube: 35000, year: 2026 },
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

export const engagementInitialContents = [
  {
    title: "Behind the Glam - Product Shoot BTS",
    campaign: "Spring Product Launch",
    platform: "Instagram" as const,
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Behind the Scenes",
    pillarBg: "bg-purple-50 text-purple-600",
    pillarDot: "bg-purple-500",
    status: "Published",
    statusBg: "bg-blue-50 text-blue-600",
    statusDot: "bg-blue-500",
  },
  {
    title: "Foundation Tutorial - Spring Collection",
    campaign: "Spring Product Launch",
    platform: "Instagram" as const,
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Product Review",
    pillarBg: "bg-amber-50 text-amber-700",
    pillarDot: "bg-amber-500",
    status: "Approved",
    statusBg: "bg-emerald-50 text-emerald-600",
    statusDot: "bg-emerald-500",
  },
  {
    title: "Skincare Morning Routine Reel",
    campaign: "Spring Product Launch",
    platform: "Instagram" as const,
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Lifestyle",
    pillarBg: "bg-emerald-50 text-emerald-600",
    pillarDot: "bg-emerald-500",
    status: "On Progress",
    statusBg: "bg-amber-50 text-amber-600",
    statusDot: "bg-amber-500",
  },
  {
    title: "Aesthetic Morning Coffee Routine",
    campaign: "Summer Lifestyle Series",
    platform: "TikTok" as const,
    platformBg: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    pillar: "Lifestyle",
    pillarBg: "bg-emerald-50 text-emerald-600",
    pillarDot: "bg-emerald-500",
    status: "Draft",
    statusBg: "bg-gray-100 text-gray-500",
    statusDot: "bg-gray-400",
  },
  {
    title: "Live Q&A – Career Consultation",
    campaign: "Summer Lifestyle Series",
    platform: "Instagram" as const,
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Education",
    pillarBg: "bg-blue-50 text-blue-600",
    pillarDot: "bg-blue-500",
    status: "Draft",
    statusBg: "bg-gray-100 text-gray-500",
    statusDot: "bg-gray-400",
  },
  {
    title: "5 Tips Belajar Cepat & Efektif",
    campaign: "Education Series",
    platform: "TikTok" as const,
    platformBg: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    pillar: "Education",
    pillarBg: "bg-blue-50 text-blue-600",
    pillarDot: "bg-blue-500",
    status: "Draft",
    statusBg: "bg-gray-100 text-gray-500",
    statusDot: "bg-gray-400",
  },
  {
    title: "Morning Coffee Routine",
    campaign: "Summer Lifestyle Series",
    platform: "TikTok" as const,
    platformBg: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    pillar: "Lifestyle",
    pillarBg: "bg-emerald-50 text-emerald-600",
    pillarDot: "bg-emerald-500",
    status: "Published",
    statusBg: "bg-cyan-50 text-cyan-700",
    statusDot: "bg-cyan-550",
  },
  {
    title: "Behind the Glam - BTS Shoot",
    campaign: "Spring Product Launch",
    platform: "Instagram" as const,
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Behind the Scenes",
    pillarBg: "bg-purple-50 text-purple-600",
    pillarDot: "bg-purple-500",
    status: "Published",
    statusBg: "bg-cyan-50 text-cyan-700",
    statusDot: "bg-cyan-550",
  },
  {
    title: "Iced Coffee DIY Tutorial",
    campaign: "Summer Lifestyle Series",
    platform: "TikTok" as const,
    platformBg: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    pillar: "Lifestyle",
    pillarBg: "bg-emerald-50 text-emerald-600",
    pillarDot: "bg-emerald-500",
    status: "Published",
    statusBg: "bg-cyan-50 text-cyan-700",
    statusDot: "bg-cyan-550",
  },
  {
    title: "Product Review - Summer Palette",
    campaign: "Summer Lifestyle Series",
    platform: "YouTube" as const,
    platformBg: "bg-red-50 text-red-700 hover:bg-red-50",
    pillar: "Product Review",
    pillarBg: "bg-amber-50 text-amber-700",
    pillarDot: "bg-amber-500",
    status: "Published",
    statusBg: "bg-cyan-50 text-cyan-700",
    statusDot: "bg-cyan-550",
  },
];

// =============================================================================
// AUDIT / SYSTEM LOGS
// =============================================================================

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
  {
    id: 7,
    name: "Sophia Williams",
    initials: "SW",
    avatarBg: "bg-red-50 text-red-600",
    actionType: "DELETE",
    actionBg: "bg-red-100 text-red-700 hover:bg-red-100",
    description: 'Deleted content item "Old Summer Campaign"',
    date: "Jun 6, 2026",
  },
  {
    id: 8,
    name: "Nina Patel",
    initials: "NP",
    avatarBg: "bg-emerald-50 text-emerald-600",
    actionType: "LOGIN",
    actionBg: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    description: 'Logged into the system from IP 192.168.1.45',
    date: "Jun 5, 2026",
  },
  {
    id: 9,
    name: "Sarah Mitchell",
    initials: "SM",
    avatarBg: "bg-blue-50 text-blue-600",
    actionType: "LOGOUT",
    actionBg: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    description: 'Logged out of the system',
    date: "Jun 5, 2026",
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


// =============================================================================
// CALENDAR
// =============================================================================

export const myEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Behind the Glam...",
    time: "15:00",
    date: new Date(2026, 5, 15),
    platform: "Instagram",
    badgeBg: "bg-pink-50 text-pink-500 hover:bg-pink-100",
    lineColor: "border-pink-500",
    status: "Scheduled",
  },
  {
    id: 2,
    title: "Foundation Tutor...",
    time: "09:00",
    date: new Date(2026, 5, 13),
    platform: "Instagram",
    badgeBg: "bg-pink-50 text-pink-500 hover:bg-pink-100",
    lineColor: "border-pink-500",
    status: "Scheduled",
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
    status: "Approved",
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
    dateText: "May 12, 2024 • 11:00",
  },
  {
    id: 2,
    title: "Morning Coffee Routine Reel",
    dateText: "May 13, 2024 • 08:30",
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


// =============================================================================
// CLIENTS
// =============================================================================

export const clientsCards: CardDashboardProps[] = [
  {
    title: "Total Clients",
    value: 5,
    description: "All Clients",
    icon: UsersRound,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-600/10",
  },
  {
    title: "New Clients",
    value: 12,
    description: "This Month",
    icon: UserRound,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "Active Contracts",
    value: 6,
    description: "Clients Contracts",
    icon: FileText,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Completed Contracts",
    value: 18,
    description: "Clients Contracts",
    icon: FileText,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
];

export interface ClientData {
  client_id: number;
  client_name: string;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  joinedDate?: string;
  status?: "active" | "inactive";
}

export const sampleClients: ClientData[] = [
  {
    client_id: 1,
    client_name: "John Vision",
    company_name: "TechVision Corp",
    contact_email: "john@techvision.com",
    contact_phone: "+62 812-3456-7890",
    joinedDate: "Jan 12, 2024",
    status: "active",
  },
  {
    client_id: 2,
    client_name: "Sarah Brew",
    company_name: "FreshBrew Coffee",
    contact_email: "sarah@freshbrew.co",
    contact_phone: "+62 899-8877-6655",
    joinedDate: "Mar 1, 2024",
    status: "active",
  },
  {
    client_id: 3,
    client_name: "Elena Glow",
    company_name: "BeautyGlow Brand",
    contact_email: "elena@beautyglow.com",
    contact_phone: "+62 821-4455-6677",
    joinedDate: "Apr 15, 2024",
    status: "inactive",
  },
  {
    client_id: 4,
    client_name: "David Fit",
    company_name: "FitLife Sports",
    contact_email: "david@fitlife.co.id",
    contact_phone: "+62 811-2233-4455",
    joinedDate: "May 1, 2024",
    status: "active",
  },
  {
    client_id: 5,
    client_name: "Michael Zara",
    company_name: "Zara Studio",
    contact_email: "michael@zara.studio",
    contact_phone: "+62 813-1122-3344",
    joinedDate: "Jun 10, 2024",
    status: "active",
  },
];


// =============================================================================
// CONTENTS
// =============================================================================

export const pillarData: GraphicDonutData[] = [
  { name: "Education", value: 48, color: "bg-blue-600", fill: "#2563eb" },
  { name: "Entertainment", value: 14, color: "bg-pink-500", fill: "#ec4899" },
  { name: "Lifestyle", value: 11, color: "bg-emerald-500", fill: "#10b981" },
  { name: "Product Review", value: 9, color: "bg-orange-500", fill: "#f97316" },
  {
    name: "Behind the Scenes",
    value: 5,
    color: "bg-purple-500",
    fill: "#8b5cf6",
  },
  { name: "Promotion", value: 4, color: "bg-red-600", fill: "#dc2626" },
  { name: "Comms", value: 6, color: "bg-cyan-600", fill: "#06b6d4" },
  { name: "Training", value: 3, color: "bg-fuchsia-600", fill: "#d946ef" },
];

export const outputData: ContentOutputData[] = [
  { month: "Jan", year: 2025, Published: 5, Scheduled: 2, Draft: 1 },
  { month: "Feb", year: 2025, Published: 7, Scheduled: 3, Draft: 2 },
  { month: "Mar", year: 2025, Published: 10, Scheduled: 5, Draft: 3 },
  { month: "Apr", year: 2025, Published: 8, Scheduled: 4, Draft: 4 },
  { month: "May", year: 2025, Published: 12, Scheduled: 6, Draft: 3 },
  { month: "Jun", year: 2025, Published: 9, Scheduled: 7, Draft: 5 },
  { month: "Jul", year: 2025, Published: 11, Scheduled: 4, Draft: 2 },
  { month: "Aug", year: 2025, Published: 14, Scheduled: 5, Draft: 4 },
  { month: "Sep", year: 2025, Published: 13, Scheduled: 8, Draft: 3 },
  { month: "Oct", year: 2025, Published: 10, Scheduled: 6, Draft: 6 },
  { month: "Nov", year: 2025, Published: 16, Scheduled: 3, Draft: 2 },
  { month: "Dec", year: 2025, Published: 18, Scheduled: 2, Draft: 1 },
  { month: "Jan", year: 2026, Published: 8, Scheduled: 3, Draft: 2 },
  { month: "Feb", year: 2026, Published: 12, Scheduled: 5, Draft: 3 },
  { month: "Mar", year: 2026, Published: 15, Scheduled: 4, Draft: 5 },
  { month: "Apr", year: 2026, Published: 10, Scheduled: 8, Draft: 6 },
  { month: "May", year: 2026, Published: 0, Scheduled: 12, Draft: 8 },
  { month: "Jun", year: 2026, Published: 0, Scheduled: 5, Draft: 12 },
];

export interface ContractPerformanceData {
  month: string;
  year: number;
  Active: number;
  Completed: number;
  Overdue: number;
}

export const performanceContentData: ContractPerformanceData[] = [
  { month: "Jan", year: 2025, Active: 15, Completed: 10, Overdue: 0 },
  { month: "Feb", year: 2025, Active: 20, Completed: 12, Overdue: 5 },
  { month: "Mar", year: 2025, Active: 25, Completed: 18, Overdue: 0 },
  { month: "Apr", year: 2025, Active: 30, Completed: 22, Overdue: 8 },
  { month: "May", year: 2025, Active: 35, Completed: 25, Overdue: 0 },
  { month: "Jun", year: 2025, Active: 40, Completed: 30, Overdue: 12 },
  { month: "Jul", year: 2025, Active: 45, Completed: 35, Overdue: 0 },
  { month: "Aug", year: 2025, Active: 50, Completed: 40, Overdue: 15 },
  { month: "Sep", year: 2025, Active: 55, Completed: 45, Overdue: 0 },
  { month: "Oct", year: 2025, Active: 60, Completed: 50, Overdue: 10 },
  { month: "Nov", year: 2025, Active: 65, Completed: 55, Overdue: 0 },
  { month: "Dec", year: 2025, Active: 70, Completed: 60, Overdue: 20 },
  { month: "Jan", year: 2026, Active: 35, Completed: 25, Overdue: 5 },
  { month: "Feb", year: 2026, Active: 40, Completed: 30, Overdue: 0 },
  { month: "Mar", year: 2026, Active: 45, Completed: 35, Overdue: 10 },
  { month: "Apr", year: 2026, Active: 50, Completed: 40, Overdue: 0 },
  { month: "May", year: 2026, Active: 55, Completed: 45, Overdue: 15 },
  { month: "Jun", year: 2026, Active: 60, Completed: 50, Overdue: 0 },
];



// =============================================================================
// CONTRACTS
// =============================================================================

export const contractDataCards: CardDashboardProps[] = [
  {
    title: "Total Contracts",
    value: "5",
    description: "Total Contracts",
    icon: FileText,
    iconColor: "text-gray-600",
    iconBgColor: "bg-gray-600/10",
  },
  {
    title: "Active Contracts",
    value: "3",
    description: "Active Contracts",
    icon: FileText,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "Completed Contracts",
    value: "2",
    description: "Complete Contracts",
    icon: FileText,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
  {
    title: "Overdue Contracts",
    value: "1",
    description: "Overdue Contracts",
    icon: FileText,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
];

export const plansDataCards: CardDashboardProps[] = [
  {
    title: "All Plans",
    value: "5",
    icon: FileText,
    iconColor: "text-slate-600",
    iconBgColor: "bg-slate-600/10",
  },
  {
    title: "Progress",
    value: "2",
    icon: FileText,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Review",
    value: "1",
    icon: FileText,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-600/10",
  },
  {
    title: "Approved",
    value: "1",
    icon: FileText,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "Published",
    value: "1",
    icon: FileText,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
  {
    title: "Days Left",
    value: "1",
    icon: Calendar,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
];

export const activeContractsData: ContractItem[] = [
  {
    id: 1,
    code: "CNT-2024-002",
    title: "Spring Product Launch",
    brand: "BeautyGlow Brand",
    platforms: ["Instagram", "TikTok"],
    currentProgress: 12,
    targetProgress: 18,
    date: "Mar 1, 2024",
  },
  {
    id: 2,
    code: "CNT-2024-003",
    title: "Summer Lifestyle Series",
    brand: "FreshBrew Coffee",
    platforms: ["TikTok", "Instagram", "YouTube"],
    currentProgress: 8,
    targetProgress: 30,
    date: "Apr 15, 2024",
  },
  {
    id: 3,
    code: "CNT-2024-004",
    title: "Fitness Challenge Campaign",
    brand: "FitLife Sports",
    platforms: ["TikTok", "Instagram"],
    currentProgress: 5,
    targetProgress: 40,
    date: "May 1, 2024",
    statusText: "Overdue",
  },
  {
    id: 4,
    code: "CNT-2024-005",
    title: "Autumn Fashion Lookbook",
    brand: "Zara Studio",
    platforms: ["Instagram", "YouTube"],
    currentProgress: 20,
    targetProgress: 20,
    date: "Jun 10, 2024",
    statusText: "Completed",
  },
];

export const sampleContractsData: ContractCardItem[] = [
  {
    id: 1,
    code: "CNT-2024-001",
    title: "Q1 Brand Awareness Campaign",
    brand: "TechVision Corp",
    description:
      "Quarterly brand awareness campaign focusing on product education and lifestyle content.",
    platforms: ["TikTok", "Instagram"],
    currentProgress: 24,
    targetProgress: 24,
    startDate: "Jan 1, 2024",
    endDate: "Mar 31, 2024",
    valueAmount: "Rp 15M",
    status: "Completed",
    statusBg: "bg-blue-100 text-blue-600 hover:bg-blue-100",
    statusDot: "bg-blue-500",
    year: 2024,
    createdBy: "Sarah Mitchell",
  },
  {
    id: 2,
    code: "CNT-2026-002",
    title: "Summer Lifestyle Series",
    brand: "FreshBrew Coffee",
    description:
      "Q2 seasonal campaign featuring summer beverages and outdoor activities.",
    platforms: ["TikTok", "Instagram"],
    currentProgress: 12,
    targetProgress: 24,
    startDate: "July 1, 2026",
    endDate: "August 15, 2026",
    valueAmount: "Rp 15M",
    status: "Active",
    statusBg: "bg-green-100 text-green-600 hover:bg-green-100",
    statusDot: "bg-green-500",
    year: 2026,
    createdBy: "Alisha Khan",
  },
  {
    id: 3,
    code: "CNT-2026-003",
    title: "Spring Product Launch",
    brand: "BeautyGlow Brand",
    description:
      "Spring collection launch campaign with product reviews, tutorials, and lifestyle content.",
    platforms: ["Instagram", "TikTok"],
    currentProgress: 12,
    targetProgress: 18,
    startDate: "June 1, 2026",
    endDate: "June 15, 2026",
    valueAmount: "Rp 22M",
    status: "Overdue",
    statusBg: "bg-red-100 text-red-600 hover:bg-red-100",
    statusDot: "bg-red-500",
    year: 2026,
    createdBy: "Michael Brown",
  },
  {
    id: 4,
    code: "CNT-2026-004",
    title: "Winter Campaign 2026",
    brand: "FitLife Sports",
    description:
      "Winter collection launch campaign with product reviews, tutorials, and lifestyle content.",
    platforms: ["Instagram", "TikTok"],
    currentProgress: 10,
    targetProgress: 10,
    startDate: "May 1, 2026",
    endDate: "May 15, 2026",
    valueAmount: "Rp 20M",
    status: "Completed",
    statusBg: "bg-blue-100 text-blue-600 hover:bg-blue-100",
    statusDot: "bg-blue-500",
    year: 2026,
    createdBy: "Sarah Mitchell",
  },

  {
    id: 5,
    code: "CNT-2025-001",
    title: "Year-End Mega Sale Campaign",
    brand: "ElectroShop",
    description:
      "Promotional campaign for electronics catalog and year-end discount events.",
    platforms: ["YouTube", "Instagram"],
    currentProgress: 30,
    targetProgress: 30,
    startDate: "Nov 1, 2025",
    endDate: "Dec 31, 2025",
    valueAmount: "Rp 45M",
    status: "Completed",
    statusBg: "bg-blue-100 text-blue-600 hover:bg-blue-100",
    statusDot: "bg-blue-500",
    year: 2025,
    createdBy: "Alisha Khan",
  },
  {
    id: 6,
    code: "CNT-2025-002",
    title: "Eco-Friendly Initiative",
    brand: "GreenLeaf Org",
    description:
      "Awareness campaign for sustainability products and recycling habits.",
    platforms: ["TikTok", "Instagram"],
    currentProgress: 15,
    targetProgress: 20,
    startDate: "Oct 10, 2025",
    endDate: "Nov 30, 2025",
    valueAmount: "Rp 18M",
    status: "Completed",
    statusBg: "bg-blue-100 text-blue-600 hover:bg-blue-100",
    statusDot: "bg-blue-500",
    year: 2025,
    createdBy: "Michael Brown",
  },
];

export const sampleContractInfoData = [
  { label: "Client", value: "TechVision Corp" },
  { label: "Code", value: "CNT-2024-001" },
  { label: "Start Date", value: "Jan 1, 2024" },
  { label: "End Date", value: "Mar 31, 2024" },
  { label: "Platforms", value: "TikTok, Instagram" },
  { label: "Contact Email", value: "john@techvision.com" },
  { label: "Contact Phone", value: "+62 812-3456-7890" },
];

export const sampleProductionProgress = {
  title: "Production Progress",
  current: 24,
  target: 24,
  items: [
    {
      label: "Draft",
      value: 1,
      dotColor: "bg-slate-500",
      textColor: "text-slate-500",
    },
    {
      label: "Assigned",
      value: 1,
      dotColor: "bg-blue-600",
      textColor: "text-blue-600",
    },
    {
      label: "On Progress",
      value: 1,
      dotColor: "bg-amber-600",
      textColor: "text-amber-600",
    },
    {
      label: "Review",
      value: 1,
      dotColor: "bg-purple-600",
      textColor: "text-purple-600",
    },
    {
      label: "Revision",
      value: 1,
      dotColor: "bg-red-600",
      textColor: "text-red-600",
    },
    {
      label: "Approved",
      value: 1,
      dotColor: "bg-emerald-600",
      textColor: "text-emerald-600",
    },
  ],
};

export const sampleTeamMembers = [
  {
    name: "Sarah Mitchell",
    role: "Content Lead",
    initials: "SM",
    avatarBg: "bg-indigo-50 text-indigo-600",
  },
  {
    name: "Alisha Khan",
    role: "Content Lead",
    initials: "AK",
    avatarBg: "bg-amber-50 text-amber-600",
  },
  {
    name: "Michael Brown",
    role: "Content Lead",
    initials: "MB",
    avatarBg: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "James Rivera",
    role: "Script Writer",
    initials: "JR",
    avatarBg: "bg-purple-50 text-purple-600",
  },
  {
    name: "Mia Chen",
    role: "Script Writer",
    initials: "MC",
    avatarBg: "bg-purple-50 text-purple-600",
  },
  {
    name: "Lucas Hoffmann",
    role: "Editor",
    initials: "LH",
    avatarBg: "bg-rose-50 text-rose-600",
  },
  {
    name: "Aria Thompson",
    role: "Editor",
    initials: "AT",
    avatarBg: "bg-rose-50 text-rose-600",
  },
  {
    name: "Diego Santos",
    role: "Admin Social Media",
    initials: "DS",
    avatarBg: "bg-teal-50 text-teal-600",
  },
];

export const sampleContentPlans: ContentPlanCardItem[] = [
  {
    id: "cp-1",
    contractId: 1,
    title: "Skincare Evening Routine",
    category: "Product Review",
    categoryBg: "bg-amber-50 text-amber-700 border-amber-100",
    platform: "TikTok",
    format: "Video",
    priority: "High",
    dueDate: "July 18, 2026",
    overdue: false,
    status: "Draft",
    assignedTeam: [],
  },
  {
    id: "cp-2",
    contractId: 1,
    title: "Iced Coffee DIY Tutorial",
    category: "Entertainment",
    categoryBg: "bg-rose-50 text-rose-700 border-rose-100",
    platform: "Instagram",
    format: "Video",
    priority: "Medium",
    dueDate: "May 20, 2024",
    overdue: true,
    status: "Assigned",
    assignedTeam: [
      {
        name: "Mia Chen",
        initials: "MC",
        avatarBg: "bg-purple-50 text-purple-600",
      },
      {
        name: "Aria Thompson",
        initials: "AT",
        avatarBg: "bg-rose-50 text-rose-600",
      },
    ],
  },
  {
    id: "cp-3",
    contractId: 1,
    title: "Foundation Tutorial Spring Look",
    category: "Education",
    categoryBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
    platform: "Instagram",
    format: "Video",
    priority: "High",
    dueDate: "July 10, 2026",
    overdue: false,
    status: "On Progress",
    assignedTeam: [
      {
        name: "James Rivera",
        initials: "JR",
        avatarBg: "bg-purple-50 text-purple-600",
      },
      {
        name: "Lucas Hoffmann",
        initials: "LH",
        avatarBg: "bg-rose-50 text-rose-600",
      },
      {
        name: "Diego Santos",
        initials: "DS",
        avatarBg: "bg-teal-50 text-teal-600",
      },
    ],
  },
  {
    id: "cp-4",
    contractId: 1,
    title: "Video Games Adsense",
    category: "Games",
    categoryBg: "bg-green-50 text-green-700 border-green-100",
    platform: "Instagram",
    format: "Image",
    priority: "High",
    dueDate: "July 10, 2026",
    overdue: false,
    status: "Revision",
    feedback: "Tolong dipercepat deadlinenya maju.",
    assignedTeam: [
      {
        name: "James Rivera",
        initials: "JR",
        avatarBg: "bg-purple-50 text-purple-600",
      },
      {
        name: "Lucas Hoffmann",
        initials: "LH",
        avatarBg: "bg-rose-50 text-rose-600",
      },
      {
        name: "Diego Santos",
        initials: "DS",
        avatarBg: "bg-teal-50 text-teal-600",
      },
    ],
  },
  {
    id: "cp-5",
    contractId: 1,
    title: "Skincare Morning Routine Reel",
    category: "Product Review",
    categoryBg: "bg-amber-50 text-amber-700 border-amber-100",
    platform: "Instagram",
    format: "Video",
    priority: "Medium",
    dueDate: "June 28, 2026",
    overdue: false,
    status: "Review",
    assignedTeam: [
      {
        name: "Lucas Hoffmann",
        initials: "LH",
        avatarBg: "bg-rose-50 text-rose-600",
      },
      {
        name: "Diego Santos",
        initials: "DS",
        avatarBg: "bg-teal-50 text-teal-600",
      },
    ],
  },
  {
    id: "cp-6",
    contractId: 1,
    title: "List Video",
    category: "Product Review",
    categoryBg: "bg-amber-50 text-amber-700 border-amber-100",
    platform: "Instagram",
    format: "Video",
    priority: "Medium",
    dueDate: "June 28, 2026",
    overdue: false,
    status: "Approved",
    assignedTeam: [
      {
        name: "Lucas Hoffmann",
        initials: "LH",
        avatarBg: "bg-rose-50 text-rose-600",
      },
      {
        name: "Diego Santos",
        initials: "DS",
        avatarBg: "bg-teal-50 text-teal-600",
      },
    ],
  },
  // Contract ID 2: Summer Lifestyle Series
  {
    id: "cp-2-1",
    contractId: 2,
    title: "Summer Chill Iced Latte",
    category: "Product Review",
    categoryBg: "bg-amber-50 text-amber-700 border-amber-100",
    platform: "TikTok",
    format: "Video",
    priority: "High",
    dueDate: "July 20, 2026",
    overdue: false,
    status: "Draft",
    assignedTeam: [],
  },
  {
    id: "cp-2-2",
    contractId: 2,
    title: "Vlog: Hot Summer Day Outfits",
    category: "Entertainment",
    categoryBg: "bg-rose-50 text-rose-700 border-rose-100",
    platform: "Instagram",
    format: "Video",
    priority: "Medium",
    dueDate: "July 22, 2026",
    overdue: false,
    status: "Assigned",
    assignedTeam: [
      {
        name: "Mia Chen",
        initials: "MC",
        avatarBg: "bg-purple-50 text-purple-600",
      },
    ],
  },
  {
    id: "cp-2-3",
    contractId: 2,
    title: "Why Eco Cups Matter",
    category: "Education",
    categoryBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
    platform: "TikTok",
    format: "Video",
    priority: "High",
    dueDate: "June 25, 2026",
    overdue: false,
    status: "Revision",
    feedback: "Warna teks kuning kurang terbaca di background putih.",
    assignedTeam: [
      {
        name: "James Rivera",
        initials: "JR",
        avatarBg: "bg-purple-50 text-purple-600",
      },
    ],
  },
  // Contract ID 3: Spring Product Launch
  {
    id: "cp-3-1",
    contractId: 3,
    title: "BeautyGlow Lipstick Swatches",
    category: "Product Review",
    categoryBg: "bg-amber-50 text-amber-700 border-amber-100",
    platform: "Instagram",
    format: "Image",
    priority: "Medium",
    dueDate: "June 10, 2026",
    overdue: false,
    status: "Approved",
    assignedTeam: [
      {
        name: "Lucas Hoffmann",
        initials: "LH",
        avatarBg: "bg-rose-50 text-rose-600",
      },
    ],
  },
  {
    id: "cp-3-2",
    contractId: 3,
    title: "Flawless Spring Makeup Routine",
    category: "Education",
    categoryBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
    platform: "TikTok",
    format: "Video",
    priority: "High",
    dueDate: "June 12, 2026",
    overdue: false,
    status: "Review",
    assignedTeam: [
      {
        name: "Diego Santos",
        initials: "DS",
        avatarBg: "bg-teal-50 text-teal-600",
      },
    ],
  },
  // Contract ID 4: Winter Campaign 2026
  {
    id: "cp-4-1",
    contractId: 4,
    title: "Winter Fleece Hoodie Unboxing",
    category: "Product Review",
    categoryBg: "bg-amber-50 text-amber-700 border-amber-100",
    platform: "TikTok",
    format: "Video",
    priority: "Medium",
    dueDate: "May 10, 2026",
    overdue: false,
    status: "Published",
    assignedTeam: [
      {
        name: "Sarah Mitchell",
        initials: "SM",
        avatarBg: "bg-indigo-50 text-indigo-600",
      },
    ],
  },
  {
    id: "cp-4-2",
    contractId: 4,
    title: "5 Workout Outfits for Snowy Days",
    category: "Entertainment",
    categoryBg: "bg-rose-50 text-rose-700 border-rose-100",
    platform: "Instagram",
    format: "Image",
    priority: "Low",
    dueDate: "May 12, 2026",
    overdue: false,
    status: "Published",
    assignedTeam: [
      {
        name: "Lucas Hoffmann",
        initials: "LH",
        avatarBg: "bg-rose-50 text-rose-600",
      },
    ],
  },
];


// =============================================================================
// DASHBOARD - ADMIN SOCIAL MEDIA
// =============================================================================

export const adminSocialMediaCards: CardDashboardProps[] = [
  {
    title: "Published Today",
    value: 12,
    description: "Content Published Today",
    icon: CheckCircle,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "On Progress",
    value: 24,
    description: "Upcoming Posts",
    icon: Clock,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Ready to Published",
    value: 18,
    description: "Awaiting Approval",
    icon: Send,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
  {
    title: "Revision",
    value: 6,
    description: "Needs Attention",
    icon: TriangleAlert,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
];

export const sampleContentStatus: GraphicDonutData[] = [
  { name: "Published", value: 12, color: "bg-[#10b981]", fill: "#10b981" },
  { name: "Scheduled", value: 4, color: "bg-[#3b82f6]", fill: "#3b82f6" },
  { name: "Draft", value: 3, color: "bg-[#6b7280]", fill: "#6b7280" },
  { name: "Revision", value: 1, color: "bg-[#ef4444]", fill: "#ef4444" },
];


// =============================================================================
// DASHBOARD - CONTENT EDITOR
// =============================================================================

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
    title: "Approved",
    value: 12,
    description: "Completed",
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


// =============================================================================
// DASHBOARD - CONTENT LEAD
// =============================================================================

export const contentLeadCards: CardDashboardProps[] = [
  {
    title: "Active Contracts",
    value: 12,
    description: "All Active Contracts",
    icon: FileText,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
  {
    title: "Total Content",
    value: 24,
    description: "This Month",
    icon: Video,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "In Production",
    value: 18,
    description: "Awaiting Completion",
    icon: SquareDashedText,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Published",
    value: 6,
    description: "This Month",
    icon: Send,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
];


// =============================================================================
// DASHBOARD - OWNER
// =============================================================================

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



// =============================================================================
// DASHBOARD - SCRIPT WRITER
// =============================================================================

export const scriptWriterCards: CardDashboardProps[] = [
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
    icon: PenLine,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Approved",
    value: 12,
    description: "Completed",
    icon: CircleCheckBig,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "Revision",
    value: 18,
    description: "Needs Attention",
    icon: TriangleAlert,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
];

export interface ScriptOutputData {
  month: string;
  year: number;
  "To Do": number;
  "On Progress": number;
  Review: number;
  Approved: number;
  Revision: number;
  [key: string]: string | number;
}

export const scriptOutputData: ScriptOutputData[] = [
  { month: "Jan", year: 2025, "To Do": 5, "On Progress": 2, Review: 1, Approved: 12, Revision: 1 },
  { month: "Feb", year: 2025, "To Do": 7, "On Progress": 3, Review: 2, Approved: 14, Revision: 2 },
  { month: "Mar", year: 2025, "To Do": 10, "On Progress": 5, Review: 3, Approved: 15, Revision: 1 },
  { month: "Apr", year: 2025, "To Do": 8, "On Progress": 4, Review: 4, Approved: 13, Revision: 3 },
  { month: "May", year: 2025, "To Do": 12, "On Progress": 6, Review: 3, Approved: 18, Revision: 2 },
  { month: "Jun", year: 2025, "To Do": 9, "On Progress": 7, Review: 5, Approved: 16, Revision: 4 },
  { month: "Jul", year: 2025, "To Do": 11, "On Progress": 4, Review: 2, Approved: 20, Revision: 1 },
  { month: "Aug", year: 2025, "To Do": 14, "On Progress": 5, Review: 4, Approved: 22, Revision: 3 },
  { month: "Sep", year: 2025, "To Do": 13, "On Progress": 8, Review: 3, Approved: 21, Revision: 2 },
  { month: "Oct", year: 2025, "To Do": 10, "On Progress": 6, Review: 6, Approved: 19, Revision: 5 },
  { month: "Nov", year: 2025, "To Do": 16, "On Progress": 3, Review: 2, Approved: 24, Revision: 1 },
  { month: "Dec", year: 2025, "To Do": 18, "On Progress": 2, Review: 1, Approved: 26, Revision: 0 },
  { month: "Jan", year: 2026, "To Do": 8, "On Progress": 3, Review: 2, Approved: 15, Revision: 2 },
  { month: "Feb", year: 2026, "To Do": 12, "On Progress": 5, Review: 3, Approved: 18, Revision: 1 },
  { month: "Mar", year: 2026, "To Do": 15, "On Progress": 4, Review: 5, Approved: 22, Revision: 3 },
  { month: "Apr", year: 2026, "To Do": 10, "On Progress": 8, Review: 6, Approved: 20, Revision: 4 },
  { month: "May", year: 2026, "To Do": 5, "On Progress": 12, Review: 8, Approved: 25, Revision: 6 },
  { month: "Jun", year: 2026, "To Do": 4, "On Progress": 5, Review: 12, Approved: 18, Revision: 8 },
];

// =============================================================================
// DASHBOARD - SUPER ADMIN
// =============================================================================

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
    icon: UsersRound,
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
    title: "Active Session",
    value: "12",
    description: "All Online Sessions",
    icon: Activity,
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


// =============================================================================
// REVIEWS
// =============================================================================

export const sampleComments: CommentItem[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    initials: "SM",
    avatarBg: "bg-blue-50 text-blue-600",
    role: "Content Lead",
    roleBg: "bg-gray-100 text-gray-400 hover:bg-gray-100",
    targetContent: "Skincare Morning Routine Reel",
    commentText:
      "Great progress on the script! Just make sure to mention the SPF benefits naturally without sounding too salesy.",
    date: "Apr 20, 2024",
  },
  {
    id: 2,
    name: "Lucas Hoffmann",
    initials: "LH",
    avatarBg: "bg-pink-50 text-pink-600",
    role: "Editor",
    roleBg: "bg-gray-100 text-gray-400 hover:bg-gray-100",
    targetContent: "Foundation Tutorial - Spring Collection",
    commentText:
      "Video editing complete! Added warm color grading that perfectly matches the spring aesthetic. Ready for final review.",
    date: "Apr 19, 2024",
  },
  {
    id: 3,
    name: "James Rivera",
    initials: "JR",
    avatarBg: "bg-purple-50 text-purple-600",
    role: "Script Writer",
    roleBg: "bg-gray-100 text-gray-400 hover:bg-gray-100",
    targetContent: "Coffee Bean Origins - Edu Series Ep.1",
    commentText:
      "Starting the research and script outline today. Will have a full draft ready by Thursday EOD.",
    date: "Apr 18, 2024",
  },
  {
    id: 4,
    name: "Sarah Mitchell",
    initials: "SM",
    avatarBg: "bg-blue-50 text-blue-600",
    role: "Content Lead",
    roleBg: "bg-gray-100 text-gray-400 hover:bg-gray-100",
    targetContent: "Skincare Morning Routine Reel",
    commentText:
      "Great progress on the script! Just make sure to mention the SPF benefits naturally without sounding too salesy.",
    date: "Apr 20, 2024",
  },
  {
    id: 5,
    name: "Lucas Hoffmann",
    initials: "LH",
    avatarBg: "bg-pink-50 text-pink-600",
    role: "Editor",
    roleBg: "bg-gray-100 text-gray-400 hover:bg-gray-100",
    targetContent: "Foundation Tutorial - Spring Collection",
    commentText:
      "Video editing complete! Added warm color grading that perfectly matches the spring aesthetic. Ready for final review.",
    date: "Apr 19, 2024",
  },
  {
    id: 6,
    name: "James Rivera",
    initials: "JR",
    avatarBg: "bg-purple-50 text-purple-600",
    role: "Script Writer",
    roleBg: "bg-gray-100 text-gray-400 hover:bg-gray-100",
    targetContent: "Coffee Bean Origins - Edu Series Ep.1",
    commentText:
      "Starting the research and script outline today. Will have a full draft ready by Thursday EOD.",
    date: "Apr 18, 2024",
  },
];

export const sampleFeedbacks: FeedbackItem[] = [
  {
    id: 1,
    subject: "Day 1 Challenge - Full Body Warmup",
    message:
      "The script needs more energy in the opening! First 10 seconds must hook the audience immediately. Please revise with a more punchy, hype tone.",
    date: "Apr 20, 2024",
  },
  {
    id: 2,
    subject: "Aesthetic Morning Coffee Routine",
    message:
      "Love the concept! The slow morning aesthetic is exactly what we're going for. This will resonate with the target audience. Approved!",
    date: "Apr 19, 2024",
  },
  {
    id: 3,
    subject: "Foundation Tutorial - Spring Collection",
    message:
      "Color grading looks slightly desaturated on mobile screens. Can we tweak the warmth parameters by 5% before exporting the final cut?",
    date: "Apr 18, 2024",
  },
];



// =============================================================================
// TASKS
// =============================================================================

export const taskBoardColumns = [
  {
    key: "to_do" as const,
    label: "TO DO",
    dotColor: "bg-gray-500",
  },
  {
    key: "on_progress" as const,
    label: "ON PROGRESS",
    dotColor: "bg-amber-500",
  },
  {
    key: "pending" as const,
    label: "PENDING",
    dotColor: "bg-purple-500",
  },
  {
    key: "revision" as const,
    label: "REVISION",
    dotColor: "bg-red-500",
  },
  {
    key: "approved" as const,
    label: "APPROVED",
    dotColor: "bg-emerald-500",
  },
];

export const sampleTaskBoardData: TaskBoardItem[] = [
  {
    id: 1,
    title: "Skincare Morning Routine Reel",
    type: "Editor",
    typeBg: "bg-red-105 text-red-700",
    typeIcon: Clapperboard,
    category: "Lifestyle",
    categoryDot: "bg-emerald-500",
    categoryBg: "bg-emerald-50",
    categoryBorder: "border-emerald-200",
    assignee: "Lucas",
    assigneeInitials: "LH",
    assigneeBg: "bg-pink-50 text-pink-600",
    status: "to_do",
    isOverdue: true,
    date: new Date(2026, 5, 12),
    priority: "medium",
  },
  {
    id: 2,
    title: "Coffee Bean Origins - Edu Series Ep.1",
    type: "Script",
    typeBg: "bg-amber-100 text-amber-700",
    typeIcon: PenLine,
    category: "Education",
    categoryDot: "bg-blue-500",
    categoryBg: "bg-blue-50",
    categoryBorder: "border-blue-200",
    assignee: "James",
    assigneeInitials: "JR",
    assigneeBg: "bg-purple-50 text-purple-600",
    status: "to_do",
    isOverdue: true,
    date: new Date(2026, 5, 14),
    priority: "low",
  },
  {
    id: 3,
    title: "Product Review – Best Skincare 2025",
    type: "Editor",
    typeBg: "bg-red-105 text-red-700",
    typeIcon: Clapperboard,
    category: "Product Review",
    categoryDot: "bg-amber-500",
    categoryBg: "bg-amber-50",
    categoryBorder: "border-amber-200",
    assignee: "Lucas",
    assigneeInitials: "LH",
    assigneeBg: "bg-pink-50 text-pink-600",
    status: "to_do",
    isOverdue: false,
    date: new Date(2026, 5, 15),
    priority: "high",
  },
  {
    id: 4,
    title: "Behind the Scene – Photoshoot",
    type: "Caption",
    typeBg: "bg-violet-100 text-violet-600",
    typeIcon: Hash,
    category: "Behind The Scene",
    categoryDot: "bg-purple-500",
    categoryBg: "bg-purple-50",
    categoryBorder: "border-purple-200",
    assignee: "Sarah",
    assigneeInitials: "SM",
    assigneeBg: "bg-blue-50 text-blue-600",
    status: "to_do",
    isOverdue: false,
    date: new Date(2026, 5, 16),
    priority: "medium",
  },
  {
    id: 5,
    title: "Skincare Morning Routine Reel",
    type: "Script",
    typeBg: "bg-amber-100 text-amber-700",
    typeIcon: PenLine,
    category: "Lifestyle",
    categoryDot: "bg-emerald-500",
    categoryBg: "bg-emerald-50",
    categoryBorder: "border-emerald-200",
    assignee: "James",
    assigneeInitials: "JR",
    assigneeBg: "bg-purple-50 text-purple-600",
    status: "on_progress",
    isOverdue: true,
    date: new Date(2026, 5, 17),
    priority: "critical",
  },
  {
    id: 6,
    title: "Aesthetic Morning Coffee Routine",
    type: "Caption",
    typeBg: "bg-violet-100 text-violet-600",
    typeIcon: Hash,
    category: "Lifestyle",
    categoryDot: "bg-emerald-500",
    categoryBg: "bg-emerald-50",
    categoryBorder: "border-emerald-200",
    assignee: "Diego",
    assigneeInitials: "DS",
    assigneeBg: "bg-emerald-50 text-emerald-600",
    status: "on_progress",
    isOverdue: true,
    date: new Date(2026, 5, 18),
    priority: "low",
  },
  {
    id: 7,
    title: "5 Tips Belajar Cepat & Efektif",
    type: "Editor",
    typeBg: "bg-red-105 text-red-700",
    typeIcon: Clapperboard,
    category: "Education",
    categoryDot: "bg-blue-500",
    categoryBg: "bg-blue-50",
    categoryBorder: "border-blue-200",
    assignee: "Aria",
    assigneeInitials: "AT",
    assigneeBg: "bg-pink-100 text-pink-700",
    status: "on_progress",
    isOverdue: false,
    date: new Date(2026, 5, 15),
    priority: "high",
  },
  {
    id: 8,
    title: "Day 1 Challenge - Full Body Warmup",
    type: "Script",
    typeBg: "bg-amber-100 text-amber-700",
    typeIcon: PenLine,
    category: "Entertainment",
    categoryDot: "bg-orange-500",
    categoryBg: "bg-orange-50",
    categoryBorder: "border-orange-200",
    assignee: "James",
    assigneeInitials: "JR",
    assigneeBg: "bg-purple-50 text-purple-600",
    status: "revision",
    isOverdue: false,
    date: new Date(2026, 5, 20),
    priority: "medium",
  },
  {
    id: 9,
    title: "Foundation Tutorial - Spring Collection",
    type: "Script",
    typeBg: "bg-amber-100 text-amber-700",
    typeIcon: PenLine,
    category: "Product Review",
    categoryDot: "bg-amber-500",
    categoryBg: "bg-amber-50",
    categoryBorder: "border-amber-200",
    assignee: "James",
    assigneeInitials: "JR",
    assigneeBg: "bg-purple-50 text-purple-600",
    status: "approved",
    isOverdue: false,
    date: new Date(2026, 5, 10),
    priority: "low",
  },
  {
    id: 10,
    title: "Foundation Tutorial - Spring Collection",
    type: "Editor",
    typeBg: "bg-red-105 text-red-700",
    typeIcon: Clapperboard,
    category: "Product Review",
    categoryDot: "bg-amber-500",
    categoryBg: "bg-amber-50",
    categoryBorder: "border-amber-200",
    assignee: "Lucas",
    assigneeInitials: "LH",
    assigneeBg: "bg-pink-50 text-pink-600",
    status: "approved",
    isOverdue: false,
    date: new Date(2026, 5, 11),
    priority: "low",
  },
  {
    id: 11,
    title: "Iced Coffee DIY - 5 Easy Recipes",
    type: "Script",
    typeBg: "bg-amber-100 text-amber-700",
    typeIcon: PenLine,
    category: "Education",
    categoryDot: "bg-blue-500",
    categoryBg: "bg-blue-50",
    categoryBorder: "border-blue-200",
    assignee: "Mia",
    assigneeInitials: "MC",
    assigneeBg: "bg-purple-100 text-purple-700",
    status: "approved",
    isOverdue: false,
    date: new Date(2026, 5, 15),
    priority: "high",
  },
  {
    id: 12,
    title: "Morning Coffee Routine Reel",
    type: "Caption",
    typeBg: "bg-violet-100 text-violet-600",
    typeIcon: Hash,
    category: "Lifestyle",
    categoryDot: "bg-emerald-500",
    categoryBg: "bg-emerald-50",
    categoryBorder: "border-emerald-200",
    assignee: "Diego",
    assigneeInitials: "DS",
    assigneeBg: "bg-emerald-50 text-emerald-600",
    status: "approved",
    isOverdue: false,
    date: new Date(2026, 5, 8),
    priority: "medium",
  },
];

export const sampleSchedules: ScheduleItem[] = [
  {
    id: 1,
    time: "09:00",
    title: "Foundation Tutorial - Spring Collection",
    platform: "Instagram",
    status: "Scheduled",
    hasPublishButton: true,
  },
  {
    id: 2,
    time: "11:30",
    title: "Morning Coffee Routine Reel",
    platform: "TikTok",
    status: "Published",
    hasPublishButton: false,
  },
  {
    id: 3,
    time: "15:00",
    title: "Behind the Glam - BTS Shoot",
    platform: "Instagram",
    status: "Published",
    hasPublishButton: false,
  },
  {
    id: 4,
    time: "18:00",
    title: "Skincare Evening Routine",
    platform: "TikTok",
    status: "Scheduled",
    hasPublishButton: true,
  },
];

export const readyToPublishData: PublishItem[] = [
  {
    id: 1,
    title: "Foundation Tutorial - Spring Collection",
    iconName: Image,
    iconBg: "bg-gray-50 text-gray-600 border border-gray-300",
    category: "Product Review",
    categoryBg: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    categoryDot: "bg-amber-400",
    postDate: "Apr 25, 2024",
    status: "Scheduled",
    statusBg: "bg-blue-500/20 text-blue-600 hover:bg-blue-600/20",
    statusDot: "bg-blue-600",
  },
  {
    id: 2,
    title: "Iced Coffee DIY - 5 Easy Recipes",
    iconName: Video,
    iconBg: "bg-gray-50 text-gray-600 border border-gray-300",
    category: "Education",
    categoryBg: "bg-blue-50 text-blue-600 hover:bg-blue-50",
    categoryDot: "bg-blue-500",
    postDate: "May 12, 2024",
    status: "Scheduled",
    statusBg: "bg-blue-500/20 text-blue-600 hover:bg-blue-600/20",
    statusDot: "bg-blue-600",
  },
  {
    id: 3,
    title: "Behind the Glam - BTS Shoot",
    iconName: Image,
    iconBg: "bg-gray-50 text-gray-600 border border-gray-300",
    category: "Product Review",
    categoryBg: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    categoryDot: "bg-amber-400",
    postDate: "Apr 25, 2024",
    status: "Scheduled",
    statusBg: "bg-blue-500/20 text-blue-600 hover:bg-blue-600/20",
    statusDot: "bg-blue-600",
  },
  {
    id: 4,
    title: "Morning Coffee Routine Reel",
    iconName: Video,
    iconBg: "bg-gray-50 text-gray-600 border border-gray-300",
    category: "Education",
    categoryBg: "bg-blue-50 text-blue-600 hover:bg-blue-50",
    categoryDot: "bg-blue-500",
    postDate: "May 12, 2024",
    status: "Scheduled",
    statusBg: "bg-blue-500/20 text-blue-600 hover:bg-blue-600/20",
    statusDot: "bg-blue-600",
  },
];

export const publishData: QueueItem[] = [
  {
    id: 1,
    title: "Day 1 Challenge – Hook Clip",
    platform: "TikTok",
    platformBg: "bg-[#252f41] text-white hover:bg-[#252f41]",
    category: "Educational",
    categoryBg: "bg-blue-100 text-blue-600 hover:bg-blue-100",
    dateText: "26 May • 16:00",
    status: "Revision",
    caption: undefined,
    isPublishable: false,
  },
  {
    id: 2,
    title: "Skincare Morning Routine",
    platform: "Instagram",
    platformBg: "bg-pink-600 text-white hover:bg-pink-600",
    category: "Beauty",
    categoryBg: "bg-pink-100 text-pink-500 hover:bg-pink-100",
    dateText: "26 May • 18:00",
    status: "Scheduled",
    caption:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
    isPublishable: true,
  },
  {
    id: 3,
    title: "Foundation Tutorial – Full Look",
    platform: "YouTube",
    platformBg: "bg-red-600 text-white hover:bg-red-600",
    category: "Beauty",
    categoryBg: "bg-pink-100 text-pink-500 hover:bg-pink-100",
    dateText: "27 May • 21:00",
    status: "Draft",
    caption: undefined,
    isPublishable: false,
  },
  {
    id: 4,
    title: "5 Tips Belajar Cepat & Efektif",
    platform: "TikTok",
    platformBg: "bg-[#252f41] text-white hover:bg-[#252f41]",
    category: "Tips & Tricks",
    categoryBg: "bg-green-100 text-green-600 hover:bg-green-100",
    dateText: "28 May • 15:30",
    status: "Pending",
    caption:
      "Tips belajar yang bisa langsung kamu praktikkan! #BelajarCepat #TipsBelajar",
    isPublishable: false,
  },
  {
    id: 5,
    title: "Behind the Scene – Photoshoot",
    platform: "Instagram",
    platformBg: "bg-pink-600 text-white hover:bg-pink-600",
    category: "Behind The Scene",
    categoryBg: "bg-purple-100 text-purple-600 hover:bg-purple-100",
    dateText: "28 May • 19:00",
    status: "Scheduled",
    caption:
      "Exclusive behind the scene dari photoshoot terbaru kami! Jangan lewatkan momen serunya ✨",
    isPublishable: true,
  },
  {
    id: 6,
    title: "Product Review – Best Skincare 2025",
    platform: "YouTube",
    platformBg: "bg-red-600 text-white hover:bg-red-600",
    category: "Review",
    categoryBg: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    dateText: "29 May • 20:00",
    status: "Draft",
    caption: undefined,
    isPublishable: false,
  },
  {
    id: 7,
    title: "30 Detik Challenge – Fun Fact",
    platform: "TikTok",
    platformBg: "bg-[#252f41] text-white hover:bg-[#252f41]",
    category: "Entertainment",
    categoryBg: "bg-orange-100 text-orange-600 hover:bg-orange-100",
    dateText: "29 May • 17:45",
    status: "Revision",
    caption:
      "Fakta unik yang bakal bikin kamu terkejut! 😱 #FunFact #Challenge",
    isPublishable: false,
  },
  {
    id: 8,
    title: "Live Q&A – Career Consultation",
    platform: "Instagram",
    platformBg: "bg-pink-600 text-white hover:bg-pink-600",
    category: "Live Session",
    categoryBg: "bg-indigo-100 text-indigo-600 hover:bg-indigo-100",
    dateText: "30 May • 14:00",
    status: "Pending",
    caption: "Jangan sampai ketinggalan keseruannya!",
    isPublishable: false,
  },
];

export const scheduledData: ScheduledContentItem[] = [
  {
    id: 1,
    title: "Behind the Glam - Product Shoot BTS",
    campaign: "Spring Product Launch",
    platform: "Instagram",
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Behind the Scenes",
    pillarBg: "bg-purple-50 text-purple-600",
    pillarDot: "bg-purple-500",
    postDate: "Apr 21, 2024",
    time: "15:00",
    status: "Published",
    statusBg: "bg-blue-50 text-blue-600",
    statusDot: "bg-blue-500",
    hasPublishButton: false,
  },
  {
    id: 2,
    title: "Foundation Tutorial - Spring Collection",
    campaign: "Spring Product Launch",
    platform: "Instagram",
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Product Review",
    pillarBg: "bg-amber-50 text-amber-700",
    pillarDot: "bg-amber-500",
    postDate: "Apr 25, 2024",
    time: "09:00",
    status: "Approved",
    statusBg: "bg-emerald-50 text-emerald-600",
    statusDot: "bg-emerald-500",
    hasPublishButton: true,
  },
  {
    id: 3,
    title: "Skincare Morning Routine Reel",
    campaign: "Spring Product Launch",
    platform: "Instagram",
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Lifestyle",
    pillarBg: "bg-emerald-50 text-emerald-600",
    pillarDot: "bg-emerald-500",
    postDate: "Apr 28, 2024",
    time: "18:00",
    status: "On Progress",
    statusBg: "bg-amber-50 text-amber-600",
    statusDot: "bg-amber-500",
    hasPublishButton: false,
  },
  {
    id: 4,
    title: "Aesthetic Morning Coffee Routine",
    campaign: "Summer Lifestyle Series",
    platform: "TikTok",
    platformBg: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    pillar: "Lifestyle",
    pillarBg: "bg-emerald-50 text-emerald-600",
    pillarDot: "bg-emerald-500",
    postDate: "Apr 30, 2024",
    time: "07:00",
    status: "Draft",
    statusBg: "bg-gray-100 text-gray-500",
    statusDot: "bg-gray-400",
    hasPublishButton: false,
  },
  {
    id: 5,
    title: "Behind the Glam - Product Shoot BTS",
    campaign: "Spring Product Launch",
    platform: "Instagram",
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Behind the Scenes",
    pillarBg: "bg-purple-50 text-purple-600",
    pillarDot: "bg-purple-500",
    postDate: "Apr 21, 2024",
    time: "15:00",
    status: "Published",
    statusBg: "bg-blue-50 text-blue-600",
    statusDot: "bg-blue-500",
    hasPublishButton: false,
  },
  {
    id: 6,
    title: "Foundation Tutorial - Spring Collection",
    campaign: "Spring Product Launch",
    platform: "Instagram",
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Product Review",
    pillarBg: "bg-amber-50 text-amber-700",
    pillarDot: "bg-amber-500",
    postDate: "Apr 25, 2024",
    time: "09:00",
    status: "Approved",
    statusBg: "bg-emerald-50 text-emerald-600",
    statusDot: "bg-emerald-500",
    hasPublishButton: true,
  },
  {
    id: 7,
    title: "Skincare Morning Routine Reel",
    campaign: "Spring Product Launch",
    platform: "Instagram",
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Lifestyle",
    pillarBg: "bg-emerald-50 text-emerald-600",
    pillarDot: "bg-emerald-500",
    postDate: "Apr 28, 2024",
    time: "18:00",
    status: "On Progress",
    statusBg: "bg-amber-50 text-amber-600",
    statusDot: "bg-amber-500",
    hasPublishButton: false,
  },
  {
    id: 8,
    title: "Aesthetic Morning Coffee Routine",
    campaign: "Summer Lifestyle Series",
    platform: "TikTok",
    platformBg: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    pillar: "Lifestyle",
    pillarBg: "bg-emerald-50 text-emerald-600",
    pillarDot: "bg-emerald-500",
    postDate: "Apr 30, 2024",
    time: "07:00",
    status: "Draft",
    statusBg: "bg-gray-100 text-gray-500",
    statusDot: "bg-gray-400",
    hasPublishButton: false,
  },
  {
    id: 9,
    title: "Behind the Glam - Product Shoot BTS",
    campaign: "Spring Product Launch",
    platform: "Instagram",
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Behind the Scenes",
    pillarBg: "bg-purple-50 text-purple-600",
    pillarDot: "bg-purple-500",
    postDate: "Apr 21, 2024",
    time: "15:00",
    status: "Published",
    statusBg: "bg-blue-50 text-blue-600",
    statusDot: "bg-blue-500",
    hasPublishButton: false,
  },
  {
    id: 10,
    title: "Foundation Tutorial - Spring Collection",
    campaign: "Spring Product Launch",
    platform: "Instagram",
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Product Review",
    pillarBg: "bg-amber-50 text-amber-700",
    pillarDot: "bg-amber-500",
    postDate: "Apr 25, 2024",
    time: "09:00",
    status: "Approved",
    statusBg: "bg-emerald-50 text-emerald-600",
    statusDot: "bg-emerald-500",
    hasPublishButton: true,
  },
  {
    id: 11,
    title: "Skincare Morning Routine Reel",
    campaign: "Spring Product Launch",
    platform: "Instagram",
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Lifestyle",
    pillarBg: "bg-emerald-50 text-emerald-600",
    pillarDot: "bg-emerald-500",
    postDate: "Apr 28, 2024",
    time: "18:00",
    status: "On Progress",
    statusBg: "bg-amber-50 text-amber-600",
    statusDot: "bg-amber-500",
    hasPublishButton: false,
  },
  {
    id: 12,
    title: "Aesthetic Morning Coffee Routine",
    campaign: "Summer Lifestyle Series",
    platform: "TikTok",
    platformBg: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    pillar: "Lifestyle",
    pillarBg: "bg-emerald-50 text-emerald-600",
    pillarDot: "bg-emerald-500",
    postDate: "Apr 30, 2024",
    time: "07:00",
    status: "Draft",
    statusBg: "bg-gray-100 text-gray-500",
    statusDot: "bg-gray-400",
    hasPublishButton: false,
  },
];

export const publishCardData: CardDashboardProps[] = [
  {
    title: "Total Queue",
    value: 18,
    description: "Total Post",
    icon: CalendarCheck,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "On Progress",
    value: 24,
    description: "Ready to Post",
    icon: Clock,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Ready to Published",
    value: 18,
    description: "Awaiting Approval",
    icon: Send,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
  {
    title: "In Draft",
    value: "6",
    description: "Awaiting Content",
    icon: SquareDashedText,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
];

export const tasksCardData: CardDashboardProps[] = [
  {
    title: "To Do",
    value: 12,
    description: "Unassigned Tasks",
    icon: ClipboardPen,
    iconColor: "text-gray-600",
    iconBgColor: "bg-gray-600/10",
  },
  {
    title: "In Progress",
    value: 18,
    description: "Assigned Tasks",
    icon: Hourglass,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Review",
    value: 24,
    description: "Awaiting Approval",
    icon: Clock,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-600/10",
  },
  {
    title: "Revision",
    value: "6",
    description: "Revision Tasks",
    icon: FileWarning,
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-600/10",
  },
  {
    title: "Overdue",
    value: "6",
    description: "Overdue Tasks",
    icon: TriangleAlert,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
];

export const uploadsCardData: CardDashboardProps[] = [
  {
    title: "Total Uploads",
    value: 24,
    description: "This Month",
    icon: FileUp,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "Pending",
    value: 12,
    description: "Awaiting Reviews",
    icon: Clock,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Approved",
    value: 18,
    description: "Assigned Tasks",
    icon: CircleCheckBig,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
  {
    title: "Revision",
    value: "6",
    description: "Needs Attention",
    icon: TriangleAlert,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
];

export const sampleUploadsData: UploadedVideoItem[] = [
  {
    id: 1,
    title: "Day 1 Challenge – Final Edit",
    type: "video",
    durationText: "0:58",
    platform: "TikTok",
    platformBg: "bg-[#252f41] text-white",
    fileSizeText: "128 MB",
    uploadedTimeText: "Uploaded 21d ago",
    status: "Approved",
    statusBg: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    statusDot: "bg-emerald-500",
    assigner: {
      name: "Sarah Miller",
      role: "Content Lead",
      initials: "SM",
    },
  },
  {
    id: 2,
    title: "Skincare Reel – Raw Cut",
    type: "video",
    durationText: "1:32",
    platform: "Instagram",
    platformBg: "bg-pink-600 text-white",
    fileSizeText: "214 MB",
    uploadedTimeText: "Uploaded 22d ago",
    status: "Revision",
    statusBg: "bg-red-50 text-red-500 hover:bg-red-50",
    statusDot: "bg-red-500",
    revisionNote: "Colour grading is off re-export with warmer tone.",
    isOverdue: true,
    assigner: {
      name: "Diego Santos",
      role: "Marketing Lead",
      initials: "DS",
    },
  },
  {
    id: 3,
    title: "Aesthetic Coffee – Banner Image",
    type: "image",
    platform: "Instagram",
    platformBg: "bg-pink-600 text-white",
    fileSizeText: "4.8 MB",
    uploadedTimeText: "Uploaded 2 hours ago",
    status: "Pending",
    statusBg: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    statusDot: "bg-amber-500",
    assigner: {
      name: "Sarah Miller",
      role: "Content Lead",
      initials: "SM",
    },
  },
  {
    id: 4,
    title: "Aesthetic Beer – Full Image",
    type: "image",
    platform: "Instagram",
    platformBg: "bg-pink-600 text-white",
    fileSizeText: "6.8 MB",
    uploadedTimeText: "Uploaded 2 hours ago",
    status: "Approved",
    statusBg: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    statusDot: "bg-emerald-500",
    assigner: {
      name: "Sarah Miller",
      role: "Content Lead",
      initials: "SM",
    },
  },
  {
    id: 5,
    title: "Behind the Glam - Overdue Promo Video",
    type: "video",
    durationText: "0:45",
    platform: "YouTube",
    platformBg: "bg-red-600 text-white",
    fileSizeText: "98 MB",
    uploadedTimeText: "Uploaded 1 day ago",
    status: "Pending",
    statusBg: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    statusDot: "bg-amber-500",
    isOverdue: true,
    assigner: {
      name: "Diego Santos",
      role: "Marketing Lead",
      initials: "DS",
    },
  },
];

export const DraftsCard: CardDashboardProps[] = [
  {
    title: "Total Drafts",
    value: 24,
    description: "This Month",
    icon: FilePen,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "To Do",
    value: 18,
    description: "Assigned Tasks",
    icon: PenLine,
    iconColor: "text-gray-600",
    iconBgColor: "bg-gray-600/10",
  },
  {
    title: "Pending",
    value: 12,
    description: "Awaiting Reviews",
    icon: Clock,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Revision",
    value: "6",
    description: "Needs Attention",
    icon: TriangleAlert,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
];

export interface AssignerInfo {
  name: string;
  role: string;
  initials: string;
}

export interface AssignedContentPlan {
  id: string | number;
  title: string;
  category: string;
  platform: string;
  assignedBy: AssignerInfo;
}

export const sampleAssignedContentPlans: AssignedContentPlan[] = [
  {
    id: "plan-1",
    title: "Skincare Morning Routine Reel",
    category: "Beauty",
    platform: "Instagram",
    assignedBy: {
      name: "Sarah Miller",
      role: "Content Lead",
      initials: "SM",
    },
  },
  {
    id: "plan-2",
    title: "Coffee Ep.2 – Latte Art Secrets",
    category: "Lifestyle",
    platform: "TikTok",
    assignedBy: {
      name: "Diego Santos",
      role: "Marketing Lead",
      initials: "DS",
    },
  },
  {
    id: "plan-3",
    title: "5 Tips Belajar Cepat & Efektif",
    category: "Education",
    platform: "YouTube",
    assignedBy: {
      name: "Aria Wijaya",
      role: "Edu Director",
      initials: "AW",
    },
  },
  {
    id: "plan-4",
    title: "Aesthetic Morning Coffee Routine Caption",
    category: "Lifestyle",
    platform: "Instagram",
    assignedBy: {
      name: "Diego Santos",
      role: "Marketing Lead",
      initials: "DS",
    },
  },
];

export interface DraftsItem {
  id: string | number;
  title: string;
  category: string;
  categoryBg: string;
  status: "Pending" | "Revision" | "Approved" | "Overdue";
  statusBg: string;
  statusDot: string;
  revisionNote?: string;
  wordCount: number;
  savedTimeText: string;
  iconBg: string;
  iconColor: string;
  assigner?: AssignerInfo;
}

export const sampleDraftsData: DraftsItem[] = [
  {
    id: 1,
    title: "Day 1 Challenge – Hook Script",
    category: "Educational",
    categoryBg: "bg-blue-50 text-blue-600 hover:bg-blue-50 border-none",
    status: "Revision",
    statusBg: "bg-red-50 text-red-600 hover:bg-red-50",
    statusDot: "bg-red-500",
    revisionNote: "Revise the hook  make it more punchy and direct.",
    wordCount: 420,
    savedTimeText: "Saved 21d ago",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    assigner: {
      name: "Sarah Miller",
      role: "Content Lead",
      initials: "SM",
    },
  },
  {
    id: 2,
    title: "Skincare Routine (Morning) – VO Script",
    category: "Beauty",
    categoryBg: "bg-pink-50 text-pink-600 hover:bg-pink-50 border-none",
    status: "Pending",
    statusBg: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    statusDot: "bg-amber-500",
    wordCount: 310,
    savedTimeText: "Saved 22d ago",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    assigner: {
      name: "Diego Santos",
      role: "Marketing Lead",
      initials: "DS",
    },
  },
  {
    id: 3,
    title: "Product Review – Best Skincare 2025",
    category: "Beauty",
    categoryBg: "bg-pink-50 text-pink-600 hover:bg-pink-50 border-none",
    status: "Pending",
    statusBg: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    statusDot: "bg-amber-500",
    wordCount: 520,
    savedTimeText: "Saved 3d ago",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    assigner: {
      name: "Sarah Miller",
      role: "Content Lead",
      initials: "SM",
    },
  },
  {
    id: 4,
    title: "Iced Coffee DIY – 5 Easy Recipes",
    category: "Education",
    categoryBg: "bg-blue-50 text-blue-600 hover:bg-blue-50 border-none",
    status: "Pending",
    statusBg: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    statusDot: "bg-amber-500",
    wordCount: 280,
    savedTimeText: "Saved 2d ago",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    assigner: {
      name: "Aria Wijaya",
      role: "Edu Director",
      initials: "AW",
    },
  },
  {
    id: 5,
    title: "Morning Coffee Routine Reel – Caption",
    category: "Lifestyle",
    categoryBg:
      "bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-none",
    status: "Overdue",
    statusBg: "bg-red-50 text-red-600 hover:bg-red-50",
    statusDot: "bg-red-500",
    revisionNote: "This draft is 3 days overdue.",
    wordCount: 150,
    savedTimeText: "Saved 5d ago",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    assigner: {
      name: "Diego Santos",
      role: "Marketing Lead",
      initials: "DS",
    },
  },
  {
    id: 6,
    title: "Behind the Scene – Photoshoot",
    category: "Behind the Scenes",
    categoryBg: "bg-purple-50 text-purple-600 hover:bg-purple-50 border-none",
    status: "Approved",
    statusBg: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    statusDot: "bg-emerald-500",
    wordCount: 380,
    savedTimeText: "Saved 1d ago",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    assigner: {
      name: "Sarah Miller",
      role: "Content Lead",
      initials: "SM",
    },
  },
];


// =============================================================================
// USERS
// =============================================================================

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

