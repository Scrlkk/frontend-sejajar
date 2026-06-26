import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type {
  ContentPlanCardItem,
  TeamMember,
} from "@/features/contents/components/ContentPlan";
import { ContentPlanPreviewCard } from "@/features/contents/components/ContentPlanPreviewCard";
import { AvatarUser } from "@/features/users/components/AvatarUser";
import { useQuery } from "@tanstack/react-query";
import { getContractByIdApi } from "@/features/contracts/api/contractsApi";
import { getInitials, getAvatarBg } from "@/utils/formatter";
import { getRoleLabel } from "@/features/users/constants/roleColors";

interface AssignTeamsProps {
  isOpen: boolean;
  onClose: () => void;
  card: ContentPlanCardItem | null;
  contractId?: number;
  onSave: (cardId: string, assignedTeam: TeamMember[]) => void;
}

export interface TeamMemberCandidate extends TeamMember {
  id: string;
  role: "Script Writer" | "Editor" | "Admin Social Media";
  tasksDone: number;
}

export function AssignTeams({
  isOpen,
  onClose,
  card,
  contractId,
  onSave,
}: AssignTeamsProps) {
  const { data: contract } = useQuery({
    queryKey: ["contract", Number(contractId)],
    queryFn: () => getContractByIdApi(Number(contractId)),
    enabled: !!contractId,
  });

  const AVAILABLE_MEMBERS = useMemo(() => {
    if (!contract || !contract.teams) return [];
    return contract.teams
      .map((u) => {
        const mappedRole = u.roles
          .map(getRoleLabel)
          .find((label) =>
            ["Script Writer", "Editor", "Admin Social Media"].includes(label),
          );
        if (!mappedRole) return null;
        return {
          id: String(u.id),
          name: u.full_name,
          role: mappedRole as "Script Writer" | "Editor" | "Admin Social Media",
          initials: getInitials(u.full_name),
          avatarBg: getAvatarBg(u.full_name),
          tasksDone: 0,
        };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null);
  }, [contract]);

  const [selectedIds, setSelectedIds] = useState<string[] | null>(null);

  const initialIds = useMemo(() => {
    if (!card) return [];
    return AVAILABLE_MEMBERS.filter((m) =>
      card.assignedTeam?.some((t) => t.name === m.name),
    ).map((m) => m.id);
  }, [card, AVAILABLE_MEMBERS]);

  const activeSelectedIds = selectedIds ?? initialIds;

  if (!card) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds(
      activeSelectedIds.includes(id)
        ? activeSelectedIds.filter((itemId) => itemId !== id)
        : [...activeSelectedIds, id],
    );
  };

  const handleSave = () => {
    const selectedTeam = AVAILABLE_MEMBERS.filter((m) =>
      activeSelectedIds.includes(m.id),
    ).map((m) => ({
      name: m.name,
      initials: m.initials,
      avatarBg: m.avatarBg,
    }));
    onSave(card.id, selectedTeam);
    onClose();
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
      <DialogContent className="sm:max-w-4xl max-h-[95vh] flex flex-col rounded-2xl border border-gray-100 bg-white px-6 shadow-2xl outline-none overflow-hidden">
        <DialogHeader className="shrink-0 pb-3 border-b border-gray-100">
          <DialogTitle className="text-xl font-semibold text-gray-900 leading-none">
            Assign Team
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            Select and assign team members for each role (Script Writer, Editor,
            & Admin Social Media) on this content plan.
          </p>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-2 pr-1.5 space-y-4 scrollbar-none">
          {/* Content Plan Preview Card */}
          <ContentPlanPreviewCard card={card} />

          {/* Grouped Team Candidates in 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch min-h-60 max-h-100">
            {roles.map((roleInfo) => {
              const membersInRole = AVAILABLE_MEMBERS.filter(
                (m) => m.role === roleInfo.name,
              );
              return (
                <div
                  key={roleInfo.name}
                  className="flex flex-col space-y-3 bg-gray-50/50 border border-gray-150/70 rounded-xl p-3 flex-1 min-w-0"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-200/60 shrink-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${roleInfo.dotClass}`}
                      />
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {roleInfo.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 bg-white border border-gray-150 rounded px-1.5 py-0.5">
                      {membersInRole.length}
                    </span>
                  </div>

                  {/* Candidates Cards Stacked Vertically */}
                  <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 min-h-0 scrollbar-none">
                    {membersInRole.length === 0 ? (
                      <div className="text-[10px] text-gray-400 italic py-8 text-center">
                        Tidak ada anggota
                      </div>
                    ) : (
                      membersInRole.map((member) => {
                        const isSelected = activeSelectedIds.includes(member.id);
                        return (
                          <div
                            key={member.id}
                            onClick={() => toggleSelect(member.id)}
                            className={`rounded-xl border p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 select-none shrink-0 ${
                              isSelected
                                ? roleInfo.activeBorderClass
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* Avatar */}
                              <AvatarUser
                                initials={member.initials}
                                avatarBg={member.avatarBg}
                                size="md"
                              />
                              {/* Details */}
                              <div className="min-w-0">
                                <h5 className="text-[11px] font-semibold text-slate-800 truncate leading-tight">
                                  {member.name}
                                </h5>
                                <p className="text-[9px] text-slate-500 font-medium leading-tight">
                                  {member.tasksDone} tasks done
                                </p>
                              </div>
                            </div>

                            {/* Selected Check Indicator */}
                            {isSelected ? (
                              <div
                                className={`h-4.5 w-4.5 rounded-full flex items-center justify-center border border-current bg-white shadow-sm shrink-0 ${roleInfo.activeTextClass}`}
                              >
                                <Check className="h-2.5 w-2.5 stroke-[3px]" />
                              </div>
                            ) : (
                              <div className="h-4.5 w-4.5 rounded-full border border-gray-200 bg-white shrink-0" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
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
            disabled={activeSelectedIds.length === 0}
            className="rounded-lg bg-red-800 hover:bg-red-900 text-white font-semibold px-5 text-xs h-9 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Assign Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
