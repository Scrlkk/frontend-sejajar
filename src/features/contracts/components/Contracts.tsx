import { useState } from "react";
import { Search, Calendar, ChevronRight, MoveRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface ContractCardItem {
  id: string | number;
  code: string;
  title: string;
  brand: string;
  description: string;
  platforms: string[];
  currentProgress: number;
  targetProgress: number;
  startDate: string;
  endDate: string;
  valueAmount: string;
  status: "Completed" | "Active" | "Overdue" | string;
  statusBg: string;
  statusDot: string;
  year?: number;
}

interface ContractsProps {
  contracts: ContractCardItem[];
  onCardClick?: (item: ContractCardItem) => void;
}

export function Contracts({ contracts, onCardClick }: ContractsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredContracts = contracts.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "active")
      return matchesSearch && item.status === "Active";
    if (activeTab === "completed")
      return matchesSearch && item.status === "Completed";
    if (activeTab === "overdue")
      return matchesSearch && item.status === "Overdue";

    return matchesSearch;
  });

  const countStatus = (statusName: string) =>
    contracts.filter((c) => c.status === statusName).length;

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-gray-100">
        <div className="relative w-full md:w-90">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800/60 transition-colors"
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-gray-100/80 p-1 rounded-xl h-10 gap-1 w-full md:w-auto justify-start overflow-x-auto">
            <TabsTrigger
              value="all"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              All ({contracts.length})
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Active ({countStatus("Active")})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Completed ({countStatus("Completed")})
            </TabsTrigger>
            <TabsTrigger
              value="overdue"
              className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Overdue ({countStatus("Overdue")})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredContracts.length > 0 ? (
          filteredContracts.map((item) => {
            const progressPercentage =
              (item.currentProgress / item.targetProgress) * 100;

            return (
              <Card
                key={item.id}
                onClick={() => onCardClick?.(item)}
                className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-6 space-y-3 relative hover:border-red-logo hover:bg-red-50/20 transition-all cursor-pointer group"
              >
                <ChevronRight className="absolute right-5 top-6 h-4 w-4 text-gray-300 group-hover:text-red-logo transition-colors" />

                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="text-gray-400 py-0.5">{item.code}</span>
                  <Badge
                    className={`${item.statusBg} rounded-lg font-bold px-2.5 py-0.5 border-none shadow-none flex items-center gap-1.5`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${item.statusDot}`}
                    />
                    {item.status}
                  </Badge>
                </div>

                <div className="space-y-0.5">
                  <h3 className="font-semibold text-gray-900 text-lg md:text-xl leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">
                    {item.brand}
                  </p>
                </div>

                <p className="text-sm text-gray-400 font-normal leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  {item.platforms.map((platform, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-gray-100 text-gray-500 font-medium rounded-lg px-2.5 py-0.5 text-xs shadow-none"
                    >
                      {platform}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs md:text-sm font-bold">
                    <span className="text-gray-500/90 font-medium">
                      Content Progress
                    </span>
                    <span className="text-gray-900">
                      {item.currentProgress}/{item.targetProgress} items
                    </span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    className="h-1.5 bg-gray-100 [&>div]:bg-red-800"
                  />

                  <div className="flex items-center justify-between text-xs font-semibold pt-0.5">
                    <span className="text-gray-400/80 font-semibold">
                      {Math.round(progressPercentage)}% Complete
                    </span>
                    {item.status === "Overdue" && (
                      <span className="text-red-600 tracking-tight">
                        Overdue
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-gray-50 text-xs md:text-sm font-semibold text-gray-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{item.startDate}</span>
                    <span className="text-gray-400">
                      <MoveRight className="h-4 w-4 text-gray-400" />
                    </span>
                    <span>{item.endDate}</span>
                  </div>
                  <span className="text-gray-900 font-bold">
                    {item.valueAmount}
                  </span>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100 shadow-xs">
            No contracts found matching the selected filters.
          </div>
        )}
      </div>
    </Card>
  );
}
