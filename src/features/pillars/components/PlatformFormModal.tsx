import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PALETTE_KEYS, PALETTE_MAP } from "../constants/colorPalette";
import type { Platform } from "@/features/platforms/api/platformsApi";

interface PlatformFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlatform: Platform | null;
  onSave: (data: {
    platform_name: string;
    color_key: string | null;
    is_active: boolean;
  }) => void;
  isPending: boolean;
}

export function PlatformFormModal({
  isOpen,
  onClose,
  editingPlatform,
  onSave,
  isPending,
}: PlatformFormModalProps) {
  const mode = editingPlatform ? "edit" : "create";

  const [platformName, setPlatformName] = useState(editingPlatform?.platform_name ?? "");
  const [platformColor, setPlatformColor] = useState<string | null>(editingPlatform?.color_key ?? null);
  const [platformActive, setPlatformActive] = useState(editingPlatform?.is_active ?? true);
  const isColorManuallySelected = useRef(editingPlatform?.color_key ? true : false);


  const autoSelectBrandColor = (name: string): string | null => {
    const norm = name.toLowerCase().trim();
    if (norm.includes("instagram")) return "pink";
    if (norm.includes("youtube")) return "red";
    if (norm.includes("tiktok")) return "violet";
    if (norm.includes("linkedin")) return "sky";
    if (norm.includes("facebook")) return "indigo";
    if (norm.includes("twitter") || norm === "x") return "sky";
    if (norm.includes("pinterest")) return "rose";
    if (norm.includes("whatsapp")) return "green";
    if (norm.includes("spotify")) return "emerald";
    return null;
  };

  const handlePlatformNameChange = (val: string) => {
    setPlatformName(val);
    if (!isColorManuallySelected.current) {
      const suggested = autoSelectBrandColor(val);
      if (suggested) {
        setPlatformColor(suggested);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformName.trim()) return;
    onSave({
      platform_name: platformName,
      color_key: platformColor,
      is_active: platformActive,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 outline-none">
        <DialogHeader className="border-b border-gray-100 pb-3 flex flex-col gap-1 text-left">
          <DialogTitle className="text-base font-bold text-gray-900 leading-none">
            {mode === "create" ? "Add Social Platform" : "Edit Social Platform"}
          </DialogTitle>
          <p className="text-xs font-semibold text-gray-400 mt-0.5 leading-normal font-sans">
            {mode === "create"
              ? "Register a new social media platform destination."
              : "Modify details of the selected social media platform."}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-left">
          <div className="space-y-1.5">
            <Label
              htmlFor="platformName"
              className="text-xs font-bold text-gray-700 block"
            >
              Platform Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="platformName"
              required
              value={platformName}
              onChange={(e) => handlePlatformNameChange(e.target.value)}
              placeholder="e.g. LinkedIn, Instagram, TikTok"
              className="h-9 text-xs focus:ring-1 focus:ring-red-800/50 focus:border-red-800"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 block">
              Platform Color
            </Label>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setPlatformColor(null);
                  isColorManuallySelected.current = true;
                }}
                className={`h-7 px-2.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                  platformColor === null
                    ? "bg-gray-900 border-gray-950 text-white shadow-sm ring-2 ring-gray-950/20"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                Auto
              </button>
              {PALETTE_KEYS.map((colorKey) => {
                const token = PALETTE_MAP[colorKey];
                const isSelected = platformColor === colorKey;
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => {
                      setPlatformColor(colorKey);
                      isColorManuallySelected.current = true;
                    }}
                    className={`h-7 w-7 rounded-full border border-black/5 transition-all cursor-pointer flex items-center justify-center ${token.dot} ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-gray-950 scale-110"
                        : "hover:scale-105"
                    }`}
                    title={colorKey}
                  >
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {mode === "edit" && (
            <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
              <div className="space-y-0.5">
                <Label className="text-xs font-bold text-gray-900">
                  Platform Status
                </Label>
                <p className="text-[10px] text-gray-400 font-semibold leading-none">
                  Determine if this platform is active
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPlatformActive(!platformActive)}
                className="cursor-pointer"
              >
                <Badge
                  variant="outline"
                  className={`shadow-none rounded-lg px-2.5 py-1 font-semibold text-xs border ${
                    platformActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {platformActive ? "Active" : "Inactive"}
                </Badge>
              </button>
            </div>
          )}

          <DialogFooter className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-md border-gray-250 hover:bg-gray-50 text-gray-700 px-5 text-xs font-semibold cursor-pointer h-9 shadow-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!platformName.trim() || isPending}
              className="rounded-md bg-red-800 hover:bg-red-900 text-white font-semibold px-5 transition-all text-xs cursor-pointer shadow-sm h-9 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === "create" ? "Add" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
