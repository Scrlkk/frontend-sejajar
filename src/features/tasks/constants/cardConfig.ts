import {
  ClipboardPen,
  Hourglass,
  Clock,
  FileWarning,
  TriangleAlert,
  FileUp,
  CircleCheckBig,
  FilePen,
  PenLine,
  CalendarCheck,
  Calendar,
  type LucideIcon,
} from "lucide-react";

export interface TaskCardConfig {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  statusKey?: string | string[];
  isOverdue?: boolean;
}

export const TASKS_CARD_CONFIG: TaskCardConfig[] = [
  {
    title: "To Do",
    description: "Unassigned Tasks",
    icon: ClipboardPen,
    iconColor: "text-gray-600",
    iconBgColor: "bg-gray-600/10",
    statusKey: "to_do",
  },
  {
    title: "On Progress",
    description: "Assigned Tasks",
    icon: Hourglass,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
    statusKey: "on_progress",
  },
  {
    title: "Review",
    description: "Awaiting Approval",
    icon: Clock,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-600/10",
    statusKey: ["pending", "review"],
  },
  {
    title: "Revision",
    description: "Revision Tasks",
    icon: FileWarning,
    iconColor: "text-orange-600",
    iconBgColor: "bg-orange-600/10",
    statusKey: "revision",
  },
  {
    title: "Approved",
    description: "Approved Tasks",
    icon: CircleCheckBig,
    iconColor: "text-emerald-600",
    iconBgColor: "bg-emerald-600/10",
    statusKey: "approved",
  },
];

export const UPLOADS_CARD_CONFIG: TaskCardConfig[] = [
  {
    title: "Total Uploads",
    description: "This Month",
    icon: FileUp,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "On Progress",
    description: "Assigned Tasks",
    icon: Hourglass,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
    statusKey: "on_progress",
  },
  {
    title: "Review",
    description: "Awaiting Reviews",
    icon: Clock,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-600/10",
    statusKey: "Pending",
  },
  {
    title: "Approved",
    description: "Assigned Tasks",
    icon: CircleCheckBig,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
    statusKey: "Approved",
  },
  {
    title: "Revision",
    description: "Needs Attention",
    icon: TriangleAlert,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
    statusKey: "Revision",
  },
];

export const DRAFTS_CARD_CONFIG: TaskCardConfig[] = [
  {
    title: "Total Drafts",
    description: "This Month",
    icon: FilePen,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "To Do",
    description: "Assigned Tasks",
    icon: PenLine,
    iconColor: "text-gray-600",
    iconBgColor: "bg-gray-600/10",
    statusKey: "to_do",
  },
  {
    title: "On Progress",
    description: "Assigned Tasks",
    icon: Hourglass,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
    statusKey: "on_progress",
  },
  {
    title: "Review",
    description: "Awaiting Reviews",
    icon: Clock,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-600/10",
    statusKey: "Pending",
  },
  {
    title: "Revision",
    description: "Needs Attention",
    icon: TriangleAlert,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
    statusKey: "Revision",
  },
];

export const PUBLISH_CARD_CONFIG: TaskCardConfig[] = [
  {
    title: "Total Queue",
    description: "Total Post",
    icon: CalendarCheck,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "On Progress",
    description: "Ready to Post",
    icon: Hourglass,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
    statusKey: "on_progress",
  },
  {
    title: "Review",
    description: "Awaiting Reviews",
    icon: Clock,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-600/10",
    statusKey: "Pending",
  },
  {
    title: "Ready to Publish",
    description: "Approved Content",
    icon: CircleCheckBig,
    iconColor: "text-emerald-600",
    iconBgColor: "bg-emerald-600/10",
    statusKey: "Approved",
  },
  {
    title: "Scheduled",
    description: "Scheduled Content",
    icon: Calendar,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
    statusKey: "Scheduled",
  },
];
