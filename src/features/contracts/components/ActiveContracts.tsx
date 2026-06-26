import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlatformBadge } from "@/features/pillars/components/PlatformBadge";

export interface ContractItem {
  id: string | number;
  code: string;
  title: string;
  brand: string;
  platforms: string[];
  currentProgress: number;
  targetProgress: number;
  date: string;
  statusText?: string;
}

interface ActiveContractsProps {
  contracts: ContractItem[];
  title?: string;
  onViewAll?: () => void;
}

export function ActiveContracts({
  contracts,
  title = "Active Contracts",
  onViewAll,
}: ActiveContractsProps) {
  const navigate = useNavigate();
  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg p-6 space-y-5">
      <CardHeader className="flex flex-row items-center justify-between p-0 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        <Link
          to="/contracts"
          onClick={onViewAll}
          className="text-sm font-bold text-red-800 hover:text-red-900 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        {contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No active contracts
            </h3>
            <p className="text-sm text-gray-400 text-center max-w-xs">
              You don't have any active contracts yet. New contracts will appear
              here once they are created.
            </p>
          </div>
        ) : (
          <div className="flex items-stretch gap-4 overflow-x-auto pb-2 pt-1 select-none scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden">
            {contracts.map((contract) => {
              const progressPercentage = contract.targetProgress > 0
                ? (contract.currentProgress / contract.targetProgress) * 100
                : 0;

              return (
                <Card
                  key={contract.id}
                  onClick={() => navigate(`/contracts/${contract.id}`)}
                  className="min-w-90 sm:min-w-98 max-w-md shrink-0 bg-white border border-gray-300 rounded-xl p-5 space-y-3.5 shadow-xs hover:border-red-logo hover:bg-red-50/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-400">{contract.code}</span>
                    <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 font-bold px-2.5 py-0.5 rounded-lg border-none shadow-none flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-snug truncate">
                      {contract.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium truncate">
                      {contract.brand}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {contract.platforms.map((platform, idx) => (
                      <PlatformBadge
                        key={idx}
                        platform={platform}
                        showDot={false}
                        className="text-xs font-semibold"
                      />
                    ))}
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-xs md:text-sm font-bold">
                      <span className="text-sm text-gray-400 font-medium">
                        Progress
                      </span>
                      <span className="text-sm text-gray-900">
                        {contract.currentProgress}/{contract.targetProgress}
                      </span>
                    </div>
                    <Progress
                      value={progressPercentage === 0 ? 100 : progressPercentage}
                      className={`h-1.5 bg-gray-100 ${
                        progressPercentage === 0
                          ? "[&>div]:bg-gray-300"
                          : "[&>div]:bg-red-800"
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs md:text-sm font-bold pt-1">
                    <span className="text-sm text-gray-400 font-medium">
                      {contract.date}
                    </span>
                    {contract.statusText && (
                      <span className="text-sm text-red-600 font-bold tracking-tight">
                        {contract.statusText}
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
