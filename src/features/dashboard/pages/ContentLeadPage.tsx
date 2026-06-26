import { ActiveContracts } from "@/features/contracts/components/ActiveContracts";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { GraphicDonutHorizontal } from "@/features/dashboard/components/GraphicDonutHorizontal";
import { ContentOutput } from "@/features/contents/components/ContentOutput";
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
import { Feedback } from "@/features/reviews/components/Feedback";
import { RecentComments } from "@/features/reviews/components/RecentComments";
import { useQuery } from "@tanstack/react-query";
import {
  getDashboardWidgetApi,
  getDashboardSummaryApi,
  getDashboardChartsApi,
} from "@/features/dashboard/api/dashboardApi";
import { getUsersApi, type User } from "@/features/users/api/usersApi";
import { getInitials, getAvatarBg, getRoleBg } from "@/utils/formatter";
import { formatDate } from "@/utils/helpers";
import { getRoleLabel } from "@/features/users/constants/roleColors";
import { CONTENT_LEAD_CARDS_TEMPLATE } from "@/features/dashboard/constants/cardConfig";
import { getContractsApi, getContentsForProgressApi } from "@/features/contracts/api/contractsApi";
import { getPillarColor } from "@/features/contents/constants/pillarColors";

interface ReviewWidgetData {
  id: number;
  content_id: number;
  contract_id?: number;
  content_title: string;
  reviewer_id: number;
  reviewer_name: string;
  feedback_preview: string;
  reviewed_at: string;
  created_at: string;
}

interface CommentWidgetData {
  id: number;
  task_id: number;
  task_title: string;
  user_id: number;
  user_name: string;
  message: string;
  created_at: string;
  assigned_to_name?: string;
}

interface ContentLeadSummary {
  contracts: {
    active: number;
  };
  contents: {
    total: number;
    on_progress: number;
    published: number;
  };
}

interface ContentOutputChartResponse {
  metric: string;
  from: string;
  to: string;
  series: Array<{
    date: string;
    statuses: Record<string, number>;
    total: number;
  }>;
}

interface PillarUsage {
  id: number;
  pillar_name: string;
  count: number;
  percent: number;
}

interface PillarsUsageChartResponse {
  metric: string;
  total_contents: number;
  pillars: PillarUsage[];
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const ContentLeadPage = () => {
  const navigate = useNavigate();

  const handleViewAll = () =>
    navigate("/contracts");

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

  // Calculate available years dynamically from contracts
  const availableYears = useMemo(() => {
    if (contractsList.length === 0) {
      return [new Date().getFullYear()];
    }
    const years = [
      ...new Set(
        contractsList
          .map((c) => c.start_date ? new Date(c.start_date).getFullYear() : undefined)
          .filter((y): y is number => y !== undefined)
      ),
    ].sort((a, b) => b - a);
    return years;
  }, [contractsList]);

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const activeYear = availableYears.includes(selectedYear) ? selectedYear : availableYears[0];

  // Fetch dashboard summary
  const { data: summaryData } = useQuery<ContentLeadSummary>({
    queryKey: ["contentLeadSummary"],
    queryFn: () => getDashboardSummaryApi<ContentLeadSummary>(),
  });

  // Fetch content progress
  const { data: contentsProgress = [] } = useQuery({
    queryKey: ["contentsProgress"],
    queryFn: () => getContentsForProgressApi(),
  });

  // Fetch content output date chart
  const { data: outputChartData } = useQuery<ContentOutputChartResponse>({
    queryKey: ["dashboard-charts", "content_by_status_date", activeYear],
    queryFn: () =>
      getDashboardChartsApi<ContentOutputChartResponse>({
        metric: "content_by_status_date",
        from: `${activeYear}-01-01`,
        to: `${activeYear}-12-31`,
      }),
  });

  // Fetch pillars usage chart
  const { data: pillarsUsageChart } = useQuery<PillarsUsageChartResponse>({
    queryKey: ["dashboard-charts", "pillars_usage"],
    queryFn: () => getDashboardChartsApi<PillarsUsageChartResponse>({ metric: "pillars_usage" }),
  });

  // Fetch users to resolve role details for comments
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getUsersApi(),
  });

  // Fetch reviews list widget
  const { data: reviewsWidget = { reviews: [], total: 0 } } = useQuery<{ reviews: ReviewWidgetData[]; total: number }>({
    queryKey: ["dashboard-widget", "reviews-list"],
    queryFn: () => getDashboardWidgetApi<{ reviews: ReviewWidgetData[]; total: number }>("reviews-list"),
  });

  // Fetch recent comments widget
  const { data: commentsWidget = { comments: [] } } = useQuery<{ comments: CommentWidgetData[] }>({
    queryKey: ["dashboard-widget", "recent-comments"],
    queryFn: () => getDashboardWidgetApi<{ comments: CommentWidgetData[] }>("recent-comments"),
  });

  // Map metric cards from summaryData
  const cards = CONTENT_LEAD_CARDS_TEMPLATE.map((tpl) => {
    let value: string | number = "0";
    if (summaryData) {
      if (tpl.key === "active_contracts") {
        value = summaryData.contracts?.active ?? 0;
      } else if (tpl.key === "total_content") {
        value = summaryData.contents?.total ?? 0;
      } else if (tpl.key === "in_production") {
        value = summaryData.contents?.on_progress ?? 0;
      } else if (tpl.key === "published") {
        value = summaryData.contents?.published ?? 0;
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

  // Map active contracts slider
  const activeContractsData = useMemo(() => {
    return contractsList
      .filter((c) => c.status === "active")
      .map((c) => {
        const contractContents = contentsProgress.filter((cp) => cp.contract_id === c.id);
        const totalProgress = contractContents.length;
        const currentProgress = contractContents.filter(
          (cp) => cp.status === "published" || cp.status === "approved"
        ).length;
        const isOverdue =
          c.end_date && new Date(c.end_date) < new Date() && (totalProgress === 0 || currentProgress < totalProgress);

        return {
          id: c.id,
          code: c.contract_code,
          title: c.contract_name,
          brand: c.client_name || "",
          platforms: c.platforms.map((p) => p.platform_name),
          currentProgress,
          targetProgress: totalProgress,
          date: formatDate(c.end_date),
          statusText: isOverdue ? "Overdue" : undefined,
        };
      });
  }, [contractsList, contentsProgress]);

  // Aggregate daily dates to monthly buckets for ContentOutput component
  const filteredOutputData = useMemo(() => {
    const buckets: Record<number, { Published: number; Scheduled: number; Draft: number }> = {};
    for (let m = 0; m < 12; m++) {
      buckets[m] = { Published: 0, Scheduled: 0, Draft: 0 };
    }

    const series = outputChartData?.series || [];
    series.forEach((s: { date: string; statuses: Record<string, number> }) => {
      const d = new Date(s.date);
      if (d.getFullYear() === activeYear) {
        const monthIndex = d.getMonth();
        const Published = (s.statuses?.published || 0) + (s.statuses?.approved || 0);
        const Scheduled = s.statuses?.scheduled || 0;
        const Draft = s.statuses?.draft || 0;

        buckets[monthIndex].Published += Published;
        buckets[monthIndex].Scheduled += Scheduled;
        buckets[monthIndex].Draft += Draft;
      }
    });

    const now = new Date();
    const currentYearVal = now.getFullYear();
    const currentMonthVal = now.getMonth();

    return Object.entries(buckets)
      .filter(([mIdx]) => {
        if (activeYear === currentYearVal) {
          return Number(mIdx) <= currentMonthVal;
        }
        return true;
      })
      .map(([mIdx, counts]) => ({
        month: MONTH_NAMES[Number(mIdx)],
        year: activeYear,
        Published: counts.Published,
        Scheduled: counts.Scheduled,
        Draft: counts.Draft,
      }));
  }, [outputChartData, activeYear]);

  // Map content pillar usage data
  const mappedPillarsData = useMemo(() => {
    const pillars = pillarsUsageChart?.pillars || [];
    return pillars.map((item: PillarUsage, idx: number) => {
      const colorHex = getPillarColor(idx);
      return {
        name: item.pillar_name,
        value: item.count,
        color: `bg-[${colorHex}]`,
        fill: colorHex,
      };
    });
  }, [pillarsUsageChart]);

  const mappedFeedbacks = useMemo(() => {
    return (reviewsWidget.reviews || []).map((review: ReviewWidgetData) => ({
      id: review.id,
      subject: review.content_title || "",
      message: review.feedback_preview || "",
      date: formatDate(review.created_at),
      contractId: review.contract_id,
    }));
  }, [reviewsWidget.reviews]);

  const mappedComments = useMemo(() => {
    return (commentsWidget.comments || []).map((comment: CommentWidgetData) => {
      const isSystem = !comment.user_id;
      const user = isSystem ? null : users.find((u: User) => u.id === comment.user_id);
      const primaryRole = user?.role || "content_editor";
      return {
        id: comment.id,
        name: comment.user_name || "System",
        initials: getInitials(comment.user_name || "System"),
        avatarBg: getAvatarBg(comment.user_name || "System"),
        role: isSystem ? "Bot" : getRoleLabel(primaryRole),
        roleBg: isSystem ? "bg-slate-100 text-slate-600 border border-slate-200" : getRoleBg(primaryRole),
        targetContent: comment.task_title || "",
        commentText: comment.message || "",
        date: formatDate(comment.created_at),
        isSystem,
      };
    });
  }, [commentsWidget.comments, users]);

  return (
    <div className="space-y-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <ActiveContracts
          contracts={activeContractsData}
          onViewAll={handleViewAll}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContentOutput
          title="Content Performance"
          data={filteredOutputData}
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
        <GraphicDonutHorizontal
          data={mappedPillarsData}
          title="Content Pillar Analytics"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <div className="w-full mx-auto">
          <Feedback
            feedbacks={mappedFeedbacks}
            maxHeightClass="max-h-[350px]"
          />
        </div>
        <div className="w-full mx-auto">
          <RecentComments
            comments={mappedComments}
            maxHeightClass="max-h-[350px]"
          />
        </div>
      </div>
    </div>
  );
};

