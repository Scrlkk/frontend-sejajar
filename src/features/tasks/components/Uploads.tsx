import { useState } from "react";
import { Search, Upload, AlertTriangle, Video, Play, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlatformBadge } from "@/features/pillars/components/PlatformBadge";
import { StatusBadgeContent } from "@/features/pillars/components/StatusBadgeContent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const getFileUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  let apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  if (apiBase.endsWith("/api")) {
    apiBase = apiBase.substring(0, apiBase.length - 4);
  }
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${apiBase}${path}`;
};

export interface AssignerInfo {
  name: string;
  role: string;
  initials: string;
}

export interface UploadedMediaItem {
  id: string | number;
  latest_output_id?: number;
  title: string;
  type: "video" | "image";
  durationText?: string;
  platform: "TikTok" | "Instagram" | "YouTube" | string;
  platformColorKey?: string | null;
  platformBg: string;
  fileSizeText: string;
  uploadedTimeText: string;
  status: "Approved" | "Revision" | "Uploading" | "Pending" | string;
  statusBg: string;
  statusDot: string;
  revisionNote?: string;
  assigner?: AssignerInfo;
  isOverdue?: boolean;
  content_id?: number;
  task_id?: number;
  file_url?: string;
  deadline?: string | null;
}

export type UploadedVideoItem = UploadedMediaItem;

interface UploadsProps {
  uploads: UploadedMediaItem[];
  onUploadNew?: () => void;
  onOpen?: (item: UploadedMediaItem) => void;
}

export function Uploads({ uploads, onUploadNew, onOpen }: UploadsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [playingItemId, setPlayingItemId] = useState<string | number | null>(
    null,
  );

  const handleClosePreview = () => {
    setPlayingItemId(null);
  };

  const handlePlayClick = (item: UploadedMediaItem) => {
    setPlayingItemId(item.id);
  };

  const filteredUploads = uploads
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
      if (activeTab === "overdue") return matchesSearch && item.isOverdue;

      return matchesSearch;
    })
    .sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
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
              All (
              {
                uploads.filter((u) => u.status.toLowerCase() !== "approved")
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
              className="rounded-lg text-xs font-bold px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-red-700"
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
                "w-full rounded-xl border outline outline-gray-300/50 shadow-lg p-4 space-y-4 flex flex-col justify-between transition-colors hover:border-gray-300",
                item.isOverdue
                  ? "bg-red-50/20 border-red-300"
                  : "bg-white border-gray-200",
              )}
            >
              <div className="space-y-4">
                <div className="w-full h-44 bg-[#1e2530] rounded-xl flex items-center justify-center relative shadow-inner group cursor-pointer overflow-hidden">
                  {item.file_url && playingItemId === item.id ? (
                    <div className="w-full h-full relative z-25 bg-[#1e2530] flex items-center justify-center">
                      {item.type === "video" ? (
                        (() => {
                          const filenameWithExt = item.file_url.split("/").pop() || "";
                          const dotIndex = filenameWithExt.lastIndexOf(".");
                          const basename =
                            dotIndex !== -1
                              ? filenameWithExt.substring(0, dotIndex)
                              : filenameWithExt;
                          const streamUrl = `${(import.meta.env.VITE_API_URL || "").replace(/\/$/, "")}/stream-media/${basename}`;
                          return (
                            <video
                              src={streamUrl}
                              controls
                              autoPlay
                              playsInline
                              controlsList="nodownload"
                              className="w-full h-full object-contain"
                            />
                          );
                        })()
                      ) : (
                        <img
                          src={getFileUrl(item.file_url)}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClosePreview();
                        }}
                        className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-md transition-colors cursor-pointer z-30"
                        title="Close preview"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : item.file_url ? (
                    item.type === "video" ? (
                      (() => {
                        const filenameWithExt =
                          item.file_url.split("/").pop() || "";
                        const dotIndex = filenameWithExt.lastIndexOf(".");
                        const basename =
                          dotIndex !== -1
                            ? filenameWithExt.substring(0, dotIndex)
                            : filenameWithExt;
                        const streamUrl = `${(import.meta.env.VITE_API_URL || "").replace(/\/$/, "")}/stream-media/${basename}`;
                        return (
                          <div className="w-full h-full bg-slate-950 relative overflow-hidden group">
                            {/* Video First Frame Thumbnail */}
                            <video
                              src={streamUrl}
                              preload="metadata"
                              muted
                              playsInline
                              className="w-full h-full object-cover opacity-40 transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Overlaid Info */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-white transition-colors pointer-events-none">
                              <div className="h-10 w-10 rounded-full bg-red-800/10 border border-red-800/30 flex items-center justify-center mb-1.5 shadow-md">
                                <Video className="h-4.5 w-4.5 text-red-650" />
                              </div>
                              <span className="text-[10px] font-bold tracking-wider text-slate-350 uppercase">
                                Video Production
                              </span>
                              <span className="text-[8px] text-slate-500 mt-0.5 truncate max-w-40 font-medium">
                                {filenameWithExt}
                              </span>
                            </div>
                            {/* Play button overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePlayClick(item);
                                }}
                                className="h-12 w-12 rounded-full bg-red-800 hover:bg-red-900 text-white flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110 cursor-pointer"
                              >
                                <Play className="h-5 w-5 fill-current ml-0.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="w-full h-full relative overflow-hidden group/img">
                        <img
                          src={getFileUrl(item.file_url)}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Preview button overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlayingItemId(item.id);
                            }}
                            className="h-12 w-12 rounded-full bg-red-800 hover:bg-red-900 text-white flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110 cursor-pointer"
                          >
                            <Search className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4 w-full h-full bg-linear-to-b from-slate-900 to-slate-950 text-slate-400 group-hover:text-slate-200 transition-colors">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center justify-center mb-2 transition-all group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/20 shadow-lg">
                        <Upload className="h-5 w-5 text-white/80" />
                      </div>
                      <span className="text-xs font-bold tracking-wide text-white/90">
                        Belum Ada Media
                      </span>
                      <span className="text-[10px] text-white/40 mt-0.5">
                        Klik "Open" untuk unggah file
                      </span>
                    </div>
                  )}

                  {item.type === "video" &&
                    item.durationText &&
                    playingItemId !== item.id && (
                      <span className="absolute right-3 bottom-3 bg-black/80 text-white font-extrabold text-[10px] tracking-wide rounded px-1.5 py-0.5 z-10">
                        {item.durationText}
                      </span>
                    )}
                </div>

                <div className="flex gap-3 pt-1">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-start flex-wrap gap-2">
                      <h3 className="font-semibold text-gray-900 text-base md:text-lg leading-snug line-clamp-2 max-w-[80%]">
                        {item.title}
                      </h3>
                      <StatusBadgeContent
                        status={item.status}
                        className="text-xs mt-0.5"
                      />

                      <PlatformBadge
                        platform={item.platform}
                        colorKey={item.platformColorKey}
                        className="text-[10px] shrink-0"
                      />
                    </div>

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
                          <span className="text-red-600 font-bold normal-case flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 stroke-[2.5] text-red-600 shrink-0" />
                            Overdue
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {item.status === "Revision" && item.revisionNote && (
                  <div className="w-full bg-red-50/40 border border-red-100 rounded-xl p-3 text-xs md:text-sm text-red-800 font-medium leading-relaxed">
                    {item.revisionNote}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end pt-3 border-t border-gray-50">
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
        ) : filteredUploads.length === 0 && !searchQuery ? (
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
