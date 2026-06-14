import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import {
  contractDataCards,
  sampleContractsData,
} from "@/features/contracts/data/contractsData";
import {
  Contracts,
  type ContractCardItem,
} from "@/features/contracts/components/Contracts";

export const ContractPage = () => {
  const handleCardClick = (item: ContractCardItem) => {
    console.log("Detail kontrak dibuka untuk:", item.code);
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contractDataCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div>
        <Contracts
          contracts={sampleContractsData}
          onCardClick={handleCardClick}
        />
      </div>
    </div>
  );
};
