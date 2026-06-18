import { useState } from "react";
import type { ClientData } from "@/data/mockData";
import {
  Plus,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  UserRoundPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientsModal } from "@/features/clients/components/ClientsModal";
import { DeleteModal } from "@/features/tasks/components/DeleteModal";

interface ClientsManagementProps {
  clients: ClientData[];
  onAddClient: (client: ClientData) => void;
  onEditClient: (client: ClientData) => void;
  onDeleteClient: (id: number) => void;
  title?: string;
  itemsPerPage?: number;
}

export function ClientsManagement({
  clients,
  onAddClient,
  onEditClient,
  onDeleteClient,
  title = "Client Management",
  itemsPerPage = 8,
}: ClientsManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);

  // Delete confirmation dialog states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientData | null>(null);

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      client.client_name.toLowerCase().includes(query) ||
      client.company_name.toLowerCase().includes(query) ||
      String(client.client_id).toLowerCase().includes(query) ||
      client.contact_email.toLowerCase().includes(query)
    );
  });

  const totalItems = filteredClients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

  const getInitials = (name: string) => {
    return (
      name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "C"
    );
  };

  // Avatar backgrounds themed harmoniously
  const getAvatarBg = (companyName: string) => {
    const index = companyName.charCodeAt(0) % 5;
    const colors = [
      "bg-indigo-50 text-indigo-600",
      "bg-amber-50 text-amber-600",
      "bg-emerald-50 text-emerald-600",
      "bg-rose-50 text-rose-600",
      "bg-purple-50 text-purple-600",
    ];
    return colors[index];
  };

  const handleOpenAddModal = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: ClientData) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteTrigger = (client: ClientData) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteClient = () => {
    if (clientToDelete) {
      onDeleteClient(clientToDelete.client_id);
      setIsDeleteModalOpen(false);
      setTimeout(() => {
        setClientToDelete(null);
      }, 300);
    }
  };

  const handleSaveClient = (data: Omit<ClientData, "client_id"> & { client_id?: number }) => {
    if (selectedClient) {
      onEditClient({
        ...data,
        client_id: selectedClient.client_id,
      } as ClientData);
    } else {
      const nextId = clients.length > 0 
        ? Math.max(...clients.map((c) => c.client_id)) + 1
        : 1;
      onAddClient({
        ...data,
        client_id: nextId,
        joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      } as ClientData);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-100">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company, client name, ID, or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 transition-colors"
            />
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto bg-red-800 hover:bg-red-900 text-white rounded-xl px-4 py-2 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50/20 rounded-2xl border border-dashed border-gray-200 shadow-xs">
          <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-800 shadow-sm border border-red-100 mb-4 animate-pulse">
            <UserRoundPen className="h-7 w-7" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1">
            Belum Ada Klien
          </h4>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-5 font-semibold">
            Mulai dengan mendaftarkan klien baru untuk mengelola kontak dan detail kerja sama secara terpusat.
          </p>
          <Button
            onClick={handleOpenAddModal}
            className="rounded-xl bg-red-800 hover:bg-red-900 text-white text-xs font-bold cursor-pointer h-9 px-4 flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50/20 rounded-2xl border border-dashed border-gray-200 shadow-xs">
          <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 shadow-sm border border-slate-100 mb-4">
            <Search className="h-7 w-7" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 mb-1">
            Klien Tidak Ditemukan
          </h4>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-5 font-semibold">
            Tidak ada klien yang cocok dengan kata kunci pencarian "{searchQuery}".
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchQuery("")}
            className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-755 text-xs font-bold cursor-pointer h-9 px-4"
          >
            Reset Pencarian
          </Button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-x-auto rounded-xl border border-gray-50">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-gray-400 font-medium">Company / Brand</TableHead>
                  <TableHead className="text-gray-400 font-medium">Client Name</TableHead>
                  <TableHead className="text-gray-400 font-medium">Client ID</TableHead>
                  <TableHead className="text-gray-400 font-medium">Email</TableHead>
                  <TableHead className="text-gray-400 font-medium">Phone</TableHead>
                  <TableHead className="text-gray-400 font-medium text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentItems.map((client) => {
                  const avatarStyle = getAvatarBg(client.company_name);
                  return (
                    <TableRow
                      key={client.client_id}
                      className="border-b border-gray-50 last:border-none hover:bg-gray-50/50"
                    >
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar
                            className={`h-9 w-9 ${avatarStyle} font-semibold flex items-center justify-center text-sm`}
                          >
                            <AvatarFallback className="bg-transparent">
                              {getInitials(client.company_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-gray-900">
                            {client.company_name}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-3.5 text-gray-900 font-medium">
                        {client.client_name}
                      </TableCell>

                      <TableCell className="py-3.5 text-gray-400 font-semibold text-xs">
                        {client.client_id}
                      </TableCell>

                      <TableCell className="py-3.5 text-gray-500">
                        {client.contact_email}
                      </TableCell>

                      <TableCell className="py-3.5 text-gray-500">
                        {client.contact_phone}
                      </TableCell>

                      <TableCell className="py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEditModal(client)}
                            className="h-8 w-8 text-red-550 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <UserRoundPen className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTrigger(client)}
                            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between pt-2 text-sm text-gray-500 border-t border-gray-100 mt-auto">
            <div>
              Showing{" "}
              <span className="font-medium text-gray-900">
                {totalItems === 0 ? 0 : indexOfFirstItem + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-900">
                {indexOfLastItem > totalItems ? totalItems : indexOfLastItem}
              </span>{" "}
              of <span className="font-medium text-gray-900">{totalItems}</span>{" "}
              clients
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-xl h-9 px-3 gap-1 border-gray-200"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center justify-center min-w-8 font-medium text-gray-900 px-2">
                Page {currentPage} of {totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="rounded-xl h-9 px-3 gap-1 border-gray-200"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Modal Add/Edit Client */}
      {isModalOpen && (
        <ClientsModal
          key={selectedClient ? `edit-${selectedClient.client_id}` : "add-new"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveClient}
          client={selectedClient}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTimeout(() => {
            setClientToDelete(null);
          }, 300);
        }}
        onConfirm={confirmDeleteClient}
        title="Hapus Klien"
        description={
          <>
            Apakah Anda yakin ingin menghapus klien{" "}
            <span className="font-semibold text-gray-950">
              {clientToDelete?.company_name}
            </span>
            ? Semua alokasi kontrak terkait klien ini akan diputus secara permanen. Tindakan ini tidak dapat dibatalkan.
          </>
        }
      />
    </div>
  );
}
