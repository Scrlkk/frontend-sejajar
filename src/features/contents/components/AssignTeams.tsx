import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { ContentPlanCardItem, TeamMember } from "@/features/contents/components/ContentPlan";
import { ContentPlanPreviewCard } from "@/features/contents/components/ContentPlanPreviewCard";

interface AssignTeamsProps {
  isOpen: boolean;
  onClose: () => void;
  card: ContentPlanCardItem | null;
  onSave: (cardId: string, assignedTeam: TeamMember[]) => void;
}

export interface TeamMemberCandidate extends TeamMember {
  id: string;
  role: "Script Writer" | "Editor" | "Admin Social Media";
  tasksDone: number;
}

const AVAILABLE_MEMBERS: TeamMemberCandidate[] = [
  {
    id: "1",
    name: "James Rivera",
    initials: "JR",
    avatarBg: "bg-indigo-100 text-indigo-700",
    role: "Script Writer",
    tasksDone: 38,
  },
  {
    id: "2",
    name: "Mia Chen",
    initials: "MC",
    avatarBg: "bg-purple-100 text-purple-700",
    role: "Script Writer",
    tasksDone: 29,
  },
  {
    id: "3",
    name: "Lucas Hoffmann",
    initials: "LH",
    avatarBg: "bg-pink-100 text-pink-700",
    role: "Editor",
    tasksDone: 52,
  },
  {
    id: "4",
    name: "Aria Thompson",
    initials: "AT",
    avatarBg: "bg-rose-100 text-rose-700",
    role: "Editor",
    tasksDone: 41,
  },
  {
    id: "5",
    name: "Diego Santos",
    initials: "DS",
    avatarBg: "bg-emerald-100 text-emerald-700",
    role: "Admin Social Media",
    tasksDone: 33,
  },
  {
    id: "6",
    name: "Nina Patel",
    initials: "NP",
    avatarBg: "bg-teal-100 text-teal-700",
    role: "Admin Social Media",
    tasksDone: 28,
  },
  {
    id: "7",
    name: "Atta Halilintar",
    initials: "AH",
    avatarBg: "bg-blue-100 text-blue-700",
    role: "Admin Social Media",
    tasksDone: 99,
  },
];

export function AssignTeams({
  isOpen,
  onClose,
  card,
  onSave,
}: AssignTeamsProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (!card) return [];
    return AVAILABLE_MEMBERS.filter((m) =>
      card.assignedTeam?.some((t) => t.name === m.name),
    ).map((m) => m.id);
  });
  const [notes, setNotes] = useState("");

  if (!card) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const handleSave = () => {
    const selectedTeam = AVAILABLE_MEMBERS.filter((m) =>
      selectedIds.includes(m.id),
    ).map((m) => ({
      name: m.name,
      initials: m.initials,
      avatarBg: m.avatarBg,
    }));
    onSave(card.id, selectedTeam);
  };

  const roles = [
    {
      name: "Script Writer" as const,
      dotClass: "bg-indigo-600",
      activeTextClass: "text-indigo-600",
      activeBorderClass:
        "border-indigo-500 bg-indigo-50/10 ring-1 ring-indigo-500/10",
    },
    {
      name: "Editor" as const,
      dotClass: "bg-pink-600",
      activeTextClass: "text-pink-600",
      activeBorderClass:
        "border-pink-500 bg-pink-50/10 ring-1 ring-pink-500/10",
    },
    {
      name: "Admin Social Media" as const,
      dotClass: "bg-emerald-600",
      activeTextClass: "text-emerald-600",
      activeBorderClass:
        "border-emerald-500 bg-emerald-50/10 ring-1 ring-emerald-500/10",
    },
  ];



  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-160 max-h-[90vh] flex flex-col rounded-2xl border border-gray-100 bg-white px-6 shadow-2xl outline-none overflow-hidden">
        <DialogHeader className="shrink-0 pb-2 border-b border-gray-100 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-gray-900 leading-none">
            Assign Team
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 pr-1.5 space-y-6 scrollbar-none">
          {/* Content Plan Preview Card */}
          <ContentPlanPreviewCard card={card} />

          {/* Grouped Team Candidates */}
          <div className="space-y-5">
            {roles.map((roleInfo) => {
              const membersInRole = AVAILABLE_MEMBERS.filter(
                (m) => m.role === roleInfo.name,
              );
              return (
                <div key={roleInfo.name} className="space-y-3">
                  {/* Category Header */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full shrink-0 ${roleInfo.dotClass}`}
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      {roleInfo.name}
                    </span>
                  </div>

                  {/* Candidates Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {membersInRole.map((member) => {
                      const isSelected = selectedIds.includes(member.id);
                      return (
                        <div
                          key={member.id}
                          onClick={() => toggleSelect(member.id)}
                          className={`rounded-xl border p-3 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 select-none ${
                            isSelected
                              ? roleInfo.activeBorderClass
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Avatar */}
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm shrink-0 ${member.avatarBg}`}
                            >
                              {member.initials}
                            </div>
                            {/* Details */}
                            <div className="min-w-0">
                              <h5 className="text-xs font-semibold text-slate-800 truncate leading-snug">
                                {member.name}
                              </h5>
                              <p className="text-[10px] text-slate-500 font-base leading-tight">
                                {member.tasksDone} tasks done
                              </p>
                            </div>
                          </div>

                          {/* Selected Check Indicator */}
                          {isSelected ? (
                            <div
                              className={`h-5 w-5 rounded-full flex items-center justify-center border border-current bg-white shadow-sm shrink-0 ${roleInfo.activeTextClass}`}
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
                </div>
              );
            })}
          </div>

          {/* Assignment Notes */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700">
              Assignment Notes
            </span>
            <textarea
              placeholder="Add notes for the team..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex min-h-20 w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3.5 py-2.5 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-red-800 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer actions */}
        <DialogFooter className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3 sm:space-x-0 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-lg border-gray-200 hover:bg-gray-50 text-gray-700 px-5 text-xs font-semibold h-9 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-red-800 hover:bg-red-900 text-white font-semibold px-5 text-xs h-9 transition-all cursor-pointer"
          >
            Assign Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
