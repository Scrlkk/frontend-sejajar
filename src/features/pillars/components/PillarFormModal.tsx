import { useState } from "react";
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
import type { Pillar } from "../api/pillarsApi";

interface PillarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPillar: Pillar | null;
  onSave: (data: {
    pillar_name: string;
    description: string;
    color_key: string | null;
    is_active: boolean;
  }) => void;
  isPending: boolean;
}

export function PillarFormModal({
  isOpen,
  onClose,
  editingPillar,
  onSave,
  isPending,
}: PillarFormModalProps) {
  const mode = editingPillar ? "edit" : "create";
  
  const [pillarName, setPillarName] = useState(editingPillar?.pillar_name ?? "");
  const [pillarDesc, setPillarDesc] = useState(editingPillar?.description ?? "");
  const [pillarColor, setPillarColor] = useState<string | null>(editingPillar?.color_key ?? null);
  const [pillarActive, setPillarActive] = useState(editingPillar?.is_active ?? true);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pillarName.trim()) return;
    onSave({
      pillar_name: pillarName,
      description: pillarDesc,
      color_key: pillarColor,
      is_active: pillarActive,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 outline-none">
        <DialogHeader className="border-b border-gray-100 pb-3 flex flex-col gap-1 text-left">
          <DialogTitle className="text-base font-bold text-gray-900 leading-none">
            {mode === "create" ? "Add Content Pillar" : "Edit Content Pillar"}
          </DialogTitle>
          <p className="text-xs font-semibold text-gray-400 mt-0.5 leading-normal font-sans">
            {mode === "create"
              ? "Create a new content pillar to align production objectives."
              : "Modify details of the selected content pillar."}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-left">
          <div className="space-y-1.5">
            <Label
              htmlFor="pillarName"
              className="text-xs font-bold text-gray-700 block"
            >
              Pillar Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pillarName"
              required
              value={pillarName}
              onChange={(e) => setPillarName(e.target.value)}
              placeholder="e.g. Brand Awareness, Promotion"
              className="h-9 text-xs focus:ring-1 focus:ring-red-800/50 focus:border-red-800"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="pillarDesc"
              className="text-xs font-bold text-gray-700 block"
            >
              Description
            </Label>
            <textarea
              id="pillarDesc"
              value={pillarDesc}
              onChange={(e) => setPillarDesc(e.target.value)}
              placeholder="Enter description of this pillar..."
              className="w-full min-h-20 rounded-md border border-input bg-transparent px-3 py-2 text-xs font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-800/50 focus-visible:border-red-800"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-gray-700 block">
              Pillar Color
            </Label>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPillarColor(null)}
                className={`h-7 px-2.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                  pillarColor === null
                    ? "bg-gray-900 border-gray-950 text-white shadow-sm ring-2 ring-gray-950/20"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                Auto
              </button>
              {PALETTE_KEYS.map((colorKey) => {
                const token = PALETTE_MAP[colorKey];
                const isSelected = pillarColor === colorKey;
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setPillarColor(colorKey)}
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
                  Pillar Status
                </Label>
                <p className="text-[10px] text-gray-400 font-semibold leading-none">
                  Determine if this content pillar is active
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPillarActive(!pillarActive)}
                className="cursor-pointer"
              >
                <Badge
                  variant="outline"
                  className={`shadow-none rounded-lg px-2.5 py-1 font-semibold text-xs border ${
                    pillarActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {pillarActive ? "Active" : "Inactive"}
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
              disabled={!pillarName.trim() || isPending}
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
