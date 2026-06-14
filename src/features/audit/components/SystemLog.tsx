import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search, ChevronLeft, ChevronRight } from "lucide-react";

export interface ActivityLogItem {
  id: string | number;
  name: string;
  initials: string;
  avatarBg: string;
  actionType: "UPDATE" | "CREATE" | "PUBLISH" | string;
  actionBg: string;
  description: string;
  date: string;
}

interface SystemActivityLogProps {
  logs: ActivityLogItem[];
  timeframe?: string;
  itemsPerPage?: number;
}

export function SystemLog({ logs, itemsPerPage = 5 }: SystemActivityLogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activityType, setActivityType] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const activityTypes = Array.from(new Set(logs.map((log) => log.actionType)));

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesActivityType =
      activityType === "all" || log.actionType === activityType;

    let matchesTime = true;
    if (timeFilter !== "all") {
      const logDate = new Date(log.date);
      const now = new Date();

      if (timeFilter === "today") {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        matchesTime = logDate >= startOfDay;
      } else if (timeFilter === "week") {
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        matchesTime = logDate >= startOfWeek;
      } else if (timeFilter === "month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        matchesTime = logDate >= startOfMonth;
      } else if (timeFilter === "year") {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        matchesTime = logDate >= startOfYear;
      }
    }

    return matchesSearch && matchesActivityType && matchesTime;
  });

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleActivityTypeChange = (value: string) => {
    setActivityType(value);
    setCurrentPage(1);
  };

  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
    setCurrentPage(1);
  };

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-100 outline outline-gray-300/40 shadow-lg p-6">
      <CardHeader className="flex flex-col p-0 mb-6 space-y-4">
        <div className="w-full flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900">
            System Activity Log
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="bg-white border border-gray-300 text-gray-600 hover:text-black hover:bg-gray-200"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        <div className="w-full flex flex-col justify-between space-y-3 sm:flex-row sm:space-y-0 items-center gap-3">
          <div className="relative w-full max-w-sm sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activity..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/20 focus:border-red-800 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={activityType} onValueChange={handleActivityTypeChange}>
              <SelectTrigger className="w-full sm:w-40 rounded-sm focus:ring-0 border-gray-200 bg-gray-50/50 text-sm h-9.5">
                <SelectValue placeholder="All Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activity Type</SelectItem>
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
              <SelectTrigger className="w-full sm:w-32.5 rounded-sm focus:ring-0 border-gray-200 bg-gray-50/50 text-sm h-9.5">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-5">
        {currentItems.length > 0 ? (
          currentItems.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <div className="flex items-start gap-3 min-w-0">
                <Avatar
                  className={`h-9 w-9 ${log.avatarBg} font-semibold flex items-center justify-center text-xs shrink-0 mt-0.5`}
                >
                  <AvatarFallback className="bg-transparent">
                    {log.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-bold text-gray-900 truncate">
                      {log.name}
                    </span>
                    <Badge
                      className={`${log.actionBg} text-[10px] font-bold px-2 py-0.5 rounded-md border-none shadow-none`}
                    >
                      {log.actionType}
                    </Badge>
                  </div>
                  <p className="text-gray-500 leading-relaxed warp-break-words">
                    {log.description}
                  </p>
                </div>
              </div>

              <span className="text-gray-400 text-xs shrink-0 pt-1 font-medium">
                {log.date}
              </span>
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium text-gray-500">No activity logs yet</p>
            <p className="text-xs text-gray-400 mt-1">Activity will appear here once actions are recorded.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm font-medium text-gray-500">No results found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </CardContent>

      <div className="flex items-center justify-between pt-4 text-sm text-gray-500 border-t border-gray-100 mt-4">
        <div>
          Showing{" "}
          <span className="font-medium text-gray-900">
            {totalItems === 0 ? 0 : indexOfFirstItem + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-900">
            {indexOfLastItem > totalItems ? totalItems : indexOfLastItem}
          </span>{" "}
          of <span className="font-medium text-gray-900">{totalItems}</span>{" "}
          activities
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-xl h-9 px-3 gap-1 border-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center justify-center min-w-8 font-medium text-gray-900 px-2">
            Page {currentPage} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded-xl h-9 px-3 gap-1 border-gray-200"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
