import { Eye, Heart, Share2, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AnalyticsCard {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

export const ANALYTICS_CARDS_TEMPLATE = [
  {
    key: "views",
    title: "Total Views",
    description: "Accumulated views",
    icon: Eye,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    key: "likes",
    title: "Total Likes",
    description: "Accumulated likes",
    icon: Heart,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
  {
    key: "shares",
    title: "Total Shares",
    description: "Accumulated shares",
    icon: Share2,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
  {
    key: "engagement",
    title: "Avg. Engagement",
    description: "Engagement rate",
    icon: TrendingUp,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
] as const;

export const formatMetricValue = (key: string, val: number): string => {
  if (key === "engagement") {
    return `${val.toFixed(1)}%`;
  }
  if (val >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (val >= 1_000) {
    return `${(val / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return val.toString();
};
