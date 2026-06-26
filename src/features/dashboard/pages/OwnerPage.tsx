import { PlatformEngagement, type PlatformInfo } from "@/features/analytics/components/PlatformEngagement";
import { getTopContentsApi, type TopContent } from "@/features/analytics/api/analyticsApi";
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
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { RevisionBanner } from "@/features/reviews/components/RevisionBanner";
import {
  SystemLog,
  type ActivityLogItem,
} from "@/features/audit/components/SystemLog";
import { useQuery } from "@tanstack/react-query";
import {
  getDashboardChartsApi,
  getDashboardSummaryApi,
} from "@/features/dashboard/api/dashboardApi";
import { OWNER_CARDS_TEMPLATE } from "@/features/dashboard/constants/cardConfig";
import { formatCompactIDR, formatDate } from "@/utils/helpers";
import {
  getInitialsAndBg,
  getInitials,
  getAvatarBg,
  getActionBg,
  formatActionDescription,
} from "@/utils/formatter";
import { getActivityLogsApi } from "@/features/audit/api/activityLogsApi";
import {
  getContractsApi,
  getContentsForProgressApi,
  mapContractToCardItem,
} from "@/features/contracts/api/contractsApi";
import { getUsersApi } from "@/features/users/api/usersApi";
import { ROLE_LABELS } from "@/features/users/constants/roleColors";

interface Milestone {
  date: string;
  label: string;
}

interface EngagementByPlatformChartResponse {
  metric: string;
  chartMetric: string;
  granularity: string;
  from: string;
  to: string;
  platforms: PlatformInfo[];
  series: Record<string, string | number>[];
  milestones?: Milestone[];
}

interface OwnerSummary {
  contracts: {
    active: number;
    total_revenue: number;
    by_status: {
      active: number;
      completed: number;
      overdue: number;
    };
  };
  users: {
    total: number;
  };
  contents: {
    published: number;
  };
  clients: {
    total: number;
  };
}

interface UserTaskStats {
  id: number;
  full_name: string;
  tasks: Record<string, number>;
  total: number;
}

interface UsersByTasksResponse {
  metric: string;
  users: UserTaskStats[];
}

export const OwnerPage = () => {
  const navigate = useNavigate();

  // Fetch dashboard summary
  const { data: summaryData } = useQuery<OwnerSummary>({
    queryKey: ["ownerDashboardSummary"],
    queryFn: () => getDashboardSummaryApi<OwnerSummary>(),
  });

  // Fetch contracts
  const { data: contractsList = [] } = useQuery({
    queryKey: ["contracts"],
    queryFn: () => getContractsApi(),
  });

  const overdueContracts = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return contractsList.filter((c) => {
      if (c.status === "overdue") return true;
      if (c.status === "completed" || c.status === "cancelled") return false;
      if (!c.end_date) return false;

      const endDate = new Date(c.end_date);
      endDate.setHours(0, 0, 0, 0);
      return endDate.getTime() < today.getTime();
    });
  }, [contractsList]);

  // Fetch content progress
  const { data: contentsProgress = [] } = useQuery({
    queryKey: ["contentsProgress"],
    queryFn: () => getContentsForProgressApi(),
  });

  // Fetch activity logs
  const { data: rawLogs = [] } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: () => getActivityLogsApi({ limit: 100 }),
  });

  const logs = useMemo<ActivityLogItem[]>(() => {
    return rawLogs.map((log) => {
      const initials = getInitials(log.user_name || "System");
      const avatarBg = getAvatarBg(log.user_name || "System");
      const actionBg = getActionBg(log.action);
      const description = formatActionDescription(
        log.action,
        log.table_name,
        log.record_id,
        log.old_values,
        log.new_values,
        log.entity_name,
      );
      const date = formatDate(log.created_at);

      return {
        id: log.id,
        name: log.user_name || "System",
        initials,
        avatarBg,
        actionType: log.action,
        actionBg,
        description,
        date,
      };
    });
  }, [rawLogs]);

  // Fetch all users to resolve employee roles
  const { data: apiUsers = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsersApi(),
  });

  // Fetch employee tasks counts
  const { data: usersByTasksChart } = useQuery<UsersByTasksResponse>({
    queryKey: ["dashboard-charts", "users_by_tasks"],
    queryFn: () =>
      getDashboardChartsApi<UsersByTasksResponse>({
        metric: "users_by_tasks",
      }),
  });

  // Map users list to id->role mapping
  const userRoleMap = useMemo(() => {
    const map = new Map<number, string>();
    apiUsers.forEach((u) => {
      map.set(u.id, u.role);
    });
    return map;
  }, [apiUsers]);

  // Compute mapped contract card items with year attribute
  const mappedContracts = useMemo(() => {
    return contractsList.map((c) => {
      const contractContents = contentsProgress.filter(
        (cp) => cp.contract_id === c.id,
      );
      const totalProgress = contractContents.length;
      const currentProgress = contractContents.filter(
        (cp) => cp.status === "published" || cp.status === "approved",
      ).length;
      const mapped = mapContractToCardItem(c, totalProgress, currentProgress);
      const year = c.start_date
        ? new Date(c.start_date).getFullYear()
        : new Date().getFullYear();
      return { ...mapped, year };
    });
  }, [contractsList, contentsProgress]);

  // Calculate available years dynamically from contracts
  const availableYears = useMemo(() => {
    if (mappedContracts.length === 0) {
      return [new Date().getFullYear()];
    }
    const years = [
      ...new Set(
        mappedContracts
          .map((c) => c.year)
          .filter((y): y is number => y !== undefined),
      ),
    ].sort((a, b) => b - a);
    return years;
  }, [mappedContracts]);

  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);

  const activeYear = availableYears.includes(selectedYear)
    ? selectedYear
    : availableYears[0];

  const filteredContractsData = useMemo(
    () => mappedContracts.filter((d) => d.year === activeYear),
    [mappedContracts, activeYear],
  );

  // Map employee performance data from users_by_tasks chart
  const filteredEmployeeData = useMemo(() => {
    if (!usersByTasksChart?.users) return [];
    return usersByTasksChart.users.map((item) => {
      const name = item.full_name;
      const { initials, avatarBg } = getInitialsAndBg(name);
      const rawRole = userRoleMap.get(item.id) || "content_editor";
      const displayRole = ROLE_LABELS[rawRole] || rawRole;
      const approvedCount = item.tasks?.approved || 0;
      const total = item.total || 0;
      const completionRate =
        total > 0 ? Math.round((approvedCount / total) * 100) : 0;
      return {
        id: item.id,
        name,
        role: displayRole,
        initials,
        tasksCount: total,
        completionRate,
        avatarBg,
        month: "Jun",
        year: activeYear,
      };
    });
  }, [usersByTasksChart, userRoleMap, activeYear]);

  const [activeMetric, setActiveMetric] = useState<"views" | "likes" | "comments" | "shares">("views");
  const [activeGranularity, setActiveGranularity] = useState<"daily" | "weekly" | "monthly">("daily");

  // Fetch per-platform engagement for the trend chart
  const { data: platformEngagementChart } = useQuery<EngagementByPlatformChartResponse>({
    queryKey: ["dashboard-charts", "engagement_by_platform", activeYear, activeMetric, activeGranularity],
    queryFn: () =>
      getDashboardChartsApi<EngagementByPlatformChartResponse>({
        metric: "engagement_by_platform",
        from: `${activeYear}-01-01`,
        to: `${activeYear}-12-31`,
        chartMetric: activeMetric,
        granularity: activeGranularity,
      }),
  });

  // Fetch top performing contents
  const { data: topContents = [] } = useQuery<TopContent[]>({
    queryKey: ["top-contents"],
    queryFn: () => getTopContentsApi({ limit: 10 }),
  });

  const mappedPlatformData = useMemo(() => {
    const platformList = platformEngagementChart?.platforms ?? [];
    const series = platformEngagementChart?.series ?? [];
    return {
      platforms: platformList,
      data: series.map((s) => {
        const d = new Date(String(s.date));
        const name = d.toLocaleDateString("id-ID", {
          month: "short",
          day: "numeric",
        });
        return { ...s, name };
      }),
    };
  }, [platformEngagementChart]);

  const cards = OWNER_CARDS_TEMPLATE.map((tpl) => {
    let value: string | number = "0";
    if (summaryData) {
      if (tpl.key === "active_contracts") {
        value = summaryData.contracts?.active ?? 0;
      } else if (tpl.key === "total_employee") {
        value = summaryData.users?.total ?? 0;
      } else if (tpl.key === "content_published") {
        value = summaryData.contents?.published ?? 0;
      } else if (tpl.key === "revenue") {
        value = formatCompactIDR(summaryData.contracts?.total_revenue ?? 0);
      }
    }
    return {
      title: tpl.title,
      value,
      description: tpl.description,
      icon: tpl.icon,
      iconColor: tpl.iconColor,
      iconBgColor: tpl.iconBgColor,
    };
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>

      {overdueContracts.length > 0 && (
        <div className="space-y-3">
          {overdueContracts.map((contract) => (
            <RevisionBanner
              key={contract.id}
              title={`Kontrak Overdue: ${contract.contract_name}`}
              description={`Kontrak "${contract.contract_name}" (${contract.contract_code}) telah melewati tanggal berakhir (${formatDate(contract.end_date)}).`}
              buttonText="Lihat Kontrak"
              buttonIcon={<ArrowRight className="h-4 w-4" />}
              onReUpload={() => navigate(`/contracts/${contract.id}`)}
            />
          ))}
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto">
        <PlatformEngagement
          data={mappedPlatformData.data}
          platforms={mappedPlatformData.platforms}
          activeMetric={activeMetric}
          activeGranularity={activeGranularity}
          onMetricChange={setActiveMetric}
          onGranularityChange={setActiveGranularity}
          topContents={topContents}
          headerAction={
            <Select
              value={String(activeYear)}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContractPerformance
          title="Contract Performance"
          data={filteredContractsData}
          headerAction={
            <Select
              value={String(activeYear)}
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
              value={String(activeYear)}
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
      <SystemLog logs={logs} />
    </div>
  );
};
