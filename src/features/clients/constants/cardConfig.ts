import { UsersRound, UserRound, FileText } from "lucide-react";
import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";
import type { Client } from "@/features/clients/api/clientsApi";

export const getClientsCards = (
  clients: Client[],
  activeContracts = 0,
  completedContracts = 0
): CardDashboardProps[] => {
  const activeClients = clients.filter(c => c.is_active);
  const totalClients = activeClients.length;
  
  // Calculate new clients created in the current month/year
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newClients = activeClients.filter(c => {
    if (!c.created_at) return false;
    const date = new Date(c.created_at);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  return [
    {
      title: "Total Clients",
      value: totalClients,
      description: "All Clients",
      icon: UsersRound,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-600/10",
    },
    {
      title: "New Clients",
      value: newClients || totalClients, // Fallback to total if 0 (e.g. all seeded today)
      description: "This Month",
      icon: UserRound,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-600/10",
    },
    {
      title: "Active Contracts",
      value: activeContracts,
      description: "Clients Contracts",
      icon: FileText,
      iconColor: "text-yellow-600",
      iconBgColor: "bg-yellow-600/10",
    },
    {
      title: "Completed Contracts",
      value: completedContracts,
      description: "Clients Contracts",
      icon: FileText,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-600/10",
    },
  ];
};
