import { useState } from "react";
import { Send, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface PreviewPublishItem {
  id: string | number;
  time: string;
  title: string;
  platform: string;
  platformBg?: string;
  postDate?: string;
}

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
}

const getCaption = (itemTitle: string) => {
  const titleLower = itemTitle.toLowerCase();
  if (
    titleLower.includes("bts") ||
    titleLower.includes("glam") ||
    titleLower.includes("shoot")
  ) {
    return "Ever wondered what goes on behind the scenes? Here's a peek into our Spring shoot day! 📸 ✨";
  }
  if (
    titleLower.includes("tutorial") ||
    titleLower.includes("review") ||
    titleLower.includes("foundation")
  ) {
    return "Full guide and tutorial for our latest collection. Check out our honest thoughts and review! 💄💖";
  }
  return "Stay tuned for our latest content series! Exciting things are coming your way very soon. 🚀✨";
};

const getHashtags = (itemTitle: string) => {
  const titleLower = itemTitle.toLowerCase();
  if (
    titleLower.includes("bts") ||
    titleLower.includes("glam") ||
    titleLower.includes("shoot")
  ) {
    return "#bts #behindthescenes #beautyglow #SpringLaunch";
  }
  if (
    titleLower.includes("tutorial") ||
    titleLower.includes("review") ||
    titleLower.includes("foundation")
  ) {
    return "#tutorial #makeup #foundation #beautyreview";
  }
  return "#content #socialmedia #sejajar #creativepost";
};

export function ModalPreviewPublish({
  isOpen,
  onClose,
  item,
  onPublish,
  mode = "preview",
}: ModalPreviewPublishProps) {
  const [prevItem, setPrevItem] = useState<PreviewPublishItem | null>(null);
  const [activeItem, setActiveItem] = useState<PreviewPublishItem | null>(
    null,
  );

  const [inputDate, setInputDate] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [inputHashtags, setInputHashtags] = useState("");

  if (item !== prevItem) {
    setPrevItem(item);
    if (item) {
      setActiveItem(item);
      setInputDate("");
      setInputTime("");
      setInputHashtags("");
    }
  }

  const displayItem = item || activeItem;

  if (!displayItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-md bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 outline-none"
      >
        <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-3">
          <DialogTitle className="text-base font-bold text-gray-900 leading-none">
            {mode === "publish" ? "Publish Content Plan" : "Content Preview"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-3 text-left">
          {/* Visual Video Preview Container */}
          <div className="w-full h-44 bg-[#1e2530] rounded-xl flex items-center justify-center relative shadow-inner group cursor-pointer">
            <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <Play className="h-5 w-5 text-white fill-white ml-0.5" />
            </div>

            <span className="absolute right-3 bottom-3 bg-black/80 text-white font-extrabold text-[10px] tracking-wide rounded px-1.5 py-0.5">
              0:30
            </span>
          </div>

          {/* Details */}
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-snug wrap-break-word">
              {displayItem.title}
            </h3>
            <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed wrap-break-word">
              {getCaption(displayItem.title)}
            </p>
            <p className="text-[11px] font-semibold text-red-800 mt-2.5">
              {getHashtags(displayItem.title)}
              {inputHashtags ? ` ${inputHashtags}` : ""}
            </p>
          </div>

          {/* Platform and Schedule Details Container (Hidden in publish mode until input) */}
          {mode === "preview" ? (
            <div className="bg-slate-50/60 border border-slate-100/50 rounded-xl px-4 py-3 flex items-center text-xs font-semibold text-slate-500 mt-4 leading-none gap-2">
              <span>{displayItem.platform}</span>
              <span className="text-slate-300 font-normal">•</span>
              <span>{displayItem.postDate}</span>
              <span className="text-slate-300 font-normal">•</span>
              <span>{displayItem.time}</span>
            </div>
          ) : (
            <>
              {inputDate && inputTime && (
                <div className="bg-slate-50/60 border border-slate-100/50 rounded-xl px-4 py-3 flex items-center text-xs font-semibold text-slate-500 mt-4 leading-none gap-2">
                  <span>{displayItem.platform}</span>
                  <span className="text-slate-300 font-normal">•</span>
                  <span>{inputDate}</span>
                  <span className="text-slate-300 font-normal">•</span>
                  <span>{inputTime}</span>
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

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 px-5 text-xs font-semibold cursor-pointer h-10 shadow-sm"
            >
              Close
            </Button>
            <Button
              type="button"
              disabled={mode === "preview" || !inputDate || !inputTime || !inputHashtags}
              onClick={() => onPublish(displayItem, inputDate, inputTime, inputHashtags)}
              className="flex-1 rounded-xl bg-red-800 hover:bg-red-900 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold px-5 transition-all text-xs cursor-pointer shadow-sm flex items-center justify-center gap-1.5 h-10"
            >
              <Send className="h-3.5 w-3.5" />
              Publish Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
