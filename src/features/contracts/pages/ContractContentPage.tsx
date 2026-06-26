import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import {
  getContractByIdApi,
  updateContractApi,
} from "@/features/contracts/api/contractsApi";
import {
  contractKeys,
  clientKeys,
  userKeys,
  contentKeys,
} from "@/features/contracts/api/contractKeys";
import { getClientByIdApi } from "@/features/clients/api/clientsApi";
import { getUsersApi } from "@/features/users/api/usersApi";
import { getInitials, getAvatarBg } from "@/utils/formatter";
import { getRoleLabel } from "@/features/users/constants/roleColors";
import { formatDate } from "@/utils/helpers";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { TeamMemberItem } from "@/features/contracts/components/TeamsMember";
import { usePermissions } from "@/hooks/usePermissions";
import { differenceInDays } from "date-fns";

interface ContractContentPlan {
  id: number;
  title: string;
  status: string;
  platform_name: string;
  due_date: string;
}

import { useRef, useCallback, useState } from "react";
import {
  ArrowLeft,
  Users,
  Plus,
  MessageSquare,
  FileText,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { ContractInfo } from "@/features/contracts/components/ContractInfo";
import { ProductionProgress } from "@/features/contracts/components/ProductionProgress";
import { TeamsMember } from "@/features/contracts/components/TeamsMember";
import { ContentPlan } from "@/features/contents/components/ContentPlan";
import { RevisionContract } from "@/features/reviews/components/RevisionContract";
import { AssignMembers } from "@/features/contents/components/AssignMembers";
import { PillarsContract } from "@/features/pillars/components/PillarsContract";

export function ContractContentPage() {
  const navigate = useNavigate();
  const { roles, isClient } = usePermissions();
  const isOwner = roles.includes("owner");
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isAssignMembersOpen, setIsAssignMembersOpen] = useState(false);

  const contractId = Number(id) || 1;

  // 1. Fetch Contract Detail
  const {
    data: contract,
    isLoading: isLoadingContract,
    isError: isErrorContract,
  } = useQuery({
    queryKey: contractKeys.detail(contractId),
    queryFn: () => getContractByIdApi(contractId),
  });

  // 2. Fetch Client Info
  const { data: client } = useQuery({
    queryKey: clientKeys.detail(contract?.client_id),
    queryFn: () => getClientByIdApi(contract!.client_id),
    enabled: !!contract?.client_id,
  });

  // 3. Fetch All Users for team candidates
  const { data: allUsers = [] } = useQuery({
    queryKey: userKeys.all,
    queryFn: () => getUsersApi(),
  });

  // 4. Fetch Contract Contents for progress calculation
  const { data: contractContents = [], isLoading: isLoadingContents } =
    useQuery({
      queryKey: contentKeys.byFilter({ contract_id: contractId }),
      queryFn: async (): Promise<ContractContentPlan[]> => {
        const response = await api.get<{ data: ContractContentPlan[] }>(
          ENDPOINTS.CONTENTS.BASE,
          {
            params: { contract_id: contractId, limit: 1000 },
          },
        );
        return response.data.data;
      },
    });

  // 5. Team Assign Mutation
  const assignMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Parameters<typeof updateContractApi>[1];
    }) => updateContractApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(contractId) });
      toast.success("Team members assigned successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg =
        error.response?.data?.message || "Failed to assign team members";
      toast.error(msg);
    },
  });

  const openContentModalRef = useRef<(() => void) | null>(null);
  const handleRegisterOpenModal = useCallback((fn: () => void) => {
    openContentModalRef.current = fn;
  }, []);

  const openFeedbackModalRef = useRef<(() => void) | null>(null);
  const handleRegisterFeedbackModal = useCallback((fn: () => void) => {
    openFeedbackModalRef.current = fn;
  }, []);

  if (isLoadingContract || isLoadingContents) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800" />
      </div>
    );
  }

  if (isErrorContract || !contract) {
    return (
      <div className="text-center py-12 text-red-650 bg-red-50 rounded-xl border border-red-100 font-semibold">
        Error loading contract detail. Please try again.
      </div>
    );
  }

  const totalContents = contractContents.length;
  const completedContents = contractContents.filter((c) =>
    ["published", "approved"].includes(c.status),
  ).length;

  const isOverdue =
    contract.status.toLowerCase() === "active" &&
    contract.end_date &&
    new Date(contract.end_date) < new Date() &&
    (totalContents === 0 || completedContents < totalContents);

  const displayStatus = isOverdue ? "Overdue" : contract.status;

  const parseLocalMidnight = (dateStr: string) => {
    if (!dateStr) return new Date();
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, day] = dateStr.split('-').map(Number);
      return new Date(y, m - 1, day);
    }
    return new Date(dateStr);
  };

  const contractEndDate = contract.end_date ? parseLocalMidnight(contract.end_date) : null;
  const todayLocalDate = new Date();
  todayLocalDate.setHours(0, 0, 0, 0);

  const daysLeft = contractEndDate
    ? differenceInDays(contractEndDate, todayLocalDate)
    : null;

  const isNearingDeadline = daysLeft !== null && daysLeft <= 3;

  const mappedTeamMembers: TeamMemberItem[] = (contract.teams || []).map(
    (member) => {
      const roleName = member.roles.map(getRoleLabel).join(", ") || "Staff";
      return {
        name: member.full_name,
        role: roleName,
        initials: getInitials(member.full_name),
        avatarBg: getAvatarBg(member.full_name),
        statusDotColor: member.is_online ? "bg-emerald-500" : "bg-gray-300",
      };
    },
  );

  const handleAssignMembersSave = (selectedMembers: TeamMemberItem[]) => {
    const selectedUserIds = selectedMembers
      .map((m) => {
        const u = allUsers.find((user) => user.full_name === m.name);
        return u ? u.id : null;
      })
      .filter(Boolean) as number[];

    assignMutation.mutate({
      id: contractId,
      payload: { team_user_ids: selectedUserIds },
    });
    setIsAssignMembersOpen(false);
  };

  const countContentStatus = (status: string) =>
    contractContents.filter((c) => c.status === status).length;

  const productionProgressItems = [
    {
      label: "Draft",
      value: countContentStatus("draft"),
      dotColor: "bg-slate-500",
      textColor: "text-slate-500",
    },
    {
      label: "Assigned",
      value: countContentStatus("assigned"),
      dotColor: "bg-blue-600",
      textColor: "text-blue-600",
    },
    {
      label: "On Progress",
      value: countContentStatus("on_progress"),
      dotColor: "bg-amber-600",
      textColor: "text-amber-600",
    },
    {
      label: "Review",
      value: countContentStatus("review"),
      dotColor: "bg-purple-600",
      textColor: "text-purple-600",
    },
    {
      label: "Revision",
      value: countContentStatus("revision"),
      dotColor: "bg-red-600",
      textColor: "text-red-600",
    },
    {
      label: "Approved",
      value: countContentStatus("approved"),
      dotColor: "bg-emerald-600",
      textColor: "text-emerald-600",
    },
  ];

  const dynamicPlansDataCards = [
    {
      title: "Draft",
      value: String(countContentStatus("draft")),
      description: "Draft Konten",
      icon: FileText,
      iconColor: "text-gray-500",
      iconBgColor: "bg-gray-500/10",
    },
    {
      title: "Assigned",
      value: String(countContentStatus("assigned")),
      description: "Konten Ditugaskan",
      icon: FileText,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-600/10",
    },
    {
      title: "On Progress",
      value: String(countContentStatus("on_progress")),
      description: "Sedang Diproduksi",
      icon: FileText,
      iconColor: "text-amber-600",
      iconBgColor: "bg-amber-600/10",
    },
    {
      title: "Published",
      value: String(countContentStatus("published")),
      description: "Telah Diterbitkan",
      icon: FileText,
      iconColor: "text-cyan-600",
      iconBgColor: "bg-cyan-600/10",
    },
    {
      title: "Days Left",
      value: daysLeft !== null ? (daysLeft < 0 ? "Overdue" : `${daysLeft} Hari`) : "-",
      description: daysLeft !== null ? (daysLeft < 0 ? `${Math.abs(daysLeft)} hari terlambat` : `${daysLeft} hari tersisa`) : "Tanpa batas waktu",
      icon: Calendar,
      iconColor: isNearingDeadline ? "text-red-600" : "text-emerald-600",
      iconBgColor: isNearingDeadline ? "bg-red-600/10" : "bg-emerald-600/10",
      valueColor: isNearingDeadline ? "text-red-600 font-bold" : undefined,
    },
  ];

  const contractInfoItems = [
    { label: "Client", value: contract.client_name || "" },
    { label: "Code", value: contract.contract_code },
    { label: "Start Date", value: formatDate(contract.start_date) },
    { label: "End Date", value: formatDate(contract.end_date) },
    {
      label: "Platforms",
      value: contract.platforms.map((p) => p.platform_name).join(", "),
    },
    { label: "Email", value: client?.contact_email ?? "-" },
    { label: "Phone", value: client?.contact_phone ?? "-" },
  ];

  return (
    <div className="space-y-4">
      <div className="w-full">
        {/* Header Container */}
        <div className="w-full p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Side: Back Button & Title/Subtext */}
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate("/contracts")}
              className="rounded-xl h-10 px-4 gap-2 text-gray-700 hover:text-red-logo cursor-pointer shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex flex-col gap-1">
              <div className="flex items-center flex-wrap gap-2.5">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  {contract.contract_name}
                </h1>
                <PillarsContract
                  status={displayStatus}
                  className="rounded-full px-3 shadow-none border-none py-0.5 text-xs font-semibold"
                />
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium flex flex-wrap items-center gap-x-1.5 gap-y-1 line-clamp-2">
                <span>{contract.description}</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <span>{contract.contract_code}</span>
                <span className="text-gray-300">•</span>
                <span>{contract.created_by_name || "-"}</span>
                <span className="text-gray-300">•</span>
                <span
                  className={`inline-flex items-center gap-1 ${isOverdue ? "text-red-600 font-semibold animate-pulse" : ""}`}
                >
                  <Calendar
                    className={`h-3.5 w-3.5 shrink-0 ${isOverdue ? "text-red-600" : "text-gray-500"}`}
                  />
                  {formatDate(contract.end_date)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {isOwner && (
              <Button
                variant="outline"
                onClick={() => openFeedbackModalRef.current?.()}
                className="rounded-xl h-10 px-4 gap-2 border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                Feedback
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setIsAssignMembersOpen(true)}
              className="rounded-xl h-10 px-4 gap-2 border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer"
            >
              <Users className="h-4 w-4" />
              Assign Team
            </Button>
            {!isClient && (
              <Button
                onClick={() => openContentModalRef.current?.()}
                className="bg-red-800 hover:bg-red-900 text-white rounded-xl h-10 px-4 gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="h-4 w-4" />
                New Content Plan
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {dynamicPlansDataCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ContractInfo items={contractInfoItems} />
        <TeamsMember members={mappedTeamMembers} />
        <ProductionProgress
          title="Production Progress"
          current={completedContents}
          target={totalContents || 1}
          items={productionProgressItems}
        />
        <RevisionContract
          items={contractContents
            .filter((c) => c.status === "revision")
            .map((c) => ({
              id: String(c.id),
              title: c.title,
              platform: c.platform_name,
              dueDate: formatDate(c.due_date),
            }))}
        />
      </div>

      <div className="w-full">
        <ContentPlan
          contractId={contractId}
          onRegisterOpenModal={handleRegisterOpenModal}
          onRegisterFeedbackModal={handleRegisterFeedbackModal}
        />
      </div>

      {/* Assign Members Modal */}
      <AssignMembers
        key={
          isAssignMembersOpen ? "assign-members-open" : "assign-members-closed"
        }
        isOpen={isAssignMembersOpen}
        onClose={() => setIsAssignMembersOpen(false)}
        currentMembers={mappedTeamMembers}
        onSave={handleAssignMembersSave}
      />
    </div>
  );
}
