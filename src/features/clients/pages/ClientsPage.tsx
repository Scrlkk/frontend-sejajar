import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { ClientsManagement } from "@/features/clients/components/ClientsManagement";
import {
  getClientsApi,
  createClientApi,
  updateClientApi,
  deleteClientApi,
  restoreClientApi,
  type Client,
} from "@/features/clients/api/clientsApi";
import { getClientsCards } from "@/features/clients/constants/cardConfig";
import { formatDate } from "@/utils/helpers";
import { getContractsApi } from "@/features/contracts/api/contractsApi";

// Define adapter ClientData interface locally since it is cleaned up from mockData
export interface ClientData {
  client_id: number;
  client_name: string;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  joinedDate?: string;
  status?: "active" | "inactive";
}

export const ClientsPage = () => {
  const queryClient = useQueryClient();

  // Fetch clients from API using React Query (including inactive/deleted ones)
  const { data: apiClients = [], isLoading: isClientsLoading } = useQuery<Client[]>({
    queryKey: ["clients", { all: true, limit: 100 }],
    queryFn: () => getClientsApi({ all: true, limit: 100 }),
  });

  // Fetch contracts to calculate active and completed counts dynamically
  const { data: contractsList = [], isLoading: isContractsLoading } = useQuery({
    queryKey: ["contracts"],
    queryFn: () => getContractsApi(),
  });

  const isLoading = isClientsLoading || isContractsLoading;

  // Map API clients to the UI adapter ClientData structure
  const clients: ClientData[] = apiClients.map((c) => ({
    client_id: c.id,
    client_name: c.client_name,
    company_name: c.company_name,
    contact_email: c.contact_email,
    contact_phone: c.contact_phone,
    joinedDate: c.created_at ? formatDate(c.created_at) : "",
    status: c.is_active ? "active" : "inactive",
  }));

  // Create Client Mutation
  const createMutation = useMutation({
    mutationFn: (newClient: Omit<Client, "id" | "is_active">) => createClientApi(newClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client successfully created!");
    },
    onError: () => {
      toast.error("Failed to create client.");
    },
  });

  // Edit/Update Client Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Client, "id" | "is_active">> }) =>
      updateClientApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update client.");
    },
  });

  // Deactivate/Delete Client Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteClientApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client successfully deactivated!");
    },
    onError: () => {
      toast.error("Failed to deactivate client.");
    },
  });

  // Reactivate/Restore Client Mutation
  const restoreMutation = useMutation({
    mutationFn: (id: number) => restoreClientApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client successfully reactivated!");
    },
    onError: () => {
      toast.error("Failed to reactivate client.");
    },
  });

  const handleAddClient = (newClientData: ClientData) => {
    createMutation.mutate({
      client_name: newClientData.client_name,
      company_name: newClientData.company_name,
      contact_email: newClientData.contact_email,
      contact_phone: newClientData.contact_phone,
    });
  };

  const handleEditClient = (updatedClientData: ClientData) => {
    const currentClient = apiClients.find((c) => c.id === updatedClientData.client_id);
    // If the edit changes the status to inactive, trigger soft delete
    if (updatedClientData.status === "inactive") {
      deleteMutation.mutate(updatedClientData.client_id);
    } else if (currentClient && !currentClient.is_active) {
      // If client is currently inactive and status changes to active, trigger restore
      restoreMutation.mutate(updatedClientData.client_id);
    } else {
      updateMutation.mutate({
        id: updatedClientData.client_id,
        data: {
          client_name: updatedClientData.client_name,
          company_name: updatedClientData.company_name,
          contact_email: updatedClientData.contact_email,
          contact_phone: updatedClientData.contact_phone,
        },
      });
    }
  };

  // Calculate active and completed contract counts
  const activeContractsCount = contractsList.filter(
    (c) => c.status.toLowerCase() === "active" || c.status.toLowerCase() === "overdue"
  ).length;

  const completedContractsCount = contractsList.filter(
    (c) => c.status.toLowerCase() === "completed"
  ).length;

  // Construct dashboard cards based on actual fetched client and contract data
  const cards = getClientsCards(apiClients, activeContractsCount, completedContractsCount);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div>
        {isLoading ? (
          <div className="w-full bg-white rounded-xl border border-gray-200 shadow-lg p-16 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 rounded-full border-4 border-red-800/20 border-t-red-800 animate-spin" />
              <p className="text-xs text-gray-500 font-bold">Loading clients data...</p>
            </div>
          </div>
        ) : (
          <ClientsManagement
            clients={clients}
            onAddClient={handleAddClient}
            onEditClient={handleEditClient}
          />
        )}
      </div>
    </div>
  );
};