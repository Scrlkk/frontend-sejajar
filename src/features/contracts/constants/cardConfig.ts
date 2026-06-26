import { FileText } from "lucide-react";
import type { CardDashboardProps } from "@/features/dashboard/components/CardDashboard";
import type { ContractCardItem } from "../components/Contracts";

export const getContractsCards = (
  contracts: ContractCardItem[],
): CardDashboardProps[] => {
  const countStatus = (statusName: string) => {
    return contracts.filter((c) => !c.deletedAt && c.status === statusName)
      .length;
  };

  const activeCount = contracts.filter((c) => !c.deletedAt).length;

  return [
    {
      title: "Total Contracts",
      value: activeCount,
      description: "Total Contracts",
      icon: FileText,
      iconColor: "text-gray-600",
      iconBgColor: "bg-gray-600/10",
    },
    {
      title: "Active Contracts",
      value: countStatus("Active"),
      description: "Active Contracts",
      icon: FileText,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-600/10",
    },
    {
      title: "Completed Contracts",
      value: countStatus("Completed"),
      description: "Complete Contracts",
      icon: FileText,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-600/10",
    },
    {
      title: "Overdue Contracts",
      value: countStatus("Overdue"),
      description: "Overdue Contracts",
      icon: FileText,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-600/10",
    },
  ];
};
