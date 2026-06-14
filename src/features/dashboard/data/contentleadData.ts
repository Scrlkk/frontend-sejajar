import {
  FileText,
  Send,
  SquareDashedText,
  Video,
} from "lucide-react";
import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";



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
