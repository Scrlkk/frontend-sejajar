import { useState } from "react";
import {
  Search,
  Plus,
  FilePen,
  AlertTriangle,
  Clock,
  CircleCheckBig,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PillarsCard } from "@/features/pillars/components/PillarsCard";
import { StatusBadgeContent } from "@/features/pillars/components/StatusBadgeContent";
export interface DraftsItem {
  id: string | number;
  title: string;
  category: string;
  categoryBg: string;
  status: "Pending" | "Revision" | "Approved" | "Overdue" | string;
  statusBg: string;
  statusDot: string;
  revisionNote?: string;
  wordCount: number;
  savedTimeText: string;
  iconBg: string;
  iconColor: string;
  assigner?: {
    name: string;
    role: string;
    initials: string;
  };
  content_id?: number;
  deadline?: string | null;
}

interface DraftsProps {
  drafts: DraftsItem[];
  onNewDraft?: () => void;
  onOpen?: (item: DraftsItem) => void;
}

export function Drafts({ drafts, onNewDraft, onOpen }: DraftsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredDrafts = drafts
    .filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (activeTab === "all")
        return matchesSearch && item.status.toLowerCase() !== "approved";
      if (activeTab === "on_progress")
        return matchesSearch && item.status === "On Progress";
      if (activeTab === "pending")
        return matchesSearch && item.status === "Pending";
      if (activeTab === "revision")
        return matchesSearch && item.status === "Revision";
      if (activeTab === "approved")
        return matchesSearch && item.status === "Approved";
      if (activeTab === "overdue")
        return matchesSearch && item.status === "Overdue";

      return matchesSearch;
    })
    .sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

  const countStatus = (
    statusName:
      | "Pending"
      | "Revision"
      | "Approved"
      | "Overdue"
      | "On Progress"
      | string,
  ) => drafts.filter((d) => d.status === statusName).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Revision":
        return <AlertTriangle className="h-5 w-5 text-red-500 stroke-[1.5]" />;
      case "Overdue":
        return <AlertTriangle className="h-5 w-5 text-red-500 stroke-[1.5]" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500 stroke-[1.5]" />;
      case "Approved":
        return (
          <CircleCheckBig className="h-5 w-5 text-emerald-500 stroke-[1.5]" />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg p-6 space-y-6">
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full xl:w-auto overflow-x-auto"
        >
          <TabsList className="bg-gray-200 p-1 rounded-xl h-11 gap-1 w-full xl:w-auto justify-start">
            <TabsTrigger
              value="all"
              className="rounded-lg text-xs font-bold px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs"
            >
              All (
              {
                drafts.filter((d) => d.status.toLowerCase() !== "approved")
                  .length
              }
              )
            </TabsTrigger>
            <TabsTrigger
              value="on_progress"
              className="rounded-lg text-xs font-bold px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs"
            >
              On Progress ({countStatus("On Progress")})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-lg text-xs font-bold px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs"
            >
              Review ({countStatus("Pending")})
            </TabsTrigger>
            <TabsTrigger
              value="revision"
              className="rounded-lg text-xs font-bold px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs"
            >
              Revision ({countStatus("Revision")})
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="rounded-lg text-xs font-bold px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs"
            >
              Approved ({countStatus("Approved")})
            </TabsTrigger>
            <TabsTrigger
              value="overdue"
              className="rounded-lg text-xs font-bold px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs"
            >
              Overdue ({countStatus("Overdue")})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search drafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800/60 transition-colors"
            />
          </div>

          <Button
            onClick={onNewDraft}
            className="bg-red-800 hover:bg-red-900 text-white rounded-xl px-4 py-2 font-bold text-xs md:text-sm h-10 flex items-center gap-2 border-none shadow-none shrink-0 w-full sm:w-auto justify-center cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            New Draft
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredDrafts.length > 0 ? (
          filteredDrafts.map((item) => (
            <Card
              key={item.id}
              className={`w-full rounded-xl border outline outline-gray-300/50 shadow-lg hover:border-red-logo p-5 space-y-4 flex flex-col justify-between transition-colors ${
                item.status === "Overdue"
                  ? "bg-red-50/20 border-red-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`h-11 w-11 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}
                    >
                      <FilePen className="h-5 w-5 stroke-2" />
                    </div>

                    <div className="space-y-2 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-snug truncate">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <PillarsCard
                          category={item.category}
                          className="font-bold text-[10px]"
                        />
                        <StatusBadgeContent
                          status={item.status}
                          className="font-bold text-[10px]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    {getStatusIcon(item.status)}
                  </div>
                </div>

                {(item.status === "Revision" || item.status === "Overdue") &&
                  item.revisionNote && (
                    <div className="w-full bg-red-50/40 border border-red-400 rounded-xl p-3 text-xs md:text-sm text-red-800 font-semibold leading-relaxed">
                      Naskah ini memerlukan revisi. Silakan melihat detail
                      feedback lengkap di kolom diskusi.
                    </div>
                  )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs md:text-sm font-bold text-gray-400">
                <div className="flex flex-col gap-0.5 font-medium min-w-0">
                  <span className="truncate">{item.savedTimeText}</span>
                </div>

                <Button
                  type="button"
                  onClick={() => onOpen?.(item)}
                  className="bg-red-800 hover:bg-red-900 text-white rounded-md px-5 h-9 font-semibold text-xs flex items-center gap-1 border-none shadow-none cursor-pointer"
                >
                  Open
                </Button>
              </div>
            </Card>
          ))
        ) : filteredDrafts.length === 0 && !searchQuery ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-gray-250 bg-slate-50/20 rounded-2xl">
            <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center border border-red-100 text-red-800 shadow-sm mb-4">
              <FilePen className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1">
              Belum Ada Draft Konten
            </h4>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed mb-5">
              Mulai dengan membuat draft script atau artikel untuk konten yang
              telah ditugaskan kepada Anda.
            </p>
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 rounded-2xl border border-gray-100/80">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-gray-400 mb-3 border border-gray-205">
              <Search className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-gray-800">
              Tidak ada draft yang cocok
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Coba sesuaikan kata kunci pencarian atau filter status Anda.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
