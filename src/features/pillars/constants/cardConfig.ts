import { FolderOpen, Tag, Monitor, Palette } from "lucide-react";
import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";
import type { Pillar } from "../api/pillarsApi";
import type { ContentCategory } from "@/features/contents/api/contentCategoriesApi";
import type { Platform } from "@/features/platforms/api/platformsApi";

export const getPillarsCards = (
  pillars: Pillar[],
  categories: ContentCategory[],
  platforms: Platform[],
  isDataLoading = false
): CardDashboardProps[] => {
  const totalPillars = pillars.length;
  const totalCategories = categories.length;
  const totalPlatforms = platforms.length;

  return [
    {
      title: "Total Pillars",
      value: totalPillars,
      description: "Total content pillars",
      icon: FolderOpen,
      iconColor: "text-red-800",
      iconBgColor: "bg-red-800/10",
      isEmpty: isDataLoading,
      emptyValue: "-",
    },
    {
      title: "Total Categories",
      value: totalCategories,
      description: "Total content categories",
      icon: Tag,
      iconColor: "text-blue-800",
      iconBgColor: "bg-blue-800/10",
      isEmpty: isDataLoading,
      emptyValue: "-",
    },
    {
      title: "Total Platforms",
      value: totalPlatforms,
      description: "Total social platforms",
      icon: Monitor,
      iconColor: "text-purple-800",
      iconBgColor: "bg-purple-800/10",
      isEmpty: isDataLoading,
      emptyValue: "-",
    },
    {
      title: "Color Presets",
      value: 12,
      description: "Preset color options",
      icon: Palette,
      iconColor: "text-amber-600",
      iconBgColor: "bg-amber-600/10",
      isEmpty: isDataLoading,
      emptyValue: "-",
    },
  ];
};
