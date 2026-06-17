import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check } from "lucide-react";
import type { TeamMemberItem } from "@/features/contracts/components/TeamsMember";
import { AvatarUser } from "@/features/users/components/AvatarUser";

interface AssignMembersProps {
  isOpen: boolean;
  onClose: () => void;
  currentMembers: TeamMemberItem[];
  onSave: (selectedMembers: TeamMemberItem[]) => void;
}

const ALL_CANDIDATES: TeamMemberItem[] = [
  {
    name: "James Rivera",
    role: "Script Writer",
    initials: "JR",
    avatarBg: "bg-purple-100 text-purple-700",
  },
  {
    name: "Mia Chen",
    role: "Script Writer",
    initials: "MC",
    avatarBg: "bg-purple-100 text-purple-700",
  },
  {
    name: "Lucas Hoffmann",
    role: "Editor",
    initials: "LH",
    avatarBg: "bg-pink-100 text-pink-700",
  },
  {
    name: "Aria Thompson",
    role: "Editor",
    initials: "AT",
    avatarBg: "bg-rose-100 text-rose-700",
  },
  {
    name: "Diego Santos",
    role: "Admin Social Media",
    initials: "DS",
    avatarBg: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Nina Patel",
    role: "Admin Social Media",
    initials: "NP",
    avatarBg: "bg-teal-100 text-teal-700",
  },
  {
    name: "Atta Halilintar",
    role: "Admin Social Media",
    initials: "AH",
    avatarBg: "bg-blue-100 text-blue-700",
  },
];

export function AssignMembers({
  isOpen,
  onClose,
  currentMembers,
  onSave,
}: AssignMembersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("All");

  const [selectedNames, setSelectedNames] = useState<string[]>(() => {
    return currentMembers.map((m) => m.name);
  });

  const toggleSelect = (name: string) => {
    setSelectedNames((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };

  const handleSave = () => {
    const selectedMembers = ALL_CANDIDATES.filter((m) =>
      selectedNames.includes(m.name)
    );
    onSave(selectedMembers);
  };

  // Filter and search logic
  const filteredCandidates = useMemo(() => {
    return ALL_CANDIDATES.filter((candidate) => {
      const matchesSearch = candidate.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRole =
        selectedRole === "All" || candidate.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, selectedRole]);

  // Helper to determine styling based on role
  const getRoleStyles = (role: string) => {
    switch (role) {
      case "Script Writer":
        return {
          activeBorder: "border-purple-500 bg-purple-50/10 ring-1 ring-purple-500/10",
          activeText: "text-purple-600",
        };
      case "Editor":
        return {
          activeBorder: "border-pink-500 bg-pink-50/10 ring-1 ring-pink-500/10",
          activeText: "text-pink-600",
        };
      case "Admin Social Media":
        return {
          activeBorder: "border-emerald-500 bg-emerald-50/10 ring-1 ring-emerald-500/10",
          activeText: "text-emerald-600",
        };
      default:
        return {
          activeBorder: "border-indigo-500 bg-indigo-50/10 ring-1 ring-indigo-500/10",
          activeText: "text-indigo-650",
        };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-130 max-h-[90vh] flex flex-col rounded-2xl border border-gray-100 bg-white px-6 shadow-2xl outline-none overflow-hidden">
        <DialogHeader className="shrink-0 pb-2 border-b border-gray-100 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-gray-900 leading-none">
            Assign Contract Members
          </DialogTitle>
        </DialogHeader>

        {/* Search & Filter Section */}
        <div className="shrink-0 pt-4 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search members by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl border border-gray-200 bg-gray-50/30 focus-visible:ring-0 focus-visible:border-red-800 transition-colors"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex flex-wrap gap-2 pb-1">
            {["All", "Script Writer", "Editor", "Admin Social Media"].map((role) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? "border-red-800 text-red-800 bg-red-50/10 shadow-sm"
                      : "border-gray-200 text-slate-500 hover:bg-gray-50 bg-white"
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Members List */}
        <div className="flex-1 overflow-y-auto py-2 pr-1.5 space-y-3 scrollbar-none min-h-[44vh]">
          {filteredCandidates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
              {filteredCandidates.map((candidate) => {
                const isSelected = selectedNames.includes(candidate.name);
                const roleStyle = getRoleStyles(candidate.role);
                return (
                  <div
                    key={candidate.name}
                    onClick={() => toggleSelect(candidate.name)}
                    className={`rounded-xl border p-3 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 select-none ${
                      isSelected
                        ? roleStyle.activeBorder
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Avatar */}
                      <AvatarUser
                        initials={candidate.initials}
                        avatarBg={candidate.avatarBg}
                        size="lg"
                      />
                      {/* Details */}
                      <div className="min-w-0">
                        <h5 className="text-xs font-semibold text-slate-800 truncate leading-snug">
                          {candidate.name}
                        </h5>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight">
                          {candidate.role}
                        </p>
                      </div>
                    </div>

                    {/* Selected Check Indicator */}
                    {isSelected ? (
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center border border-current bg-white shadow-sm shrink-0 ${roleStyle.activeText}`}
                      >
                        <Check className="h-3 w-3 stroke-[3px]" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-gray-200 bg-white shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <p className="text-sm text-slate-400 font-medium">
                No members found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <DialogFooter className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 sm:space-x-0 shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            {selectedNames.length} members selected
          </span>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 text-xs font-semibold h-9 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-red-800 hover:bg-red-900 text-white font-semibold px-5 text-xs h-9 transition-all cursor-pointer"
            >
              Assign Members
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
