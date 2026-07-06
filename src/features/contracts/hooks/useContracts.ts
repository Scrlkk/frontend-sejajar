import { useQuery } from "@tanstack/react-query";
import { getContractsApi } from "@/features/contracts/api/contractsApi";
import { contractKeys } from "@/features/contracts/api/contractKeys";

export const useContractsList = (status: "active" | "deleted", limit = 100) => {
  return useQuery({
    queryKey: contractKeys.list(status),
    queryFn: () => getContractsApi({ status: status === "deleted" ? "deleted" : undefined, limit }),
  });
};
