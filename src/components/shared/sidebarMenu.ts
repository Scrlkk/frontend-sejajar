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
  TrendingUp,
  Files,
  UsersRound,
  PencilSparkles,
  Hash,
  Clapperboard,
  Star,
  ShieldUser,
  type LucideIcon,
} from "lucide-react";

export type SidebarMenuItem = {
  title: string;
  to: string;
  icon: LucideIcon;
  subtitle?: string;
};

export type SidebarMenuGroup = {
  group: string;
  items: SidebarMenuItem[];
};

export const sidebarMenuGroups: SidebarMenuGroup[] = [
  {
    group: "General",
    items: [
      {
        title: "Owner",
        to: "/dashboard/owner",
        icon: LayoutDashboard,
      },
      {
        title: "Content Lead",
        to: "/dashboard/content-lead",
        icon: Star,
      },
      {
        title: "Script Writer",
        to: "/dashboard/script-writer",
        icon: PencilSparkles,
      },
      {
        title: "Content Editor",
        to: "/dashboard/content-editor",
        icon: Clapperboard,
      },
      {
        title: "Social Media",
        to: "/dashboard/social-media",
        icon: Hash,
      },
      {
        title: "Super Admin",
        to: "/dashboard/superadmin",
        icon: ShieldUser,
      },
    ],
  },
  {
    group: "Cores",
    items: [
      {
        title: "Contracts",
        to: "/contracts",
        icon: FileText,
        subtitle: "Manage and review all contracts",
      },
      {
        title: "Clients",
        to: "/clients",
        icon: UsersRound,
        subtitle: "Manage your clients",
      },
      {
        title: "Tasks",
        to: "/tasks",
        icon: Files,
        subtitle: "Track and manage your tasks",
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
    ],
  },
  {
    group: "System",
    items: [
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
    ],
  },
];
export const sidebarMenuItems: SidebarMenuItem[] = sidebarMenuGroups.flatMap(
  (g) => g.items,
);
