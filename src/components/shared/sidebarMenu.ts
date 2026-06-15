import {
  LayoutDashboard,
  FileText,
  Calendar,
  FilePen,
  Upload,
  Send,
  ChartColumn,
  Shield,
  Database,
  Clock,
  TrendingUp,
  type LucideIcon,
  Files,
} from "lucide-react";

export type SidebarMenuItem = {
  title: string;
  to: string;
  icon: LucideIcon;
  subtitle?: string;
};

export const sidebarMenuItems: SidebarMenuItem[] = [
  { title: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  {
    title: "Contracts",
    to: "/contracts",
    icon: FileText,
    subtitle: "Manage and review all contracts",
  },
  {
    title: "Content",
    to: "/content",
    icon: Files,
    subtitle: "Track and manage your content",
  },
  {
    title: "Schedules",
    to: "/schedules",
    icon: Clock,
    subtitle: "Create, edit and delete post schedules",
  },
  {
    title: "Calendar",
    to: "/calendar",
    icon: Calendar,
    subtitle: "Production deadlines and content publish schedule",
  },
  {
    title: "Drafts",
    to: "/drafts",
    icon: FilePen,
    subtitle: "Continue working on your drafts",
  },
  {
    title: "Uploads",
    to: "/uploads",
    icon: Upload,
    subtitle: "Upload and manage your files",
  },
  {
    title: "Publish",
    to: "/publish",
    icon: Send,
    subtitle: "Publish your content to the world",
  },
  {
    title: "Engagement",
    to: "/engagement",
    icon: TrendingUp,
    subtitle: "Monitor engagement performance",
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: ChartColumn,
    subtitle: "Insights and performance metrics",
  },
  {
    title: "User & Roles",
    to: "/user-roles",
    icon: Shield,
    subtitle: "Manage users, roles and permissions",
  },
  {
    title: "System Logs",
    to: "/system-logs",
    icon: Database,
    subtitle: "Monitor system activity and audit trail",
  },
];
