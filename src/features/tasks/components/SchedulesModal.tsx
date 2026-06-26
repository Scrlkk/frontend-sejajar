import { useState, useMemo } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateEN } from "@/utils/helpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ScheduledContentItem } from "@/features/tasks/components/SchedulesContent";
import { ContentPlanPreviewCard } from "@/features/contents/components/ContentPlanPreviewCard";
import type { ContentPlanCardItem } from "@/features/contents/components/ContentPlan";

interface SchedulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  editingItem: ScheduledContentItem | null;
  onSave: (data: {
    title: string;
    campaign: string;
    platform: string;
    platformBg: string;
    pillar: string;
    pillarBg: string;
    pillarDot: string;
    postDate: string;
    time: string;
    status?: string;
    statusBg?: string;
    statusDot?: string;
  }) => void;
}

const initialContents = [
  {
    title: "Behind the Glam - Product Shoot BTS",
    campaign: "Spring Product Launch",
    platform: "Instagram",
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Behind the Scenes",
    pillarBg: "bg-purple-50 text-purple-600",
    pillarDot: "bg-purple-500",
    status: "Published",
    statusBg: "bg-blue-50 text-blue-600",
    statusDot: "bg-blue-500",
  },
  {
    title: "Foundation Tutorial - Spring Collection",
    campaign: "Spring Product Launch",
    platform: "Instagram",
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Product Review",
    pillarBg: "bg-amber-50 text-amber-700",
    pillarDot: "bg-amber-500",
    status: "Approved",
    statusBg: "bg-emerald-50 text-emerald-600",
    statusDot: "bg-emerald-500",
  },
  {
    title: "Skincare Morning Routine Reel",
    campaign: "Spring Product Launch",
    platform: "Instagram",
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Lifestyle",
    pillarBg: "bg-emerald-50 text-emerald-600",
    pillarDot: "bg-emerald-500",
    status: "On Progress",
    statusBg: "bg-amber-50 text-amber-600",
    statusDot: "bg-amber-500",
  },
  {
    title: "Aesthetic Morning Coffee Routine",
    campaign: "Summer Lifestyle Series",
    platform: "TikTok",
    platformBg: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    pillar: "Lifestyle",
    pillarBg: "bg-emerald-50 text-emerald-600",
    pillarDot: "bg-emerald-500",
    status: "Draft",
    statusBg: "bg-gray-100 text-gray-500",
    statusDot: "bg-gray-400",
  },
  {
    title: "Live Q&A – Career Consultation",
    campaign: "Summer Lifestyle Series",
    platform: "Instagram",
    platformBg: "bg-pink-50 text-pink-600 hover:bg-pink-50",
    pillar: "Education",
    pillarBg: "bg-blue-50 text-blue-600",
    pillarDot: "bg-blue-500",
    status: "Draft",
    statusBg: "bg-gray-100 text-gray-500",
    statusDot: "bg-gray-400",
  },
  {
    title: "5 Tips Belajar Cepat & Efektif",
    campaign: "Education Series",
    platform: "TikTok",
    platformBg: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    pillar: "Education",
    pillarBg: "bg-blue-50 text-blue-600",
    pillarDot: "bg-blue-500",
    status: "Draft",
    statusBg: "bg-gray-100 text-gray-500",
    statusDot: "bg-gray-400",
  },
];

// Helper date parsing/formatting functions
const parseMockDateToInputDate = (dateStr: string) => {
  const months: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const parts = dateStr.replace(",", "").split(" ");
  if (parts.length === 3) {
    const month = months[parts[0]];
    const day = parts[1].padStart(2, "0");
    const year = parts[2];
    if (month && day && year) {
      return `${year}-${month}-${day}`;
    }
  }
  return "";
};



export function SchedulesModal({
  isOpen,
  onClose,
  mode,
  editingItem,
  onSave,
}: SchedulesModalProps) {
  // Form input fields states
  const contentOptions = useMemo(() => {
    if (editingItem) {
      const exists = initialContents.some((c) => c.title === editingItem.title);
      if (!exists) {
        return [
          ...initialContents,
          {
            title: editingItem.title,
            campaign: editingItem.campaign,
            platform: editingItem.platform,
            platformBg: editingItem.platformBg,
            pillar: editingItem.pillar,
            pillarBg: editingItem.pillarBg,
            pillarDot: editingItem.pillarDot,
            status: editingItem.status,
            statusBg: editingItem.statusBg,
            statusDot: editingItem.statusDot,
          },
        ];
      }
    }
    return initialContents;
  }, [editingItem]);

  const [selectedTitle, setSelectedTitle] = useState(
    editingItem ? editingItem.title : "",
  );
  const [date, setDate] = useState(() =>
    editingItem ? parseMockDateToInputDate(editingItem.postDate) : "",
  );
  const [time, setTime] = useState(
    editingItem ? editingItem.time : "",
  );
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    return contentOptions.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [contentOptions, searchQuery]);

  const handleContentChange = (title: string) => {
    const found = contentOptions.find((c) => c.title === title) || null;
    setSelectedTitle(found ? found.title : "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTitle) return;

    const selectedContent = contentOptions.find(
      (c) => c.title === selectedTitle,
    );
    if (!selectedContent) return;

    onSave({
      title: selectedContent.title,
      campaign: selectedContent.campaign,
      platform: selectedContent.platform,
      platformBg: selectedContent.platformBg,
      pillar: selectedContent.pillar,
      pillarBg: selectedContent.pillarBg,
      pillarDot: selectedContent.pillarDot,
      postDate: formatDateEN(date),
      time: time,
      status: selectedContent.status,
      statusBg: selectedContent.statusBg,
      statusDot: selectedContent.statusDot,
    });
  };

  const selectedContent = contentOptions.find((c) => c.title === selectedTitle);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-md bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 outline-none"
      >
        <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-3">
          <DialogTitle className="text-base font-bold text-gray-900 leading-none">
            {mode === "create" ? "Schedule Content" : "Edit Schedule"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-left">
          {/* Select Content */}
          <div className="space-y-1.5 flex flex-col relative">
            <label className="text-xs font-bold text-gray-700 block">
              Select Content <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              {/* Trigger Input / Search */}
              <div
                className={`relative flex items-center ${isDropdownOpen ? "z-40" : "z-10"}`}
              >
                <input
                  type="text"
                  required
                  disabled={!!editingItem}
                  value={
                    isDropdownOpen
                      ? searchQuery
                      : selectedContent
                        ? `${selectedContent.title} (${selectedContent.status})`
                        : ""
                  }
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!isDropdownOpen) {
                      setIsDropdownOpen(true);
                    }
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder={
                    selectedContent
                      ? `${selectedContent.title} (${selectedContent.status})`
                      : "Search or choose a content plan..."
                  }
                  className="w-full rounded-md border border-gray-200 bg-white pl-3.5 pr-10 py-2 text-left text-xs font-semibold focus:outline-none focus:border-red-800 transition-all cursor-pointer h-9 shadow-sm disabled:bg-gray-50/80 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200/60"
                />
                {!editingItem && mode === "create" && (
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
                )}
              </div>

              {/* Dropdown Panel overlay */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop to close when clicking outside */}
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setSearchQuery("");
                    }}
                  />

                  {/* Dropdown Panel Content */}
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-white border border-gray-250 shadow-xl rounded-lg flex flex-col overflow-hidden max-h-60 animate-in fade-in slide-in-from-top-1 duration-150">
                    {/* Scrollable list of plans */}
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
                                ({c.status})
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-xs text-slate-400 font-medium">
                          No content plans found
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
                    dueDate: formatDateEN(date) || "No Date Set",
                    status:
                      selectedContent.status as ContentPlanCardItem["status"],
                    overdue: false,
                  }}
                />
              </div>
            ) : (
              <div className="mt-2 h-26.5 border border-dashed border-gray-200 bg-gray-50/10 rounded-xl flex items-center justify-center">
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  Select a content plan to see preview
                </span>
              </div>
            )}
          </div>

          {/* Date and Time (2 cols) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-medium h-9"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-medium h-9"
              />
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Caption <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              placeholder="Write your caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-colors resize-none text-gray-700 font-medium"
            />
          </div>

          {/* Hashtags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Hashtags <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="#brand #content #social"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-red-800/50 focus:border-red-800 transition-all text-gray-700 font-medium h-9"
            />
            <span className="text-[9px] text-gray-400 block mt-0.5 pl-1 font-semibold">
              Add relevant hashtags for this post
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-md border-gray-200 hover:bg-gray-50 text-gray-700 px-5 text-xs font-semibold cursor-pointer h-9 shadow-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !selectedTitle || !date || !time || !caption || !hashtags
              }
              className="rounded-md bg-red-800 hover:bg-red-900 text-white font-semibold px-5 transition-all text-xs cursor-pointer shadow-sm flex items-center gap-1.5 h-9 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calendar className="h-3.5 w-3.5" />
              {mode === "create" ? "Schedule" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
