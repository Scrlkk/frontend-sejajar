import { useState } from "react";
import {
  Search,
  Calendar,
  MoveRight,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  FolderClosed,
  FileSearch,
  RotateCcw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlatformBadge } from "@/features/pillars/components/PlatformBadge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { PillarsContract } from "@/features/pillars/components/PillarsContract";

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
  createdBy?: string;
  deletedAt?: string | null;
}

interface ContractsProps {
  contracts: ContractCardItem[];
  onCardClick?: (item: ContractCardItem) => void;
  onAddClick?: () => void;
  onEditClick?: (item: ContractCardItem) => void;
  onDeleteClick?: (id: string | number) => void;
  onRestoreClick?: (id: string | number) => void;
  onStatusChange?: (id: string | number, newStatus: string) => void;
}

export function Contracts({
  contracts,
  onCardClick,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onRestoreClick,
  onStatusChange,
}: ContractsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredContracts = contracts.filter((item) => {
    const isDeleted = !!item.deletedAt;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "deleted") return matchesSearch && isDeleted;

    // Semua tab selain "deleted" hanya tampilkan yang belum dihapus
    if (isDeleted) return false;

    if (activeTab === "active")
      return matchesSearch && item.status === "Active";
    if (activeTab === "completed")
      return matchesSearch && item.status === "Completed";
    if (activeTab === "overdue")
      return matchesSearch && item.status === "Overdue";
    if (activeTab === "cancel")
      return matchesSearch && (item.status === "Cancel" || item.status === "Canceled");

    return matchesSearch;
  });

  const countStatus = (statusName: string) => {
    if (statusName === "Cancel") {
      return contracts.filter((c) => !c.deletedAt && (c.status === "Cancel" || c.status === "Canceled")).length;
    }
    if (statusName === "deleted") {
      return contracts.filter((c) => !!c.deletedAt).length;
    }
    return contracts.filter((c) => !c.deletedAt && c.status === statusName).length;
  };

  const activeContracts = contracts.filter((c) => !c.deletedAt);

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

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
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
                All ({activeContracts.length})
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
              <TabsTrigger
                value="cancel"
                className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Cancel ({countStatus("Cancel")})
              </TabsTrigger>
              <TabsTrigger
                value="deleted"
                className="rounded-lg text-xs font-semibold px-4 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600"
              >
                <Trash2 className="h-3 w-3 mr-1 inline-block" />
                Deleted ({countStatus("deleted")})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            onClick={onAddClick}
            className="bg-red-800 hover:bg-red-900 text-white rounded-lg h-10 px-4 gap-2 cursor-pointer shadow-sm text-sm font-semibold w-full sm:w-auto justify-center shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add Contract
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredContracts.length > 0 ? (
          filteredContracts.map((item) => {
            const progressPercentage =
              (item.currentProgress / item.targetProgress) * 100;

            return (
              <Card
                key={item.id}
                onClick={() => !item.deletedAt && onCardClick?.(item)}
                className={`w-full rounded-xl border outline outline-gray-300/40 shadow-lg p-6 space-y-3 relative transition-all group ${
                  item.deletedAt
                    ? "bg-gray-50 border-gray-200 cursor-default opacity-70"
                    : "bg-white border-gray-200 hover:border-red-logo hover:bg-red-50/20 cursor-pointer"
                }`}
              >
                {item.deletedAt && (
                  <div className="absolute inset-0 rounded-xl pointer-events-none border border-dashed border-red-300/60" />
                )}
                {/* Actions Dropdown replacing simple '>' button */}
                <div
                  className="absolute right-5 top-6 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-logo hover:bg-gray-150/50 rounded-lg cursor-pointer transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-44 bg-white border border-gray-250/80 shadow-md rounded-xl p-1 z-50"
                    >
                      {item.deletedAt ? (
                        // Kontrak sudah dihapus: tampilkan opsi Restore saja
                        <DropdownMenuItem
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-green-600 rounded-lg cursor-pointer hover:bg-green-50 focus:bg-green-50 transition-colors"
                          onClick={() => onRestoreClick?.(item.id)}
                        >
                          <RotateCcw className="h-3.5 w-3.5 text-green-600 shrink-0" />
                          <span>Restore</span>
                        </DropdownMenuItem>
                      ) : (
                        <>
                          <DropdownMenuItem
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors"
                            onClick={() => onEditClick?.(item)}
                          >
                            <Pencil className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                            <span>Edit Contract</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="border-gray-100 my-1" />

                          <DropdownMenuLabel className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Set Status
                          </DropdownMenuLabel>

                          <DropdownMenuItem
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-green-600 rounded-lg cursor-pointer hover:bg-green-50 focus:bg-green-50 transition-colors"
                            onClick={() => onStatusChange?.(item.id, "Active")}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                            <span>Active</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-600 rounded-lg cursor-pointer hover:bg-blue-50 focus:bg-blue-50 transition-colors"
                            onClick={() => onStatusChange?.(item.id, "Completed")}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span>Completed</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-500 rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 transition-colors"
                            onClick={() => onStatusChange?.(item.id, "Cancel")}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                            <span>Cancel</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="border-gray-100 my-1" />

                          <DropdownMenuItem
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50 transition-colors"
                            onClick={() => onDeleteClick?.(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-550 shrink-0" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-400">
                  <span className="py-0.5">{item.code}</span>

                  <PillarsContract status={item.status} />
                </div>

                <div className="space-y-0.5">
                  <h3 className="font-semibold text-gray-900 text-lg md:text-xl leading-snug line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">
                    {item.brand}
                  </p>
                  <p className="text-sm pt-1 text-gray-400 font-normal leading-relaxed line-clamp-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {item.platforms.map((platform, idx) => (
                    <PlatformBadge
                      key={idx}
                      platform={platform}
                      showDot={false}
                      className="text-xs font-semibold"
                    />
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
        ) : contracts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50/20 rounded-2xl border border-dashed border-gray-200 shadow-xs">
            <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-800 shadow-sm border border-red-100 mb-4 animate-pulse">
              <FolderClosed className="h-7 w-7" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Belum Ada Kontrak
            </h4>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-5 font-semibold">
              Mulai dengan mendaftarkan kontrak baru untuk mengelola dan melacak
              progres produksi konten Anda.
            </p>
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50/20 rounded-2xl border border-dashed border-gray-200 shadow-xs">
            <div className="h-14 w-14 rounded-2xl bg-red-100/80 flex items-center justify-center text-slate-500 shadow-sm border border-slate-100 mb-4">
              <FileSearch className="h-7 w-7 text-red-logo animate-pulse" />
            </div>
            <h4 className="text-sm font-semibold text-gray-600 mb-1">
              Kontrak Tidak Ditemukan
            </h4>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed mb-5 font-semibold">
              Tidak ada kontrak yang cocok dengan kata kunci pencarian atau
              filter tab saat ini.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-500 text-xs font-semibold cursor-pointer h-9 px-4"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
