import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import type { ContentPlanCardItem } from "@/features/contents/components/ContentPlan";
import { ContentPlanPreviewCard } from "@/features/contents/components/ContentPlanPreviewCard";

interface RequestRevisionProps {
  isOpen: boolean;
  onClose: () => void;
  card: ContentPlanCardItem | null;
  cardsList?: ContentPlanCardItem[];
  onSave: (
    cardId: string,
    feedback: string,
    priority: ContentPlanCardItem["priority"],
  ) => void;
}

export function RequestRevision({
  isOpen,
  onClose,
  card,
  cardsList = [],
  onSave,
}: RequestRevisionProps) {
  const [selectedCard, setSelectedCard] = useState<ContentPlanCardItem | null>(
    card,
  );
  const [notes, setNotes] = useState(() => card?.feedback || "");
  const [priority, setPriority] = useState<ContentPlanCardItem["priority"]>(
    () => card?.priority || "Medium",
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCards = useMemo(() => {
    return cardsList.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [cardsList, searchQuery]);

  const handleCardChange = (cardId: string) => {
    const found = cardsList.find((c) => c.id === cardId) || null;
    setSelectedCard(found);
    setNotes(found?.feedback || "");
    setPriority(found?.priority || "Medium");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() || !selectedCard) return;
    onSave(selectedCard.id, notes, priority);
  };

  const getPriorityStyle = (prio: ContentPlanCardItem["priority"]) => {
    const isSelected = priority === prio;
    switch (prio) {
      case "High":
        return isSelected
          ? "border-red-650 bg-red-50/20 text-red-700 ring-1 ring-red-500/20 shadow-sm"
          : "border-gray-200 bg-white text-gray-650 hover:bg-gray-50";
      case "Medium":
        return isSelected
          ? "border-amber-600 bg-amber-50/20 text-amber-700 ring-1 ring-amber-500/20 shadow-sm"
          : "border-gray-200 bg-white text-gray-650 hover:bg-gray-50";
      case "Low":
        return isSelected
          ? "border-blue-500 bg-blue-50/20 text-blue-700 ring-1 ring-blue-500/20 shadow-sm"
          : "border-gray-200 bg-white text-gray-650 hover:bg-gray-50";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-130 max-h-[90vh] flex flex-col rounded-2xl border border-gray-100 bg-white px-6 shadow-2xl outline-none overflow-hidden"
      >
        <DialogHeader className="shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold text-gray-900 leading-none">
            Request Revision
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto py-2 pr-1.5 space-y-5 scrollbar-none">
            {/* Dropdown to select content plan (if cardsList is provided) */}
            {cardsList.length > 0 && (
              <div className="space-y-1.5 flex flex-col relative">
                <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Select Content Plan <span className="text-red-500">*</span>
                </Label>

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
                          : selectedCard
                            ? `${selectedCard.title} (${selectedCard.status})`
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
                        selectedCard
                          ? `${selectedCard.title} (${selectedCard.status})`
                          : "Search or choose a content plan..."
                      }
                      className="w-full rounded-xl border border-gray-250 bg-gray-50/50 pl-3.5 pr-10 py-2.5 text-left text-xs font-semibold focus:outline-none focus:border-red-800 focus:bg-white focus:ring-0 transition-all cursor-pointer"
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
                          {filteredCards.length > 0 ? (
                            filteredCards.map((c) => {
                              const isCurrentSelected =
                                selectedCard?.id === c.id;
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => {
                                    handleCardChange(c.id);
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
              </div>
            )}

            {/* Content Plan Preview Card */}
            {selectedCard ? (
              <ContentPlanPreviewCard card={selectedCard} />
            ) : (
              <div className="h-26.5 border border-dashed border-gray-200 bg-gray-50/10 rounded-xl flex items-center justify-center">
                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                  Select a content plan to see preview
                </span>
              </div>
            )}

            {/* Revision Notes */}
            <div className="space-y-1.5 flex flex-col">
              <Label
                htmlFor="notes"
                className="text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Revision Notes <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="notes"
                required
                placeholder="Explain the changes or revision details needed for the team..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex min-h-24 w-full rounded-xl border border-gray-200 bg-gray-50/30 px-3.5 py-2.5 text-xs ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-red-800 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Revision Priority Selector */}
            <div className="space-y-2.5 flex flex-col">
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Revision Priority
              </Label>
              <div className="grid grid-cols-3 gap-2.5">
                {(["Low", "Medium", "High"] as const).map((prio) => (
                  <button
                    key={prio}
                    type="button"
                    onClick={() => setPriority(prio)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer select-none ${getPriorityStyle(
                      prio,
                    )}`}
                  >
                    {prio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <DialogFooter className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3 sm:space-x-0 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 text-xs font-semibold h-9 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!notes.trim() || !selectedCard}
              className="rounded-xl bg-red-800 hover:bg-red-900 text-white font-semibold px-5 text-xs h-9 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Request Revision
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
