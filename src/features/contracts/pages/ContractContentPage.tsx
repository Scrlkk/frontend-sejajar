import { useRef, useCallback, useState } from "react";
import { ArrowLeft, Users, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import {
  plansDataCards,
  sampleProductionProgress,
  sampleTeamMembers,
  sampleContentPlans,
  sampleContractsData,
} from "@/features/contracts/data/contractsData";
import { ContractInfo } from "@/features/contracts/components/ContractInfo";
import { sampleClients } from "@/features/clients/data/clientsData";
import { ProductionProgress } from "@/features/contracts/components/ProductionProgress";
import { TeamsMember } from "@/features/contracts/components/TeamsMember";
import { ContentPlan } from "@/features/contents/components/ContentPlan";
import { RevisionContract } from "@/features/reviews/components/RevisionContract";
import { AssignMembers } from "@/features/contents/components/AssignMembers";

export function ContractContentPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [teamMembers, setTeamMembers] = useState(sampleTeamMembers);
  const [isAssignMembersOpen, setIsAssignMembersOpen] = useState(false);

  const handleAssignMembersSave = (
    selectedMembers: typeof sampleTeamMembers,
  ) => {
    setTeamMembers(selectedMembers);
    setIsAssignMembersOpen(false);
  };

  const contractId = Number(id) || 1;
  const contract =
    sampleContractsData.find((c) => c.id === contractId) ||
    sampleContractsData[0];
  const activeContentPlans = sampleContentPlans.filter(
    (plan) => plan.contractId === contractId,
  );

  const openContentModalRef = useRef<(() => void) | null>(null);
  const handleRegisterOpenModal = useCallback((fn: () => void) => {
    openContentModalRef.current = fn;
  }, []);

  const openFeedbackModalRef = useRef<(() => void) | null>(null);
  const handleRegisterFeedbackModal = useCallback((fn: () => void) => {
    openFeedbackModalRef.current = fn;
  }, []);

  const client = sampleClients.find(
    (c) => c.company_name.toLowerCase() === contract.brand.toLowerCase()
  );

  const contractInfoItems = [
    { label: "Client", value: contract.brand },
    { label: "Code", value: contract.code },
    { label: "Start Date", value: contract.startDate },
    { label: "End Date", value: contract.endDate },
    { label: "Platforms", value: contract.platforms.join(", ") },
    { label: "Contact Email", value: client?.contact_email ?? "-" },
    { label: "Contact Phone", value: client?.contact_phone ?? "-" },
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
                  {contract.title}
                </h1>
                <Badge
                  variant="secondary"
                  className={`${contract.statusBg} shadow-none rounded-full px-3 py-0.5 text-xs font-semibold flex items-center gap-1.5 border-none`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${contract.statusDot} shrink-0`}
                  />
                  {contract.status}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                {contract.code} <span className="text-gray-300 mx-1">•</span>{" "}
                {contract.brand} <span className="text-gray-300 mx-1">•</span>{" "}
                {contract.startDate} – {contract.endDate}
              </p>
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <Button
              variant="outline"
              onClick={() => openFeedbackModalRef.current?.()}
              className="rounded-xl h-10 px-4 gap-2 border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              Feedback
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsAssignMembersOpen(true)}
              className="rounded-xl h-10 px-4 gap-2 border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer"
            >
              <Users className="h-4 w-4" />
              Assign Team
            </Button>
            <Button
              onClick={() => openContentModalRef.current?.()}
              className="bg-red-800 hover:bg-red-900 text-white rounded-xl h-10 px-4 gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="h-4 w-4" />
              New Content Plan
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {plansDataCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ContractInfo items={contractInfoItems} />
        <ProductionProgress
          {...sampleProductionProgress}
          current={contract.currentProgress}
          target={contract.targetProgress}
        />
        <TeamsMember members={teamMembers} />
        <RevisionContract
          items={activeContentPlans
            .filter((plan) => plan.status === "Revision")
            .map((plan) => ({
              id: plan.id,
              title: plan.title,
              platform: plan.platform,
              dueDate: plan.dueDate,
            }))}
        />
      </div>

      <div className="w-full">
        <ContentPlan
          initialCards={activeContentPlans}
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
        currentMembers={teamMembers}
        onSave={handleAssignMembersSave}
      />
    </div>
  );
}
