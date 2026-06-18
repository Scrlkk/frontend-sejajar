import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import {
  contractDataCards,
  sampleContractsData,
} from "@/data/mockData";
import {
  Contracts,
  type ContractCardItem,
} from "@/features/contracts/components/Contracts";
import { ContractModal } from "@/features/contracts/components/ContractModal";
import { DeleteModal } from "@/features/tasks/components/DeleteModal";

export const ContractPage = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<ContractCardItem[]>(() => {
    // Automatically flag overdue contracts when initializing
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return sampleContractsData.map((c) => {
      const end = new Date(c.endDate);
      end.setHours(0, 0, 0, 0);

      if (c.status !== "Completed" && c.status !== "Cancel" && end < today) {
        return {
          ...c,
          status: "Overdue",
          statusBg: "bg-red-105 text-red-650 hover:bg-red-100",
          statusDot: "bg-red-500",
        };
      }
      return c;
    });
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractCardItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingContract, setDeletingContract] = useState<ContractCardItem | null>(null);

  const handleCardClick = (item: ContractCardItem) => {
    navigate(`/contracts/${item.id}`);
  };

  const handleAddClick = () => {
    setEditingContract(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (item: ContractCardItem) => {
    setEditingContract(item);
    // Timeout to allow dropdown to close, avoiding Radix pointer-events lock
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  };

  const handleDeleteClick = (id: string | number) => {
    const item = contracts.find((c) => c.id === id);
    if (item) {
      setDeletingContract(item);
      // Timeout to allow dropdown to close, avoiding Radix pointer-events lock
      setTimeout(() => {
        setIsDeleteModalOpen(true);
      }, 100);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingContract) {
      setContracts((prev) => prev.filter((c) => c.id !== deletingContract.id));
      setIsDeleteModalOpen(false);
      setTimeout(() => {
        setDeletingContract(null);
      }, 300);
    }
  };

  const handleStatusChange = (id: string | number, newStatus: string) => {
    setContracts((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          let statusBg = "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100";
          let statusDot = "bg-green-500";
          if (newStatus === "Completed") {
            statusBg = "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100";
            statusDot = "bg-blue-500";
          } else if (newStatus === "Cancel") {
            statusBg = "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200";
            statusDot = "bg-gray-400";
          } else if (newStatus === "Overdue") {
            statusBg = "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100";
            statusDot = "bg-red-500";
          }
          return {
            ...c,
            status: newStatus,
            statusBg,
            statusDot,
          };
        }
        return c;
      })
    );
  };

  const handleSave = (data: Partial<ContractCardItem> & { id?: string | number }) => {
    if (data.id !== undefined) {
      // Edit existing
      setContracts((prev) =>
        prev.map((c) => (c.id === data.id ? ({ ...c, ...data } as ContractCardItem) : c))
      );
    } else {
      // Add new contract
      const newCode = `CNT-2026-${String(contracts.length + 1).padStart(3, "0")}`;
      const newContract: ContractCardItem = {
        id: `cnt-${Date.now()}`,
        code: newCode,
        title: data.title ?? "",
        brand: data.brand ?? "",
        description: data.description ?? "",
        platforms: data.platforms ?? [],
        currentProgress: 0,
        targetProgress: 10,
        startDate: data.startDate ?? "",
        endDate: data.endDate ?? "",
        valueAmount: data.valueAmount ?? "",
        status: data.status ?? "Active",
        statusBg: data.statusBg ?? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100",
        statusDot: data.statusDot ?? "bg-green-500",
      };
      setContracts((prev) => [...prev, newContract]);
    }
  };

  const dynamicContractDataCards = [
    {
      title: "Total Contracts",
      value: String(contracts.length),
      description: "Total Contracts",
      icon: contractDataCards[0].icon,
      iconColor: "text-gray-600",
      iconBgColor: "bg-gray-600/10",
    },
    {
      title: "Active Contracts",
      value: String(contracts.filter((c) => c.status === "Active").length),
      description: "Active Contracts",
      icon: contractDataCards[1].icon,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-600/10",
    },
    {
      title: "Completed Contracts",
      value: String(contracts.filter((c) => c.status === "Completed").length),
      description: "Complete Contracts",
      icon: contractDataCards[2].icon,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-600/10",
    },
    {
      title: "Overdue Contracts",
      value: String(contracts.filter((c) => c.status === "Overdue").length),
      description: "Overdue Contracts",
      icon: contractDataCards[3].icon,
      iconColor: "text-red-600",
      iconBgColor: "bg-red-600/10",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicContractDataCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div>
        <Contracts
          contracts={contracts}
          onCardClick={handleCardClick}
          onAddClick={handleAddClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onStatusChange={handleStatusChange}
        />
      </div>

      <ContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingContract}
        contractsList={contracts}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTimeout(() => {
            setDeletingContract(null);
          }, 300);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Contract"
        description={
          <>
            Are you sure you want to delete the contract{" "}
            <span className="font-semibold text-gray-800">
              "{deletingContract?.title || "this contract"}"
            </span>
            ? All associated content plans and tasks will be permanently removed. This action cannot be undone.
          </>
        }
      />
    </div>
  );
};
