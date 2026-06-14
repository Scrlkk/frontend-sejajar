import {
  CheckCircle,
  Clock,
  Send,
  SquareDashedText,
} from "lucide-react";
import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";
import type { GraphicDonutData } from "@/features/dashboard/components/GraphicDonut";



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
    title: "Scheduled Posts",
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
    title: "In Draft",
    value: 6,
    description: "Awaiting Content",
    icon: SquareDashedText,
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
