import { useState } from "react";
import { Search, Upload, Play, Trash2, Image, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlatformBadge } from "@/features/pillars/components/PlatformBadge";
import { StatusBadgeContent } from "@/features/pillars/components/StatusBadgeContent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { AssignerInfo } from "@/features/tasks/data/tasksData";

export interface UploadedMediaItem {
  id: string | number;
  title: string;
  type: "video" | "image";
  durationText?: string;
  platform: "TikTok" | "Instagram" | "YouTube" | string;
  platformBg: string;
  fileSizeText: string;
  uploadedTimeText: string;
  status: "Approved" | "Revision" | "Uploading" | "Pending" | string;
  statusBg: string;
  statusDot: string;
  revisionNote?: string;
  assigner?: AssignerInfo;
  isOverdue?: boolean;
}

export type UploadedVideoItem = UploadedMediaItem;

interface UploadsProps {
  uploads: UploadedMediaItem[];
  onUploadNew?: () => void;
  onOpen?: (item: UploadedMediaItem) => void;
  onDelete?: (id: string | number) => void;
}

export function Uploads({
  uploads,
  onUploadNew,
  onOpen,
  onDelete,
}: UploadsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredUploads = uploads.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeTab === "uploading")
      return matchesSearch && item.status === "Uploading";
    if (activeTab === "pending")
      return matchesSearch && item.status === "Pending";
    if (activeTab === "revision")
      return matchesSearch && item.status === "Revision";
    if (activeTab === "approved")
      return matchesSearch && item.status === "Approved";
    if (activeTab === "overdue")
      return matchesSearch && item.isOverdue;

    return matchesSearch;
  });

  const countStatus = (statusName: string) =>
    uploads.filter((u) => u.status === statusName).length;

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
              All ({uploads.length})
            </TabsTrigger>
            <TabsTrigger
              value="uploading"
              className="rounded-lg text-xs font-bold px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs"
            >
              Uploading ({countStatus("Uploading")})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-lg text-xs font-bold px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs"
            >
              Pending Review ({countStatus("Pending")})
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
              className="rounded-lg text-xs font-bold px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs text-red-600 data-[state=active]:text-red-700"
            >
              Overdue ({uploads.filter((u) => u.isOverdue).length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search uploads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800/60 transition-colors"
            />
          </div>

          <Button
            onClick={onUploadNew}
            className="bg-red-800 hover:bg-red-900 text-white rounded-xl px-4 py-2 font-bold text-xs md:text-sm h-10 flex items-center gap-2 border-none shadow-none shrink-0 w-full sm:w-auto justify-center"
          >
            <Upload className="h-4 w-4 stroke-[2.5]" />
            Upload File
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredUploads.length > 0 ? (
          filteredUploads.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "w-full rounded-xl border outline outline-gray-300/50 shadow-lg p-4 space-y-4 flex flex-col justify-between transition-colors hover:border-red-logo",
                item.isOverdue
                  ? "bg-red-50/20 border-red-300"
                  : "bg-white border-gray-200"
              )}
            >
              <div className="space-y-4">
                <div className="w-full h-44 bg-[#1e2530] rounded-xl flex items-center justify-center relative shadow-inner group cursor-pointer">
                  <PlatformBadge
                    platform={item.platform}
                    className="absolute left-3 top-3 text-[10px]"
                  />

                  {item.type === "video" ? (
                    <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
                      <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
                      <Image className="h-5 w-5 text-white" />
                    </div>
                  )}

                  {item.type === "video" && item.durationText && (
                    <span className="absolute right-3 bottom-3 bg-black/80 text-white font-extrabold text-[10px] tracking-wide rounded px-1.5 py-0.5">
                      {item.durationText}
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-snug truncate">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-semibold text-gray-400 tracking-wide uppercase flex-wrap">
                      <span className="capitalize">{item.type}</span>
                      <span>•</span>
                      <span>{item.fileSizeText}</span>
                      <span>•</span>
                      <span className="normal-case font-medium">
                        {item.uploadedTimeText}
                      </span>
                      {item.isOverdue && (
                        <>
                          <span>•</span>
                          <span className="text-red-650 font-bold normal-case flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 stroke-[2.5] text-red-600 shrink-0" />
                            Overdue
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <StatusBadgeContent
                    status={item.status}
                    className="text-xs"
                  />
                </div>

                {item.status === "Revision" && item.revisionNote && (
                  <div className="w-full bg-red-50/40 border border-red-100 rounded-xl p-3 text-xs md:text-sm text-red-800 font-medium leading-relaxed">
                    {item.revisionNote}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs md:text-sm font-bold text-gray-500">
                <button
                  type="button"
                  onClick={() => onDelete?.(item.id)}
                  className="flex items-center gap-1.5 text-red-500 hover:text-red-650 hover:bg-red-50 p-1.5 rounded-lg transition-all cursor-pointer font-semibold"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>

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
        ) : uploads.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-gray-250 bg-slate-50/20 rounded-2xl">
            <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center border border-red-100 text-red-800 shadow-sm mb-4">
              <Upload className="h-6 w-6 stroke-[1.5]" />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1">
              Belum Ada Media Asset
            </h4>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed mb-5">
              Unggah file video atau gambar hasil produksi untuk ditinjau dan
              disetujui.
            </p>
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 rounded-2xl border border-gray-100/80">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-gray-400 mb-3 border border-gray-205">
              <Search className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-gray-800">
              Tidak ada file yang cocok
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
