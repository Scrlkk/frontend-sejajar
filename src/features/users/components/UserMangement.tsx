import { useState } from "react";
import type { UserData } from "@/features/users/api/usersApi";
import {
  Plus,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  UserRoundPen,
  UserCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ModalUsers } from "@/features/users/components/ModalUsers";
import type { UserFormValues } from "@/features/users/components/ModalUsers";
import { DeleteModal } from "@/features/tasks/components/DeleteModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePermissions } from "@/hooks/usePermissions";
import { getRoleVisuals } from "@/features/users/constants/roleColors";

interface UserManagementProps {
  users: UserData[];
  onSaveUser?: (data: UserFormValues & { id?: number }) => void;
  onDeleteUser?: (id: number) => void;
  onReactivateUser?: (id: number) => void;
  title?: string;
  itemsPerPage?: number;
}

export function UserManagement({
  users,
  onSaveUser,
  onDeleteUser,
  onReactivateUser,
  title = "User Management",
  itemsPerPage = 8,
}: UserManagementProps) {
  const { isAdmin } = usePermissions();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const roles = Array.from(
    new Set(
      users.flatMap((user) =>
        user.role ? user.role.split(",").map((r) => r.trim()) : [],
      ),
    ),
  ).filter(
    (role) =>
      role !== "Super Admin" &&
      role !== "Superadmin" &&
      role !== "" &&
      (isAdmin || role.toLowerCase() !== "owner"),
  );

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const filteredUsers = users.filter((user) => {
    if (user.role === "Super Admin" || user.role === "Superadmin") return false;

    // Specifically for owner role viewing, exclude owner role users
    if (!isAdmin && user.role) {
      const userRolesList = user.role.split(",").map((r) => r.trim().toLowerCase());
      if (userRolesList.includes("owner")) return false;
    }

    const matchesName = user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesEmail = user.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRole = user.role
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRoleFilter =
      roleFilter === "all" ||
      (user.role &&
        user.role
          .split(",")
          .map((r) => r.trim())
          .includes(roleFilter));
    return (
      (matchesName || matchesEmail || matchesRole) &&
      matchesStatus &&
      matchesRoleFilter
    );
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);





  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserData) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Delete confirmation dialog states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  const handleDeleteUser = (user: UserData) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      onDeleteUser?.(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Reactivate confirmation dialog states
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);
  const [userToReactivate, setUserToReactivate] = useState<UserData | null>(
    null,
  );

  const handleReactivateUser = (user: UserData) => {
    setUserToReactivate(user);
    setIsReactivateModalOpen(true);
  };

  const confirmReactivateUser = () => {
    if (userToReactivate) {
      onReactivateUser?.(userToReactivate.id);
      setIsReactivateModalOpen(false);
      setUserToReactivate(null);
    }
  };

  const handleSaveUser = (data: UserFormValues & { id?: number }) => {
    onSaveUser?.(data);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {isAdmin && (
          <Button
            onClick={handleOpenAddModal}
            className="w-auto bg-red-800 hover:bg-red-900 text-white rounded-xl px-4 py-2 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 w-full">
        <div className="w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 transition-colors"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(val) =>
              setStatusFilter(val as "all" | "active" | "inactive")
            }
          >
            <SelectTrigger className="w-full sm:w-40 rounded-xl border-gray-200 bg-gray-50/50 py-2.5 text-left focus:outline-none focus:border-red-800 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
              <SelectItem
                value="all"
                className="rounded-lg py-2 focus:bg-red-50 focus:text-red-900 cursor-pointer"
              >
                All Status
              </SelectItem>
              <SelectItem
                value="active"
                className="rounded-lg py-2 focus:bg-red-50 focus:text-red-900 cursor-pointer"
              >
                Active Users
              </SelectItem>
              <SelectItem
                value="inactive"
                className="rounded-lg py-2 focus:bg-red-50 focus:text-red-900 cursor-pointer"
              >
                Inactive Users
              </SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={roleFilter}
            onValueChange={(val) => {
              setRoleFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40 rounded-xl border-gray-200 bg-gray-50/50 py-2.5 text-left focus:outline-none focus:border-red-800 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
              <SelectItem
                value="all"
                className="rounded-lg py-2 focus:bg-red-50 focus:text-red-900 cursor-pointer"
              >
                All Roles
              </SelectItem>
              {roles.map((role) => (
                <SelectItem
                  key={role}
                  value={role}
                  className="rounded-lg py-2 focus:bg-red-50 focus:text-red-900 cursor-pointer"
                >
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto rounded-xl border border-gray-50">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-gray-400 font-medium">User</TableHead>
              <TableHead className="text-gray-400 font-medium">Role</TableHead>
              <TableHead className="text-gray-400 font-medium">Email</TableHead>
              <TableHead className="text-gray-400 font-medium">
                Joined
              </TableHead>
              <TableHead className="text-gray-400 font-medium">
                Status
              </TableHead>
              {isAdmin && (
                <TableHead className="text-gray-400 font-medium text-center">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-b border-gray-50 last:border-none hover:bg-gray-50/50"
                >
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar
                        className={`h-9 w-9 ${user.avatarBg} font-semibold flex items-center justify-center text-sm`}
                      >
                        <AvatarFallback className="bg-transparent">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-55">
                      {user.role ? user.role.split(",").map((r) => {
                        const cleanRole = r.trim();
                        const visuals = getRoleVisuals(cleanRole);
                        return (
                          <Badge
                            key={cleanRole}
                            variant="secondary"
                            className={`${visuals.roleBg} shadow-none rounded-lg px-2.5 py-1 font-medium text-xs border-none`}
                          >
                            {cleanRole}
                          </Badge>
                        );
                      }) : null}
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5 text-gray-500">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-3.5 text-gray-500">
                    {user.joined}
                  </TableCell>

                  <TableCell className="py-3.5">
                    <Badge
                      className={`${
                        user.status === "active"
                          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                          : "bg-red-50 text-red-600 hover:bg-red-50"
                      } shadow-none rounded-lg px-2 py-0.5 font-bold text-xs border-none`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>

                  {isAdmin && (
                    <TableCell className="py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditModal(user)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <UserRoundPen className="h-4 w-4" />
                        </Button>
                        {user.status === "active" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user)}
                            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReactivateUser(user)}
                            className="h-8 w-8 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 7 : 6}
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
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-500">
                      No users found
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      There are no users registered in the system yet.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 7 : 6}
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
                      {searchQuery
                        ? "No matching users"
                        : statusFilter === "inactive"
                          ? "No inactive users"
                          : statusFilter === "active"
                            ? "No active users"
                            : roleFilter !== "all"
                              ? `No users with role ${roleFilter}`
                              : "No matching users"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchQuery
                        ? `We couldn't find any users matching "${searchQuery}".`
                        : statusFilter !== "all" && roleFilter !== "all"
                          ? `We couldn't find any ${statusFilter} users with role "${roleFilter}" in the system.`
                          : statusFilter !== "all"
                            ? `We couldn't find any ${statusFilter} users in the system.`
                            : roleFilter !== "all"
                              ? `We couldn't find any users with role "${roleFilter}" in the system.`
                              : "We couldn't find any users matching the criteria."}
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
          users
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

      {/* Modal Users Component */}
      {isModalOpen && (
        <ModalUsers
          key={selectedUser ? `edit-${selectedUser.id}` : "add-new"}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          user={selectedUser}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteUser}
        title="Deactivate Account (Soft Delete)"
        description={
          <>
            Are you sure you want to deactivate{" "}
            <span className="font-semibold text-gray-950">
              {userToDelete?.name}
            </span>
            ? Their access will be suspended, but you can reactivate this
            account at any time from the edit settings.
          </>
        }
        cancelText="Cancel"
        confirmText="Deactivate"
      />

      {/* Reactivate Confirmation Dialog */}
      <DeleteModal
        isOpen={isReactivateModalOpen}
        onClose={() => setIsReactivateModalOpen(false)}
        onConfirm={confirmReactivateUser}
        title="Reactivate Account"
        description={
          <>
            Are you sure you want to reactivate{" "}
            <span className="font-semibold text-gray-950">
              {userToReactivate?.name}
            </span>
            ? Their access will be restored, and they will be able to log in
            and use the system again.
          </>
        }
        icon={<User className="h-6 w-6" />}
        iconBgColor="bg-emerald-50"
        iconBorderColor="border-emerald-200"
        iconTextColor="text-emerald-800"
        cancelText="Cancel"
        confirmText="Reactivate"
        confirmBtnClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
      />
    </div>
  );
}
