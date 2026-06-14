import { Search, PenLine, Clapperboard, Hash, Users, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TasksFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTypeFilter: string;
  setActiveTypeFilter: (filter: string) => void;
  onAssignTeam?: () => void;
  onNewTask?: () => void;
}

const typeFilters = [
  { key: "all", label: "All Types", icon: null },
  { key: "Script", label: "Script", icon: PenLine },
  { key: "Production", label: "Production", icon: Clapperboard },
  { key: "Caption", label: "Caption", icon: Hash },
];

export function TasksFilter({
  searchQuery,
  setSearchQuery,
  activeTypeFilter,
  setActiveTypeFilter,
  onAssignTeam,
  onNewTask,
}: TasksFilterProps) {
  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg px-6 py-2">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input Bar */}
        <div className="relative w-full md:w-90">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by content or contract..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800/60 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Type Filter Tabs */}
          <Tabs
            value={activeTypeFilter}
            onValueChange={setActiveTypeFilter}
            className="w-full md:w-auto"
          >
            <TabsList className="bg-gray-200/80 p-1 rounded-xl h-10 gap-1 w-full md:w-auto justify-start overflow-x-auto">
              {typeFilters.map((filter) => (
                <TabsTrigger
                  key={filter.key}
                  value={filter.key}
                  className="rounded-lg text-xs font-semibold px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-logo flex items-center gap-1.5"
                >
                  {filter.icon && <filter.icon className="h-3.5 w-3.5" />}
                  {filter.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Action Buttons: Assign Team & New Task */}
          <div className="flex items-center gap-2 shrink-0 py-1.5">
            <button
              onClick={onAssignTeam}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-md text-xs font-semibold text-slate-800 transition-colors shadow-none cursor-pointer"
            >
              <Users className="h-4 w-4 text-slate-600" />
              Assign Team
            </button>
            <button
              onClick={onNewTask}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-logo hover:opacity-90 active:opacity-100 rounded-md text-xs font-semibold text-white transition-colors shadow-none cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
