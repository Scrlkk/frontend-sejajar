import { useState } from "react";
import type { UserData } from "@/features/users/data/usersData";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
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

interface UserManagementProps {
  users: UserData[];
  title?: string;
  itemsPerPage?: number;
}

export function UserManagement({
  users,
  title = "User Management",
  itemsPerPage = 8,
}: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = users.filter((user) => {
    const matchesName = user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesEmail = user.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRole = user.role
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesName || matchesEmail || matchesRole;
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

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="flex gap-4 w-1/2">
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
          <Button className="bg-red-800 hover:bg-red-900 text-white rounded-xl px-4 py-2 flex items-center gap-2 self-end sm:self-auto">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
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
              <TableHead className="text-gray-400 font-medium text-center">
                Actions
              </TableHead>
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
                    <Badge
                      variant="secondary"
                      className={`${user.roleBg} shadow-none rounded-lg px-2.5 py-1 font-medium text-xs border-none`}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3.5 text-gray-500">
                    {user.email}
                  </TableCell>
                  <TableCell className="py-3.5 text-gray-500">
                    {user.joined}
                  </TableCell>

                  <TableCell className="py-3.5">
                    <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 shadow-none rounded-lg px-2 py-0.5 font-bold text-xs border-none">
                      {user.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
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
                  colSpan={7}
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
                      No matching users
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      We couldn't find any users matching "{searchQuery}".
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
    </div>
  );
}
