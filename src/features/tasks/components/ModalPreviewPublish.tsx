import { useState, useMemo } from "react";
import { Send, Play, X, Video, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { usePermissions } from "@/hooks/usePermissions";
import { updateContentApi } from "@/features/contents/api/contentsApi";
import toast from "react-hot-toast";

export interface PreviewPublishItem {
  id: string | number;
  time: string;
  title: string;
  platform: string;
  platformBg?: string;
  postDate?: string;
  postDateRaw?: string;
  file_url?: string;
  type?: "video" | "image" | string;
  caption?: string;
  hashtag?: string;
  status?: string;
  content_url?: string;
  content_id?: number;
  publisher_name?: string;
}

const parseToInputDate = (dateStr?: string, dateRaw?: string) => {
  if (dateRaw && /^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) return dateRaw;
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  const monthsMap: Record<string, string> = {
    jan: "01",
    januari: "01",
    january: "01",
    feb: "02",
    februari: "02",
    february: "02",
    mar: "03",
    maret: "03",
    march: "03",
    apr: "04",
    april: "04",
    mei: "05",
    may: "05",
    jun: "06",
    juni: "06",
    june: "06",
    jul: "07",
    juli: "07",
    july: "07",
    agu: "08",
    agustus: "08",
    agt: "08",
    aug: "08",
    august: "08",
    sep: "09",
    september: "09",
    sept: "09",
    okt: "10",
    oktober: "10",
    oct: "10",
    october: "10",
    nov: "11",
    november: "11",
    des: "12",
    desember: "12",
    dec: "12",
    december: "12",
  };

  const cleaned = dateStr.replace(/[,.]/g, "").toLowerCase();
  const parts = cleaned.split(/\s+/);
  if (parts.length === 3) {
    let day = "";
    let month = "";
    let year = "";
    if (/^\d+$/.test(parts[0]) && parts[0].length <= 2) {
      day = parts[0].padStart(2, "0");
      month = monthsMap[parts[1]] || "";
      year = parts[2];
    } else if (/^\d+$/.test(parts[1]) && parts[1].length <= 2) {
      month = monthsMap[parts[0]] || "";
      day = parts[1].padStart(2, "0");
      year = parts[2];
    }
    if (month && day && year && year.length === 4) {
      return `${year}-${month}-${day}`;
    }
  }

  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return "";
};

const parseToInputTime = (timeStr?: string) => {
  if (!timeStr) return "";
  const match = timeStr.match(/^(\d{1,2})[.:](\d{2})/);
  if (match) {
    const h = match[1].padStart(2, "0");
    const m = match[2];
    return `${h}:${m}`;
  }
  return "";
};

interface ModalPreviewPublishProps {
  isOpen: boolean;
  onClose: () => void;
  item: PreviewPublishItem | null;
  onPublish: (
    item: PreviewPublishItem,
    date?: string,
    time?: string,
    hashtags?: string,
  ) => void;
  mode?: "preview" | "publish";
  canPublish?: boolean;
}

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

export function ModalPreviewPublish({
  isOpen,
  onClose,
  item,
  onPublish,
  mode = "preview",
  canPublish = true,
}: ModalPreviewPublishProps) {
  const [inputDate, setInputDate] = useState(() => parseToInputDate(item?.postDate, item?.postDateRaw));
  const [inputTime, setInputTime] = useState(() => parseToInputTime(item?.time));
  const [inputHashtags, setInputHashtags] = useState(() => item?.hashtag || "");
  const [urlInput, setUrlInput] = useState(() => item?.content_url || "");
  const [savedContentUrl, setSavedContentUrl] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  const { roles } = usePermissions();
  const isLeadOrAdmin = roles.some((r) =>
    ["admin_social_media", "content_lead", "superadmin", "owner"].includes(r),
  );
  const [isSavingUrl, setIsSavingUrl] = useState(false);
  const queryClient = useQueryClient();

  const displayItem = useMemo(() => {
    return item ? { ...item, content_url: savedContentUrl ?? item.content_url } : null;
  }, [item, savedContentUrl]);

  const handleSaveUrl = async () => {
    if (!displayItem) return;
    const contentId = displayItem.content_id;
    if (!contentId) {
      toast.error("Content ID tidak ditemukan.");
      return;
    }
    try {
      setIsSavingUrl(true);
      await updateContentApi(contentId, {
        content_url: urlInput.trim(),
      });
      setSavedContentUrl(urlInput.trim());
      setIsEditingUrl(false);
      toast.success("Published URL berhasil disimpan!");
      queryClient.invalidateQueries({ queryKey: ["contents"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (err) {
      console.error("Failed to save URL:", err);
      toast.error("Gagal menyimpan URL.");
    } finally {
      setIsSavingUrl(false);
    }
  };

  const isItemVideo =
    displayItem?.type === "video" ||
    displayItem?.file_url?.toLowerCase().endsWith(".mp4") ||
    displayItem?.file_url?.toLowerCase().endsWith(".mov") ||
    displayItem?.file_url?.toLowerCase().endsWith(".webm") ||
    displayItem?.file_url?.toLowerCase().endsWith(".avi");

  const streamUrl = useMemo(() => {
    if (!displayItem?.file_url) return "";
    const isVideo =
      displayItem.type === "video" ||
      displayItem.file_url.toLowerCase().endsWith(".mp4") ||
      displayItem.file_url.toLowerCase().endsWith(".mov") ||
      displayItem.file_url.toLowerCase().endsWith(".webm") ||
      displayItem.file_url.toLowerCase().endsWith(".avi");
    if (!isVideo) return "";

    const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    const filenameWithExt = displayItem.file_url.split("/").pop() || "";
    const dotIndex = filenameWithExt.lastIndexOf(".");
    const basename =
      dotIndex !== -1
        ? filenameWithExt.substring(0, dotIndex)
        : filenameWithExt;
    return `${apiBase}/stream-media/${basename}`;
  }, [displayItem]);

  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  const handleClosePreview = () => {
    setIsPlaying(false);
    setIsMediaLoaded(false);
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
    setIsMediaLoaded(false);
  };



  const isScheduled =
    displayItem?.status?.toLowerCase() === "scheduled" ||
    displayItem?.status?.toLowerCase() === "published";

  if (!displayItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-md bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 outline-none"
      >
        <DialogHeader className="border-b border-gray-100 pb-3 flex flex-col gap-1 text-left">
          <DialogTitle className="text-base font-bold text-gray-900 leading-none">
            {mode === "publish" ? "Publish Content Plan" : "Content Preview"}
          </DialogTitle>
          <p className="text-xs text-gray-400 mt-0.5 leading-normal">
            {mode === "publish"
              ? "Schedule your approved content plan to active social media platforms."
              : "Review the details of the scheduled or published content plan."}
          </p>
        </DialogHeader>

        {mode === "preview" && !isScheduled ? (
          <div className="space-y-6 pt-4 text-center">
            <div className="flex flex-col items-center justify-center space-y-3 py-4">
              <div className="h-16 w-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shadow-sm">
                <Calendar className="h-7 w-7 text-amber-600" />
              </div>
              <div className="space-y-1.5">
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-100">
                  Belum Terjadwal
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-2 max-w-xs mx-auto leading-snug wrap-break-word">
                  {displayItem.title}
                </h3>
              </div>
              {displayItem.caption ? (
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed wrap-break-word">
                  {displayItem.caption}
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic max-w-sm mx-auto">
                  No description or caption provided.
                </p>
              )}
              {inputHashtags && (
                <p className="text-[11px] font-semibold text-red-800 mt-2 max-w-sm mx-auto">
                  {inputHashtags}
                </p>
              )}
            </div>

            <div className="bg-slate-50/60 border border-slate-100/50 rounded-xl px-4 py-3 flex items-center text-xs font-semibold text-slate-500 leading-none gap-2">
              <span>{displayItem.platform}</span>
              {displayItem.publisher_name && (
                <>
                  <span className="text-slate-300 font-normal">•</span>
                  <span>{displayItem.publisher_name}</span>
                </>
              )}
            </div>

            {displayItem.content_url && !isEditingUrl ? (
              <div className="space-y-1.5 flex flex-col text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                  <span>Published Content URL</span>
                  {isLeadOrAdmin && (
                    <button
                      onClick={() => {
                        setUrlInput(displayItem.content_url || "");
                        setIsEditingUrl(true);
                      }}
                      className="text-[10px] text-red-800 hover:text-red-950 font-bold underline cursor-pointer"
                    >
                      Edit Link
                    </button>
                  )}
                </span>
                <a
                  href={displayItem.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-cyan-600 hover:underline truncate break-all block"
                >
                  {displayItem.content_url}
                </a>
              </div>
            ) : (
              isLeadOrAdmin && (
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                    <span>Published Content URL</span>
                    {isEditingUrl && (
                      <button
                        onClick={() => setIsEditingUrl(false)}
                        className="text-[10px] text-gray-400 hover:text-gray-600 font-bold underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="e.g. https://www.instagram.com/p/..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800/60 transition-colors"
                    />
                    <Button
                      type="button"
                      onClick={handleSaveUrl}
                      disabled={!urlInput.trim() || isSavingUrl}
                      className="bg-red-800 hover:bg-red-logo text-white rounded-xl text-xs font-bold px-3.5 h-9 border-none cursor-pointer shrink-0 shadow-none"
                    >
                      {isSavingUrl ? "Saving..." : "Save Link"}
                    </Button>
                  </div>
                </div>
              )
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 px-5 text-xs font-semibold cursor-pointer h-10 shadow-sm"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-left">
            {displayItem.file_url && (
              <div className="w-full h-44 bg-[#1e2530] rounded-xl flex items-center justify-center relative shadow-inner group cursor-pointer overflow-hidden">
                {isPlaying ? (
                  <div className="w-full h-full relative z-25 bg-[#1e2530] flex items-center justify-center">
                    {!isMediaLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#1e2530]">
                        <div className="h-5 w-5 rounded-full border-2 border-slate-700 border-t-red-800 animate-spin" />
                      </div>
                    )}
                    {isItemVideo ? (
                      <video
                        src={streamUrl}
                        controls
                        autoPlay
                        playsInline
                        controlsList="nodownload"
                        onLoadedData={() => setIsMediaLoaded(true)}
                        className={`w-full h-full object-contain transition-opacity duration-300 ${
                          isMediaLoaded ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ) : (
                      <img
                        src={getFileUrl(displayItem.file_url)}
                        alt={displayItem.title}
                        onLoad={() => setIsMediaLoaded(true)}
                        className={`w-full h-full object-contain transition-opacity duration-300 ${
                          isMediaLoaded ? "opacity-100" : "opacity-0"
                        }`}
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
                ) : isItemVideo ? (
                  <div className="w-full h-full bg-slate-950 relative overflow-hidden group">
                    <video
                      src={streamUrl}
                      preload="metadata"
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-50 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-white transition-colors pointer-events-none">
                      <div className="h-10 w-10 rounded-full bg-red-800/10 border border-red-800/30 flex items-center justify-center mb-1.5 shadow-md">
                        <Video className="h-4.5 w-4.5 text-red-650" />
                      </div>
                      <span className="text-[10px] font-bold tracking-wider text-slate-350 uppercase">
                        Video Production
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayClick();
                        }}
                        className="h-12 w-12 rounded-full bg-red-800 hover:bg-red-900 text-white flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110 cursor-pointer"
                      >
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full relative overflow-hidden group/img">
                    <img
                      src={getFileUrl(displayItem.file_url)}
                      alt={displayItem.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPlaying(true);
                        }}
                        className="h-12 w-12 rounded-full bg-red-800 hover:bg-red-900 text-white flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110 cursor-pointer"
                      >
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-gray-900 leading-snug wrap-break-word">
                {displayItem.title}
              </h3>
              {displayItem.caption && (
                <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed wrap-break-word line-clamp-2">
                  {displayItem.caption}
                </p>
              )}
              <p className="text-[11px] font-semibold text-red-800 mt-2.5 line-clamp-1">
                {inputHashtags ? `${inputHashtags}` : ""}
              </p>
            </div>

            {mode === "preview" ? (
              <>
                <div className="bg-slate-50/60 border border-slate-100/50 rounded-xl px-4 py-3 flex items-center text-xs font-semibold text-slate-500 mt-4 leading-none gap-2">
                  <span>{displayItem.platform}</span>
                  <span className="text-slate-300 font-normal">•</span>
                  <span>{displayItem.postDate}</span>
                  {displayItem.time && (
                    <>
                      <span className="text-slate-300 font-normal">•</span>
                      <span>{displayItem.time}</span>
                    </>
                  )}
                  {displayItem.publisher_name && (
                    <>
                      <span className="text-slate-300 font-normal">•</span>
                      <span>{displayItem.publisher_name}</span>
                    </>
                  )}
                </div>

                {displayItem.content_url && !isEditingUrl ? (
                  <div className="space-y-1.5 flex flex-col mt-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                      <span>Published Content URL</span>
                      {isLeadOrAdmin && (
                        <button
                          onClick={() => {
                            setUrlInput(displayItem.content_url || "");
                            setIsEditingUrl(true);
                          }}
                          className="text-[10px] text-red-800 hover:text-red-950 font-bold underline cursor-pointer"
                        >
                          Edit Link
                        </button>
                      )}
                    </span>
                    <a
                      href={displayItem.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-cyan-600 hover:underline truncate break-all block"
                    >
                      {displayItem.content_url}
                    </a>
                  </div>
                ) : (
                  isLeadOrAdmin && (
                    <div className="space-y-2 mt-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex justify-between items-center">
                        <span>Published Content URL</span>
                        {isEditingUrl && (
                          <button
                            onClick={() => setIsEditingUrl(false)}
                            className="text-[10px] text-gray-400 hover:text-gray-600 font-bold underline cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="e.g. https://www.instagram.com/p/..."
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800/60 transition-colors"
                        />
                        <Button
                          type="button"
                          onClick={handleSaveUrl}
                          disabled={!urlInput.trim() || isSavingUrl}
                          className="bg-red-800 hover:bg-red-logo text-white rounded-xl text-xs font-bold px-3.5 h-9 border-none cursor-pointer shrink-0 shadow-none"
                        >
                          {isSavingUrl ? "Saving..." : "Save Link"}
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </>
            ) : (
              <>
                {inputDate && inputTime && (
                  <div className="bg-slate-50/60 border border-slate-100/50 rounded-xl px-4 py-3 flex items-center text-xs font-semibold text-slate-500 mt-4 leading-none gap-2">
                    <span>{displayItem.platform}</span>
                    <span className="text-slate-300 font-normal">•</span>
                    <span>{inputDate}</span>
                    <span className="text-slate-300 font-normal">•</span>
                    <span>{inputTime}</span>
                    {displayItem.publisher_name && (
                      <>
                        <span className="text-slate-300 font-normal">•</span>
                        <span>{displayItem.publisher_name}</span>
                      </>
                    )}
                  </div>
                )}
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Select Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={inputDate}
                        onChange={(e) => setInputDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800/60 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Select Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={inputTime}
                        onChange={(e) => setInputTime(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800/60 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Hashtags <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. #marketing #promo"
                      value={inputHashtags}
                      onChange={(e) => setInputHashtags(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50/50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-800/10 focus:border-red-800/60 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 px-5 text-xs font-semibold cursor-pointer h-10 shadow-sm"
              >
                Close
              </Button>
              {mode === "publish" ? (
                <Button
                  type="button"
                  disabled={!inputDate || !inputTime || !inputHashtags}
                  onClick={() =>
                    onPublish(displayItem, inputDate, inputTime, inputHashtags)
                  }
                  className="flex-1 rounded-xl bg-red-800 hover:bg-red-900 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold px-5 transition-all text-xs cursor-pointer shadow-sm flex items-center justify-center gap-1.5 h-10"
                >
                  <Send className="h-3.5 w-3.5" />
                  Schedule Now
                </Button>
              ) : displayItem.status === "Scheduled" && canPublish ? (
                <Button
                  type="button"
                  onClick={() => onPublish(displayItem)}
                  className="flex-1 rounded-xl bg-red-800 hover:bg-red-900 text-white font-semibold px-5 transition-all text-xs cursor-pointer shadow-sm flex items-center justify-center gap-1.5 h-10"
                >
                  <Send className="h-3.5 w-3.5" />
                  Publish Now
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
