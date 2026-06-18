import {
  trendData,
  sampleContractsData,
  activityLogs,
  ownerCards,
  employeePerformanceData,
} from "@/data/mockData";
import { PlatformEngagement } from "@/features/analytics/components/PlatformEngagement";
import { ContractPerformance } from "@/features/contracts/components/ContractPerformance";
import { EmployeePerformance } from "@/features/contracts/components/EmployeePerformance";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { SystemLog } from "@/features/audit/components/SystemLog";

export const OwnerPage = () => {
  const availableYears = useMemo(() => {
    const years = [
      ...new Set(
        sampleContractsData
          .map((d) => d.year)
          .filter((y): y is number => y !== undefined),
      ),
    ].sort((a, b) => b - a);
    return years;
  }, []);

  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);

  const filteredContractsData = useMemo(
    () => sampleContractsData.filter((d) => d.year === selectedYear),
    [selectedYear],
  );

  const filteredEmployeeData = useMemo(
    () => employeePerformanceData.filter((d) => d.year === selectedYear),
    [selectedYear],
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ownerCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <PlatformEngagement data={trendData} timeframe="Last 6 weeks" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContractPerformance
          title="Contract Performance"
          data={filteredContractsData}
          headerAction={
            <Select
              value={String(selectedYear)}
              onValueChange={(v) => setSelectedYear(Number(v))}
            >
              <SelectTrigger className="w-28 h-8 text-sm font-medium border-gray-200 bg-gray-50 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />

        <EmployeePerformance
          title="Employee Performance"
          data={filteredEmployeeData}
          headerAction={
            <Select
              value={String(selectedYear)}
              onValueChange={(v) => setSelectedYear(Number(v))}
            >
              <SelectTrigger className="w-28 h-8 text-sm font-medium border-gray-200 bg-gray-50 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      </div>
      <SystemLog logs={activityLogs} />
    </div>
  );
};
