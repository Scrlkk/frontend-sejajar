import { useState } from "react";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { clientsCards, sampleClients, type ClientData } from "@/data/mockData";
import { ClientsManagement } from "@/features/clients/components/ClientsManagement";

export const ClientsPage = () => {
  const [clients, setClients] = useState<ClientData[]>(sampleClients);

  const handleAddClient = (newClient: ClientData) => {
    setClients((prev) => [newClient, ...prev]);
  };

  const handleEditClient = (updatedClient: ClientData) => {
    setClients((prev) =>
      prev.map((c) => (c.client_id === updatedClient.client_id ? updatedClient : c))
    );
  };

  const handleDeleteClient = (id: number) => {
    setClients((prev) => prev.filter((c) => c.client_id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {clientsCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div>
        <ClientsManagement
          clients={clients}
          onAddClient={handleAddClient}
          onEditClient={handleEditClient}
          onDeleteClient={handleDeleteClient}
        />
      </div>
    </div>
  );
};