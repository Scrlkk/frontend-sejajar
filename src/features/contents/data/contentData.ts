import type { GraphicDonutData } from "@/features/dashboard/components/GraphicDonut";
import type { ContentOutputData } from "@/features/contents/components/ContentOutput";

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

