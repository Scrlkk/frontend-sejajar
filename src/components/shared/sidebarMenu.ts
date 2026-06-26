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
  Users,
  GalleryVerticalEnd,
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
    group: "Dashboards",
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

import type { AuthenticatedUser, UserRole } from "@/utils/permissions";

const ROLE_DASHBOARDS: Record<UserRole, SidebarMenuItem> = {
  superadmin: {
    title: "Super Admin",
    to: "/dashboard/superadmin",
    icon: ShieldUser,
    subtitle: "Manage system and roles",
  },
  owner: {
    title: "Owner",
    to: "/dashboard/owner",
    icon: LayoutDashboard,
    subtitle: "Company and financial overview",
  },
  content_lead: {
    title: "Content Lead",
    to: "/dashboard/content-lead",
    icon: Star,
    subtitle: "Content and task management",
  },
  content_editor: {
    title: "Content Editor",
    to: "/dashboard/content-editor",
    icon: Clapperboard,
    subtitle: "Review and edit tasks",
  },
  script_writer: {
    title: "Script Writer",
    to: "/dashboard/script-writer",
    icon: PencilSparkles,
    subtitle: "Write and view drafts",
  },
  admin_social_media: {
    title: "Social Media",
    to: "/dashboard/social-media",
    icon: Hash,
    subtitle: "Publish and track engagement",
  },
};

const ITEM_GROUPS: Record<string, "CORES" | "SYSTEM"> = {
  "/contracts": "CORES",
  "/clients": "CORES",
  "/tasks": "CORES",
  "/calendar": "CORES",
  "/drafts": "CORES",
  "/uploads": "CORES",
  "/publish": "CORES",
  "/engagement": "CORES",
  "/analytics": "CORES",
  "/employee": "CORES",
  "/metadata": "SYSTEM",
  "/user-roles": "SYSTEM",
  "/system-logs": "SYSTEM",
};

const ROLE_ITEMS: Record<UserRole, SidebarMenuItem[]> = {
  superadmin: [
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
  owner: [
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
      title: "Calendar",
      to: "/calendar",
      icon: Calendar,
      subtitle: "Production deadlines and content publish schedule",
    },
    {
      title: "Analytics",
      to: "/analytics",
      icon: ChartColumn,
      subtitle: "Insights and performance metrics",
    },
    {
      title: "Metadata",
      to: "/metadata",
      icon: GalleryVerticalEnd,
      subtitle: "Configure content pillars, categories, and platform settings",
    },
    {
      title: "Employee",
      to: "/employee",
      icon: Users,
      subtitle: "List all Employee of company",
    },
  ],
  content_lead: [
    {
      title: "Contracts",
      to: "/contracts",
      icon: FileText,
      subtitle: "Manage and review all contracts",
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
      title: "Metadata",
      to: "/metadata",
      icon: GalleryVerticalEnd,
      subtitle: "Configure content pillars, categories, and platform settings",
    },
  ],
  content_editor: [
    {
      title: "Tasks",
      to: "/tasks",
      icon: Files,
      subtitle: "Track and manage your tasks",
    },
    {
      title: "Uploads",
      to: "/uploads",
      icon: Upload,
      subtitle: "Upload and manage your files",
    },
    {
      title: "Calendar",
      to: "/calendar",
      icon: Calendar,
      subtitle: "Production deadlines and content publish schedule",
    },
  ],
  script_writer: [
    {
      title: "Tasks",
      to: "/tasks",
      icon: Files,
      subtitle: "Track and manage your tasks",
    },
    {
      title: "Drafts",
      to: "/drafts",
      icon: FilePen,
      subtitle: "Continue working on your drafts",
    },
    {
      title: "Calendar",
      to: "/calendar",
      icon: Calendar,
      subtitle: "Production deadlines and content publish schedule",
    },
  ],
  admin_social_media: [
    {
      title: "Tasks",
      to: "/tasks",
      icon: Files,
      subtitle: "Track and manage your tasks",
    },
    {
      title: "Publish",
      to: "/publish",
      icon: Send,
      subtitle: "Publish your content to the world",
    },
    {
      title: "Calendar",
      to: "/calendar",
      icon: Calendar,
      subtitle: "Production deadlines and content publish schedule",
    },
    {
      title: "Engagement",
      to: "/engagement",
      icon: TrendingUp,
      subtitle: "Monitor engagement performance",
    },
  ],
};

export const getSidebarGroupsForUser = (
  user: AuthenticatedUser | null,
): SidebarMenuGroup[] => {
  if (!user) return [];

  const groups: SidebarMenuGroup[] = [];

  // 1. Dashboards group (always display dashboard(s) for the user's role(s))
  const dashboardItems: SidebarMenuItem[] = [];
  user.roles.forEach((r) => {
    const db = ROLE_DASHBOARDS[r];
    if (db) {
      dashboardItems.push(db);
    }
  });

  if (dashboardItems.length > 0) {
    groups.push({
      group: "Dashboards",
      items: dashboardItems,
    });
  }

  // 2. CORES and SYSTEM groups
  const coresItemsMap = new Map<string, SidebarMenuItem>();
  const systemItemsMap = new Map<string, SidebarMenuItem>();

  user.roles.forEach((r) => {
    const items = ROLE_ITEMS[r];
    if (items) {
      items.forEach((item) => {
        const group = ITEM_GROUPS[item.to] || "CORES";
        if (group === "CORES") {
          coresItemsMap.set(item.to, item);
        } else if (group === "SYSTEM") {
          systemItemsMap.set(item.to, item);
        }
      });
    }
  });

  if (coresItemsMap.size > 0) {
    groups.push({
      group: "CORES",
      items: Array.from(coresItemsMap.values()),
    });
  }

  if (systemItemsMap.size > 0) {
    groups.push({
      group: "SYSTEM",
      items: Array.from(systemItemsMap.values()),
    });
  }

  return groups;
};
