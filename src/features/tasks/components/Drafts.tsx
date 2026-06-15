import { useState } from "react";
import { Search, Plus, FilePen, History, AlertTriangle, Clock, CircleCheckBig, PenLine } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DraftsItem } from "@/features/tasks/data/tasksData";

interface DraftsProps {
  drafts: DraftsItem[];
  onNewDraft?: () => void;
  onOpen?: (item: DraftsItem) => void;
  onHistory?: (item: DraftsItem) => void;
}

export function Drafts({
  drafts,
  onNewDraft,
  onOpen,
  onHistory,
}: DraftsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredDrafts = drafts.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeTab === "to_do")
      return matchesSearch && item.status === "To Do";
    if (activeTab === "pending")
      return matchesSearch && item.status === "Pending";
    if (activeTab === "revision")
      return matchesSearch && item.status === "Revision";
    if (activeTab === "approved")
      return matchesSearch && item.status === "Approved";
    if (activeTab === "overdue")
      return matchesSearch && item.status === "Overdue";

    return matchesSearch;
  });

  const countStatus = (statusName: "To Do" | "Pending" | "Revision" | "Approved" | "Overdue") =>
    drafts.filter((d) => d.status === statusName).length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Revision":
        return <AlertTriangle className="h-5 w-5 text-red-500 stroke-[1.5]" />;
      case "Overdue":
        return <AlertTriangle className="h-5 w-5 text-red-500 stroke-[1.5]" />;
      case "To Do":
        return <PenLine className="h-5 w-5 text-gray-500 stroke-[1.5]" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500 stroke-[1.5]" />;
      case "Approved":
        return <CircleCheckBig className="h-5 w-5 text-emerald-500 stroke-[1.5]" />;
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
              All ({drafts.length})
            </TabsTrigger>
            <TabsTrigger
              value="to_do"
              className="rounded-lg text-xs font-bold px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs"
            >
              To Do ({countStatus("To Do")})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-lg text-xs font-bold px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs"
            >
              Pending ({countStatus("Pending")})
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
              className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg hover:border-red-logo p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className={`h-11 w-11 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}>
                      <FilePen className="h-5 w-5 stroke-2" />
                    </div>

                    <div className="space-y-2 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-snug truncate">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`${item.categoryBg} rounded-md font-bold text-[10px] px-2 py-0.5`}
                        >
                          {item.category}
                        </Badge>
                        <Badge
                          className={`${item.statusBg} rounded-full font-bold px-2.5 py-0.5 text-[10px] border-none shadow-none flex items-center gap-1.5`}
                        >
                          <span
                            className={`h-1 w-1 rounded-full ${item.statusDot}`}
                          />
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    {getStatusIcon(item.status)}
                  </div>
                </div>

                {(item.status === "Revision" || item.status === "Overdue") && item.revisionNote && (
                  <div className="w-full bg-red-50/40 border border-red-400 rounded-xl p-3 text-xs md:text-sm text-red-800 font-semibold leading-relaxed">
                    {item.revisionNote}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs md:text-sm font-bold text-gray-400">
                <div className="flex items-center gap-2 font-medium">
                  <span>{item.wordCount} words</span>
                  <span>•</span>
                  <span>{item.savedTimeText}</span>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onHistory?.(item)}
                    className="flex items-center gap-1.5 hover:text-gray-900 text-gray-500 font-semibold transition-colors cursor-pointer group"
                  >
                    <History className="h-4 w-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    History
                  </button>

                  <Button
                    onClick={() => onOpen?.(item)}
                    className="bg-red-800 hover:bg-red-900 text-white rounded-md px-5 h-9 font-semibold text-xs flex items-center gap-1 border-none shadow-none cursor-pointer"
                  >
                    Open
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-gray-400 text-sm bg-gray-50/50 rounded-2xl border border-gray-100/80">
            No drafts found matching the selected filters.
          </div>
        )}
      </div>
    </Card>
  );
}
