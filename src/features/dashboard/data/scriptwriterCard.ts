import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";
import {
  CircleCheckBig,
  FileClock,
  PenLine,
  TriangleAlert,
} from "lucide-react";

export const scriptWriterCards: CardDashboardProps[] = [
  {
    title: "To Do",
    value: 12,
    description: "Awaiting Start",
    icon: FileClock,
    iconColor: "text-gray-600",
    iconBgColor: "bg-gray-600/10",
  },
  {
    title: "On Progress",
    value: 24,
    description: "Currently Editing",
    icon: PenLine,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Completed",
    value: 12,
    description: "Finalized",
    icon: CircleCheckBig,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "Revision",
    value: 18,
    description: "Needs Attention",
    icon: TriangleAlert,
    iconColor: "text-red-600",
    iconBgColor: "bg-red-600/10",
  },
];

export interface ScriptOutputData {
  month: string;
  year: number;
  "To Do": number;
  "On Progress": number;
  "Pending Review": number;
  Approved: number;
  Revision: number;
  [key: string]: string | number;
}

export const scriptOutputData: ScriptOutputData[] = [
  { month: "Jan", year: 2025, "To Do": 5, "On Progress": 2, "Pending Review": 1, Approved: 12, Revision: 1 },
  { month: "Feb", year: 2025, "To Do": 7, "On Progress": 3, "Pending Review": 2, Approved: 14, Revision: 2 },
  { month: "Mar", year: 2025, "To Do": 10, "On Progress": 5, "Pending Review": 3, Approved: 15, Revision: 1 },
  { month: "Apr", year: 2025, "To Do": 8, "On Progress": 4, "Pending Review": 4, Approved: 13, Revision: 3 },
  { month: "May", year: 2025, "To Do": 12, "On Progress": 6, "Pending Review": 3, Approved: 18, Revision: 2 },
  { month: "Jun", year: 2025, "To Do": 9, "On Progress": 7, "Pending Review": 5, Approved: 16, Revision: 4 },
  { month: "Jul", year: 2025, "To Do": 11, "On Progress": 4, "Pending Review": 2, Approved: 20, Revision: 1 },
  { month: "Aug", year: 2025, "To Do": 14, "On Progress": 5, "Pending Review": 4, Approved: 22, Revision: 3 },
  { month: "Sep", year: 2025, "To Do": 13, "On Progress": 8, "Pending Review": 3, Approved: 21, Revision: 2 },
  { month: "Oct", year: 2025, "To Do": 10, "On Progress": 6, "Pending Review": 6, Approved: 19, Revision: 5 },
  { month: "Nov", year: 2025, "To Do": 16, "On Progress": 3, "Pending Review": 2, Approved: 24, Revision: 1 },
  { month: "Dec", year: 2025, "To Do": 18, "On Progress": 2, "Pending Review": 1, Approved: 26, Revision: 0 },
  { month: "Jan", year: 2026, "To Do": 8, "On Progress": 3, "Pending Review": 2, Approved: 15, Revision: 2 },
  { month: "Feb", year: 2026, "To Do": 12, "On Progress": 5, "Pending Review": 3, Approved: 18, Revision: 1 },
  { month: "Mar", year: 2026, "To Do": 15, "On Progress": 4, "Pending Review": 5, Approved: 22, Revision: 3 },
  { month: "Apr", year: 2026, "To Do": 10, "On Progress": 8, "Pending Review": 6, Approved: 20, Revision: 4 },
  { month: "May", year: 2026, "To Do": 5, "On Progress": 12, "Pending Review": 8, Approved: 25, Revision: 6 },
  { month: "Jun", year: 2026, "To Do": 4, "On Progress": 5, "Pending Review": 12, Approved: 18, Revision: 8 },
];