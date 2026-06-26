import { Activity, KeyRoundIcon, Package, HardDrive } from "lucide-react";

export const AUDIT_CARDS_TEMPLATE = [
  {
    key: "total" as const,
    title: "Total Activity",
    description: "Last 7 days",
    icon: Activity,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
  {
    key: "login" as const,
    title: "Login",
    description: "Last 7 days",
    icon: KeyRoundIcon,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
  {
    key: "storage" as const,
    title: "Storage Used",
    description: "Total disk usage",
    icon: HardDrive,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    key: "sessions" as const,
    title: "Active Sessions",
    description: "Concurrent users",
    icon: Package,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-600/10",
  },
];
