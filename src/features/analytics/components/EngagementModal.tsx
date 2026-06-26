import { useState, useMemo } from "react";
import { ChevronDown, Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ContentPlanPreviewCard } from "@/features/contents/components/ContentPlanPreviewCard";
import type { ContentPlanCardItem } from "@/features/contents/components/ContentPlan";
import { type ManualEngagementEntry } from "@/features/analytics/components/Engagement";
import { useQuery } from "@tanstack/react-query";
import { getContentsApi, type Content } from "@/features/contents/api/contentsApi";

interface EngagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  editingItem: ManualEngagementEntry | null;
  existingEntries?: ManualEngagementEntry[];
  onSave: (data: {
    contentId: number;
    contentTitle: string;
    platform: ManualEngagementEntry["platform"];
    date: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }) => void;
}

export function EngagementModal({
  isOpen,
  onClose,
  mode,
  editingItem,
  existingEntries = [],
  onSave,
}: EngagementModalProps) {
  // Fetch published contents from API
  const { data: contents = [] } = useQuery<Content[]>({
    queryKey: ["published-contents"],
    queryFn: () => getContentsApi({ status: "published" }),
    enabled: isOpen,
  });

  // Map API contents to options format
  const contentOptions = useMemo(() => {
    const apiOptions = contents.map((c) => ({
      id: c.id,
      title: c.title,
      campaign: c.contract_name || "Campaign",
      platform: (c.platform_name || "Instagram") as ManualEngagementEntry["platform"],
      platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
      pillar: c.pillars?.[0]?.pillar_name || "Brand Awareness",
      pillarBg: "bg-purple-50 text-purple-600",
      pillarDot: "bg-purple-500",
      status: c.status,
      statusBg: "bg-blue-50 text-blue-600",
      statusDot: "bg-blue-500",
    }));

    if (editingItem) {
      const exists = apiOptions.some(
        (c) => c.title === editingItem.contentTitle,
      );
      if (!exists) {
        return [
          ...apiOptions,
          {
            id: editingItem.id as number,
            title: editingItem.contentTitle,
            campaign: "Manual Entry",
            platform: editingItem.platform,
            platformBg: "bg-gray-100 text-gray-600",
            pillar: "Engagement",
            pillarBg: "bg-slate-50 text-slate-700",
            pillarDot: "bg-slate-500",
            status: "Published",
            statusBg: "bg-cyan-50 text-cyan-700",
            statusDot: "bg-cyan-550",
          },
        ];
      }
    }
    return apiOptions;
  }, [contents, editingItem]);

  // States
  const [selectedTitle, setSelectedTitle] = useState(
    editingItem ? editingItem.contentTitle : "",
  );
  const [platform, setPlatform] = useState<ManualEngagementEntry["platform"] | "">(
    editingItem ? editingItem.platform : "",
  );
  const [date, setDate] = useState(() => {
    if (editingItem) {
      return editingItem.date.includes("T")
        ? editingItem.date.split("T")[0]
        : editingItem.date;
    }
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [views, setViews] = useState<string | number>(
    editingItem ? editingItem.views : "",
  );
  const [likes, setLikes] = useState<string | number>(
    editingItem ? editingItem.likes : "",
  );
  const [comments, setComments] = useState<string | number>(
    editingItem ? editingItem.comments : "",
  );
  const [shares, setShares] = useState<string | number>(
    editingItem ? editingItem.shares : "",
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");



  const filteredOptions = useMemo(() => {
    return contentOptions.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [contentOptions, searchQuery]);

  const selectedContent = useMemo(() => {
    return contentOptions.find((c) => c.title === selectedTitle) || null;
  }, [contentOptions, selectedTitle]);

  // Find if the currently selected content already has metrics in our list
  const existingMetrics = useMemo(() => {
    if (!selectedContent) return null;
    return existingEntries.find((e) => e.id === selectedContent.id) || null;
  }, [existingEntries, selectedContent]);

  const minViews = existingMetrics ? existingMetrics.views : 0;
  const minLikes = existingMetrics ? existingMetrics.likes : 0;
  const minComments = existingMetrics ? existingMetrics.comments : 0;
  const minShares = existingMetrics ? existingMetrics.shares : 0;

  const handleContentChange = (title: string) => {
    const found = contentOptions.find((c) => c.title === title) || null;
    if (found) {
      setSelectedTitle(found.title);
      setPlatform(found.platform);
      
      const existing = existingEntries.find((e) => e.id === found.id);
      if (existing) {
        setViews(existing.views);
        setLikes(existing.likes);
        setComments(existing.comments);
        setShares(existing.shares);
      } else {
        setViews("");
        setLikes("");
        setComments("");
        setShares("");
      }
    } else {
      setSelectedTitle("");
      setPlatform("");
      setViews("");
      setLikes("");
      setComments("");
      setShares("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTitle || !platform || !selectedContent) return;

    onSave({
      contentId: selectedContent.id,
      contentTitle: selectedTitle,
      platform: platform as ManualEngagementEntry["platform"],
      date,
      views: Number(views),
      likes: Number(likes),
      comments: Number(comments),
      shares: Number(shares),
    });
  };

  const numViews = Number(views || 0);
  const numLikes = Number(likes || 0);
  const numComments = Number(comments || 0);
  const numShares = Number(shares || 0);

  const isViewsLower = numViews < minViews;
  const isLikesLower = numLikes < minLikes;
  const isCommentsLower = numComments < minComments;
  const isSharesLower = numShares < minShares;

  const isLikesExceedingViews = numLikes > numViews;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-md bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 outline-none"
      >
        <DialogHeader className="border-b border-gray-100 pb-3 flex flex-col gap-1 text-left">
          <DialogTitle className="text-base font-bold text-gray-900 leading-none">
            {mode === "create"
              ? "Tambah Entri Engagement"
              : "Edit Entri Engagement"}
          </DialogTitle>
          <p className="text-xs font-semibold text-gray-400 mt-0.5 leading-normal">
            {mode === "create"
              ? "Add a new engagement entry to record performance metrics."
              : "Modify the performance metrics and information for the selected engagement entry."}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-left">
          {/* Select Content */}
          {!editingItem ? (
            <div className="space-y-1.5 flex flex-col relative">
              <label className="text-xs font-bold text-gray-700 block">
                Pilih Konten <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                {/* Trigger Input / Search */}
                <div
                  className={`relative flex items-center ${isDropdownOpen ? "z-40" : "z-10"}`}
                >
                  <input
                    type="text"
                    required
                    value={
                      isDropdownOpen
                        ? searchQuery
                        : selectedContent
                          ? `${selectedContent.title} (${selectedContent.platform})`
                          : ""
                    }
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (!isDropdownOpen) {
                        setIsDropdownOpen(true);
                      }
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Cari atau pilih rencana konten..."
                    className="w-full rounded-md border border-gray-200 bg-white pl-3.5 pr-10 py-2 text-left text-xs font-semibold focus:outline-none focus:border-red-800 transition-all cursor-pointer h-9 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isDropdownOpen) {
                        setSearchQuery("");
                      }
                      setIsDropdownOpen(!isDropdownOpen);
                    }}
                    className="absolute right-2.5 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                  </button>
                </div>

                {/* Dropdown Panel overlay */}
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setSearchQuery("");
                      }}
                    />

                    <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-white border border-gray-250 shadow-xl rounded-lg flex flex-col overflow-hidden max-h-60 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="overflow-y-auto p-1 scrollbar-none">
                        {filteredOptions.length > 0 ? (
                          filteredOptions.map((c, i) => {
                            const isCurrentSelected = selectedTitle === c.title;
                            return (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  handleContentChange(c.title);
                                  setIsDropdownOpen(false);
                                  setSearchQuery("");
                                }}
                                className={`w-full text-left rounded-lg px-2.5 py-2 text-xs font-semibold cursor-pointer transition-all ${
                                  isCurrentSelected
                                    ? "bg-red-50 text-red-900"
                                    : "hover:bg-gray-50 text-slate-700"
                                }`}
                              >
                                {c.title}{" "}
                                <span className="text-[10px] text-slate-400 font-medium ml-1">
                                  ({c.platform})
                                </span>
                              </button>
                            );
                          })
                        ) : (
                          <div className="text-center py-4 text-xs text-slate-400 font-medium">
                            Tidak ada rencana konten ditemukan
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {selectedContent ? (
                <div className="mt-2">
                  <ContentPlanPreviewCard
                    card={{
                      id: "preview-id",
                      title: selectedContent.title,
                      category: selectedContent.pillar,
                      platform: selectedContent.platform,
                      format: "Video",
                      priority: "Medium",
                      dueDate: date || "No Date Set",
                      status:
                        selectedContent.status as ContentPlanCardItem["status"],
                      overdue: false,
                    }}
                  />
                </div>
              ) : (
                <div className="mt-2 h-26.5 border border-dashed border-gray-200 bg-gray-50/10 rounded-xl flex items-center justify-center">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                    Pilih konten untuk melihat preview
                  </span>
                </div>
              )}
            </div>
          ) : (
            selectedContent && (
              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-bold text-gray-700 block">
                  Detail Konten
                </label>
                <ContentPlanPreviewCard
                  card={{
                    id: "preview-id",
                    title: selectedContent.title,
                    category: selectedContent.pillar,
                    platform: selectedContent.platform,
                    format: "Video",
                    priority: "Medium",
                    dueDate: date || "No Date Set",
                    status:
                      selectedContent.status as ContentPlanCardItem["status"],
                    overdue: false,
                  }}
                />
              </div>
            )
          )}

          {/* Platform & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Platform <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled
                value={platform || "Belum dipilih"}
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-md text-xs text-gray-500 font-semibold h-9 cursor-not-allowed select-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Tanggal Update <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50/50 border border-gray-250 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-semibold h-9"
              />
            </div>
          </div>

          {/* Metrics: Views & Likes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-red-700" />
                Views <span className="text-red-500">*</span>
                {minViews > 0 && (
                  <span className="text-[10px] text-gray-400 font-normal normal-case">
                    (Prev: {minViews.toLocaleString()})
                  </span>
                )}
              </label>
              <input
                type="number"
                required
                value={views}
                onChange={(e) => setViews(e.target.value)}
                onFocus={(e) => e.target.value === "0" && e.target.select()}
                className="w-full px-3 py-2 bg-gray-50/50 border border-gray-250 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-semibold h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {isViewsLower && (
                <p className="text-[10px] text-amber-600 font-medium mt-1 leading-tight">
                  ⚠ Views lebih kecil dari entri sebelumnya ({minViews.toLocaleString()}). Yakin ini inkremental?
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-pink-600" />
                Likes <span className="text-red-500">*</span>
                {minLikes > 0 && (
                  <span className="text-[10px] text-gray-400 font-normal normal-case">
                    (Prev: {minLikes.toLocaleString()})
                  </span>
                )}
              </label>
              <input
                type="number"
                required
                value={likes}
                onChange={(e) => setLikes(e.target.value)}
                onFocus={(e) => e.target.value === "0" && e.target.select()}
                className="w-full px-3 py-2 bg-gray-50/50 border border-gray-250 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-semibold h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {isLikesLower && (
                <p className="text-[10px] text-amber-600 font-medium mt-1 leading-tight">
                  ⚠ Likes lebih kecil dari entri sebelumnya ({minLikes.toLocaleString()}). Yakin ini inkremental?
                </p>
              )}
              {isLikesExceedingViews && (
                <p className="text-[10px] text-red-600 font-bold mt-1 leading-tight">
                  ⚠ Likes tidak boleh melebihi Views
                </p>
              )}
            </div>
          </div>

          {/* Metrics: Comments & Shares */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-amber-600" />
                Comments <span className="text-red-500">*</span>
                {minComments > 0 && (
                  <span className="text-[10px] text-gray-400 font-normal normal-case">
                    (Prev: {minComments.toLocaleString()})
                  </span>
                )}
              </label>
              <input
                type="number"
                required
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                onFocus={(e) => e.target.value === "0" && e.target.select()}
                className="w-full px-3 py-2 bg-gray-50/50 border border-gray-250 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-semibold h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {isCommentsLower && (
                <p className="text-[10px] text-amber-600 font-medium mt-1 leading-tight">
                  ⚠ Comments lebih kecil dari entri sebelumnya ({minComments.toLocaleString()}). Yakin ini inkremental?
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5 text-emerald-600" />
                Shares <span className="text-red-500">*</span>
                {minShares > 0 && (
                  <span className="text-[10px] text-gray-400 font-normal normal-case">
                    (Prev: {minShares.toLocaleString()})
                  </span>
                )}
              </label>
              <input
                type="number"
                required
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                onFocus={(e) => e.target.value === "0" && e.target.select()}
                className="w-full px-3 py-2 bg-gray-50/50 border border-gray-250 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-semibold h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {isSharesLower && (
                <p className="text-[10px] text-amber-600 font-medium mt-1 leading-tight">
                  ⚠ Shares lebih kecil dari entri sebelumnya ({minShares.toLocaleString()}). Yakin ini inkremental?
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-md border-gray-250 hover:bg-gray-50 text-gray-700 px-5 text-xs font-semibold cursor-pointer h-9 shadow-sm"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={!selectedTitle || !platform || isLikesExceedingViews}
              className="rounded-md bg-red-800 hover:bg-red-900 text-white font-semibold px-5 transition-all text-xs cursor-pointer shadow-sm flex items-center gap-1.5 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === "create" ? "Tambah" : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
