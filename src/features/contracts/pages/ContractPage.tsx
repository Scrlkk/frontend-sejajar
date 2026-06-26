import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContractsApi,
  createContractApi,
  updateContractApi,
  deleteContractApi,
  restoreContractApi,
  getContentsForProgressApi,
  mapContractToCardItem,
} from "@/features/contracts/api/contractsApi";
import {
  contractKeys,
  clientKeys,
  userKeys,
  platformKeys,
  contentKeys,
} from "@/features/contracts/api/contractKeys";
import { getContractsCards } from "@/features/contracts/constants/cardConfig";
import { getPlatformsApi } from "@/features/platforms/api/platformsApi";
import { getClientsApi } from "@/features/clients/api/clientsApi";
import { getUsersApi } from "@/features/users/api/usersApi";
import {
  Contracts,
  type ContractCardItem,
} from "@/features/contracts/components/Contracts";
import { ContractModal } from "@/features/contracts/components/ContractModal";
import { DeleteModal } from "@/features/tasks/components/DeleteModal";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

const parseRupiahToNumber = (val: string): number => {
  const clean = val.replace(/[^0-9]/g, "");
  return Number(clean) || 0;
};

export const ContractPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractCardItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingContract, setDeletingContract] = useState<ContractCardItem | null>(null);

  // Fetch active contracts
  const { data: activeContracts = [], isLoading: isLoadingActive, isError: isErrorActive } = useQuery({
    queryKey: contractKeys.list("active"),
    queryFn: () => getContractsApi({ limit: 100 }),
  });

  // Fetch deleted contracts
  const { data: deletedContracts = [], isLoading: isLoadingDeleted, isError: isErrorDeleted } = useQuery({
    queryKey: contractKeys.list("deleted"),
    queryFn: () => getContractsApi({ status: "deleted", limit: 100 }),
  });

  const apiContracts = useMemo(() => {
    return [...activeContracts, ...deletedContracts];
  }, [activeContracts, deletedContracts]);

  const isLoadingContracts = isLoadingActive || isLoadingDeleted;
  const isErrorContracts = isErrorActive || isErrorDeleted;

  // 2. Fetch contents for progress
  const { data: apiContents = [], isLoading: isLoadingContents } = useQuery({
    queryKey: contentKeys.byFilter({ limit: 1000 }),
    queryFn: () => getContentsForProgressApi(),
  });

  // 3. Fetch platforms
  const { data: platformsList = [] } = useQuery({
    queryKey: platformKeys.all,
    queryFn: () => getPlatformsApi(),
  });

  // Fetch clients
  const { data: clientsList = [] } = useQuery({
    queryKey: clientKeys.all,
    queryFn: () => getClientsApi(),
  });

  // Fetch users
  const { data: usersList = [] } = useQuery({
    queryKey: userKeys.all,
    queryFn: () => getUsersApi(),
  });

  // Map progress counts
  const progressMap = apiContents.reduce((acc, content) => {
    const cid = content.contract_id;
    if (!acc[cid]) {
      acc[cid] = { total: 0, completed: 0 };
    }
    acc[cid].total += 1;
    if (["published", "approved"].includes(content.status)) {
      acc[cid].completed += 1;
    }
    return acc;
  }, {} as Record<number, { total: number; completed: number }>);

  // Map apiContracts to ContractCardItem[]
  const contracts = apiContracts.map((c) => {
    const progress = progressMap[c.id] || { total: 0, completed: 0 };
    return mapContractToCardItem(c, progress.total, progress.completed);
  });

  const dynamicContractDataCards = getContractsCards(contracts);

  // 4. Mutations
  const createMutation = useMutation({
    mutationFn: createContractApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
      toast.success("Contract created successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error.response?.data?.message || "Failed to create contract";
      toast.error(msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof updateContractApi>[1] }) =>
      updateContractApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
      toast.success("Contract updated successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error.response?.data?.message || "Failed to update contract";
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContractApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
      toast.success("Contract deleted successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error.response?.data?.message || "Failed to delete contract";
      toast.error(msg);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreContractApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
      toast.success("Contract restored successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error.response?.data?.message || "Failed to restore contract";
      toast.error(msg);
    },
  });

  const handleCardClick = (item: ContractCardItem) => {
    navigate(`/contracts/${item.id}`);
  };

  const handleAddClick = () => {
    setEditingContract(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (item: ContractCardItem) => {
    setEditingContract(item);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
  };

  const handleDeleteClick = (id: string | number) => {
    const item = contracts.find((c) => c.id === id);
    if (item) {
      setDeletingContract(item);
      setTimeout(() => {
        setIsDeleteModalOpen(true);
      }, 100);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingContract) {
      deleteMutation.mutate(Number(deletingContract.id));
      setIsDeleteModalOpen(false);
      setDeletingContract(null);
    }
  };

  const handleRestoreClick = (id: string | number) => {
    restoreMutation.mutate(Number(id));
  };

  const handleStatusChange = (id: string | number, newStatus: string) => {
    let apiStatus = newStatus.toLowerCase();
    if (apiStatus === "cancel") apiStatus = "cancelled";

    updateMutation.mutate({
      id: Number(id),
      payload: { status: apiStatus },
    });
  };

  const handleSave = (data: Partial<ContractCardItem> & { client_id?: number; lead_by?: number }) => {
    const revenue = parseRupiahToNumber(data.valueAmount || "");
    const platformIds = data.platforms
      ?.map((pName: string) => {
        const p = platformsList.find((pObj) => pObj.platform_name.toLowerCase() === pName.toLowerCase());
        return p ? p.id : null;
      })
      .filter(Boolean) as number[];

    const matchedClient = clientsList.find(
      (c) => c.company_name.toLowerCase() === data.brand?.toLowerCase() ||
             c.client_name.toLowerCase() === data.brand?.toLowerCase()
    );
    const matchedLead = usersList.find(
      (u) => u.full_name.toLowerCase() === data.createdBy?.toLowerCase()
    );

    const client_id = matchedClient?.id ?? data.client_id;
    const lead_by = matchedLead?.id ?? data.lead_by;

    if (!client_id) {
      toast.error("Invalid client selected.");
      return;
    }
    if (!lead_by) {
      toast.error("Invalid content lead selected.");
      return;
    }
    if (!data.title) {
      toast.error("Contract title is required.");
      return;
    }

    const parseDateToISO = (dateStr?: string): string | undefined => {
      if (!dateStr) return undefined;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) return undefined;
      const yyyy = parsed.getFullYear();
      const mm = String(parsed.getMonth() + 1).padStart(2, "0");
      const dd = String(parsed.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    const getNextContractCode = () => {
      const suffixes = apiContracts
        .map((c) => {
          const match = c.contract_code.match(/CNT-2026-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((val) => val > 0);
      const maxSuffix = suffixes.length > 0 ? Math.max(...suffixes) : 0;
      return `CNT-2026-${String(maxSuffix + 1).padStart(3, "0")}`;
    };

    const payload = {
      client_id,
      contract_code: data.code || getNextContractCode(),
      contract_name: data.title,
      description: data.description,
      start_date: data.rawStartDate || parseDateToISO(data.startDate),
      end_date: data.rawEndDate || parseDateToISO(data.endDate),
      revenue,
      lead_by,
      platform_ids: platformIds,
    };

    if (data.id) {
      let apiStatus = data.status?.toLowerCase();
      if (apiStatus === "cancel") apiStatus = "cancelled";

      updateMutation.mutate({
        id: Number(data.id),
        payload: {
          contract_name: payload.contract_name,
          contract_code: payload.contract_code,
          description: payload.description,
          start_date: payload.start_date,
          end_date: payload.end_date,
          revenue: payload.revenue,
          lead_by: payload.lead_by,
          platform_ids: payload.platform_ids,
          status: apiStatus,
        },
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isLoadingContracts || isLoadingContents) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800" />
      </div>
    );
  }

  if (isErrorContracts) {
    return (
      <div className="text-center py-12 text-red-650 bg-red-50 rounded-xl border border-red-100 font-semibold">
        Error loading contracts. Please try again.
      </div>
    );
  }

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
          onRestoreClick={handleRestoreClick}
          onStatusChange={handleStatusChange}
        />
      </div>

      {isModalOpen && (
        <ContractModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialData={editingContract}
          contractsList={contracts}
        />
      )}

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
