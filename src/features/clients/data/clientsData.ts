import { FileText, UserRound, UsersRound } from "lucide-react";
import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";

export const clientsCards: CardDashboardProps[] = [
  {
    title: "Total Clients",
    value: 5,
    description: "All Clients",
    icon: UsersRound,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-600/10",
  },
  {
    title: "New Clients",
    value: 12,
    description: "This Month",
    icon: UserRound,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
  },
  {
    title: "Active Contracts",
    value: 6,
    description: "Clients Contracts",
    icon: FileText,
    iconColor: "text-yellow-600",
    iconBgColor: "bg-yellow-600/10",
  },
  {
    title: "Completed Contracts",
    value: 18,
    description: "Clients Contracts",
    icon: FileText,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
  },
];

export interface ClientData {
  client_id: number;
  client_name: string;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  joinedDate?: string;
}

export const sampleClients: ClientData[] = [
  {
    client_id: 1,
    client_name: "John Vision",
    company_name: "TechVision Corp",
    contact_email: "john@techvision.com",
    contact_phone: "+62 812-3456-7890",
    joinedDate: "Jan 12, 2024",
  },
  {
    client_id: 2,
    client_name: "Sarah Brew",
    company_name: "FreshBrew Coffee",
    contact_email: "sarah@freshbrew.co",
    contact_phone: "+62 899-8877-6655",
    joinedDate: "Mar 1, 2024",
  },
  {
    client_id: 3,
    client_name: "Elena Glow",
    company_name: "BeautyGlow Brand",
    contact_email: "elena@beautyglow.com",
    contact_phone: "+62 821-4455-6677",
    joinedDate: "Apr 15, 2024",
  },
  {
    client_id: 4,
    client_name: "David Fit",
    company_name: "FitLife Sports",
    contact_email: "david@fitlife.co.id",
    contact_phone: "+62 811-2233-4455",
    joinedDate: "May 1, 2024",
  },
  {
    client_id: 5,
    client_name: "Michael Zara",
    company_name: "Zara Studio",
    contact_email: "michael@zara.studio",
    contact_phone: "+62 813-1122-3344",
    joinedDate: "Jun 10, 2024",
  },
];
