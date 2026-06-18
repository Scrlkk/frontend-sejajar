import { useState } from "react";
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ManualEngagementEntry } from "@/data/mockData";
import toast from "react-hot-toast";
import { EngagementModal } from "@/features/analytics/components/EngagementModal";
import { DeleteModal } from "@/features/tasks/components/DeleteModal";

type Platform = ManualEngagementEntry["platform"];

const platformBadgeBg: Record<Platform, string> = {
  Instagram: "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700",
  TikTok: "bg-gray-100 text-gray-700",
  YouTube: "bg-red-50 text-red-700",
  Twitter: "bg-blue-50 text-blue-700",
};

interface EngagementProps {
  initialEntries: ManualEngagementEntry[];
  title?: string;
  itemsPerPage?: number;
  onAdd?: () => void;
  onUpdate?: (item: ManualEngagementEntry) => void;
  onDelete?: (item: ManualEngagementEntry) => void;
}

export function Engagement({
  initialEntries,
  title = "Engagement Entries",
  itemsPerPage = 6,
  onAdd,
  onUpdate,
  onDelete,
}: EngagementProps) {
  const [entries, setEntries] =
    useState<ManualEngagementEntry[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<ManualEngagementEntry | null>(
    null,
  );

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] =
    useState<ManualEngagementEntry | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddClick = () => {
    setModalMode("create");
    setEditingItem(null);
    setIsModalOpen(true);
    onAdd?.();
  };

  const handleUpdateClick = (item: ManualEngagementEntry) => {
    setModalMode("edit");
    setEditingItem(item);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
    onUpdate?.(item);
  };

  const handleDeleteClick = (item: ManualEngagementEntry) => {
    setItemToDelete(item);
    setTimeout(() => {
      setIsDeleteModalOpen(true);
    }, 100);
    onDelete?.(item);
  };

  const handleModalSave = (data: {
    contentTitle: string;
    platform: ManualEngagementEntry["platform"];
    date: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }) => {
    if (modalMode === "create") {
      const newEntry: ManualEngagementEntry = {
        id: Date.now(),
        ...data,
      };
      setEntries((prev) => [newEntry, ...prev]);
      toast.success("Entri engagement berhasil ditambahkan!");
    } else if (editingItem) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingItem.id ? { ...entry, ...data } : entry,
        ),
      );
      toast.success("Entri engagement berhasil diperbarui!");
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setEntries((prev) =>
        prev.filter((entry) => entry.id !== itemToDelete.id),
      );
      toast.success("Entri engagement berhasil dihapus!");
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const filteredEntries = entries.filter((entry) => {
    return (
      entry.contentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.platform.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalItems = filteredEntries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEntries.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="flex gap-4 w-full sm:w-1/2">
          <div className="w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or platform..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 transition-colors"
            />
          </div>
          <Button
            onClick={handleAddClick}
            className="bg-red-800 hover:bg-red-900 text-white rounded-xl px-4 py-2 flex items-center gap-2 shrink-0 cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto rounded-xl border border-gray-50">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-gray-400 font-medium py-3">
                Content
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                Platform
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3">
                Last Updated
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3 text-center">
                Views
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3 text-center">
                Likes
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3 text-center">
                Comments
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3 text-center">
                Shares
              </TableHead>
              <TableHead className="text-gray-400 font-medium py-3 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((entry) => (
                <TableRow
                  key={entry.id}
                  className="border-b border-gray-50 last:border-none hover:bg-gray-50/30 transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="flex flex-col max-w-60">
                      <span className="font-bold text-gray-900 leading-snug wrap-break-word">
                        {entry.contentTitle}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <Badge
                      variant="outline"
                      className={`${platformBadgeBg[entry.platform]} shadow-none rounded-lg px-2.5 py-1 font-medium text-xs`}
                    >
                      {entry.platform}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4 text-gray-500 font-medium text-sm">
                    <span className="flex items-center gap-1.5">
                      {new Date(entry.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700/90">
                      <Eye className="h-3.5 w-3.5 stroke-[2.5]" />
                      {entry.views.toLocaleString()}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-pink-600">
                      <Heart className="h-3.5 w-3.5 stroke-[2.5]" />
                      {entry.likes.toLocaleString()}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                      <MessageCircle className="h-3.5 w-3.5 stroke-[2.5]" />
                      {entry.comments.toLocaleString()}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <Share2 className="h-3.5 w-3.5 stroke-[2.5]" />
                      {entry.shares.toLocaleString()}
                    </span>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-gray-50/50 hover:bg-gray-100 text-gray-600 border-gray-200/80 rounded-xl px-3 h-8 text-xs flex items-center gap-1.5 shadow-none"
                          >
                            Manage
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 rounded-xl"
                        >
                          <DropdownMenuItem
                            onClick={() => handleUpdateClick(entry)}
                            className="cursor-pointer text-xs gap-2 rounded-lg"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Update
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(entry)}
                            className="cursor-pointer text-xs gap-2 rounded-lg text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : entries.length === 0 ? (
              /* Empty state - no data */
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-16 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <MessageCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">
                      Belum ada data engagement
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Klik &quot;Tambah&quot; untuk menambahkan data manual
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              /* Empty state - no search results */
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-16 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500">
                      No matching content
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      We couldn't find any content matching "{searchQuery}".
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
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
          contents
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

      {/* Engagement Create/Edit Modal */}
      <EngagementModal
        key={
          isModalOpen
            ? editingItem
              ? `edit-eng-${editingItem.id}`
              : "new-eng"
            : "closed"
        }
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        editingItem={editingItem}
        onSave={handleModalSave}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Entri Engagement?"
        description={
          itemToDelete ? (
            <>
              Apakah Anda yakin ingin menghapus data engagement untuk{" "}
              <span className="font-semibold text-gray-800">
                "{itemToDelete.contentTitle}"
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </>
          ) : (
            ""
          )
        }
      />
    </div>
  );
}
