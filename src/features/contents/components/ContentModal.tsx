import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image as ImageIcon, Video } from "lucide-react";
import type { TeamMember } from "@/features/contents/components/ContentPlan";

export type ContentFormValues = {
  title: string;
  objective?: string;
  category: string;
  targetAudience?: string;
  pillar: string;
  format: "Video" | "Image" | "";
  platform: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  notes?: string;
  status?: string;
  feedback?: string;
  overdue?: boolean;
  assignedTeam?: TeamMember[];
};

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ContentFormValues & { id?: string }) => void;
  initialData?: (ContentFormValues & { id?: string }) | null;
}

interface ContentModalFormProps {
  initialData?: (ContentFormValues & { id?: string }) | null;
  onClose: () => void;
  onSave: (data: ContentFormValues & { id?: string }) => void;
}

function ContentModalForm({
  initialData,
  onClose,
  onSave,
}: ContentModalFormProps) {
  const isEdit = !!initialData;

  // Inisialisasi langsung — tidak perlu useEffect
  const [title, setTitle] = React.useState(initialData?.title ?? "");
  const [objective, setObjective] = React.useState(
    initialData?.objective ?? "",
  );
  const [category, setCategory] = React.useState(initialData?.category ?? "");
  const [targetAudience, setTargetAudience] = React.useState(
    initialData?.targetAudience ?? "",
  );
  const [pillar, setPillar] = React.useState(initialData?.pillar ?? "");
  const [format, setFormat] = React.useState<"Video" | "Image" | "">(
    (initialData?.format as "Video" | "Image" | "") ?? "",
  );
  const [platform, setPlatform] = React.useState(initialData?.platform ?? "");
  const [priority, setPriority] = React.useState<"High" | "Medium" | "Low">(
    initialData?.priority ?? "Medium",
  );
  const [dueDate, setDueDate] = React.useState(initialData?.dueDate ?? "");
  const [notes, setNotes] = React.useState(initialData?.notes ?? "");
  const status = initialData?.status ?? "Draft";
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Content title is required";
    if (!category.trim()) newErrors.category = "Content category is required";
    if (!pillar) newErrors.pillar = "Content pillar is required";
    if (!format) newErrors.format = "Content type is required";
    if (!platform) newErrors.platform = "Platform is required";
    if (!dueDate) newErrors.dueDate = "Deadline is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      title,
      objective,
      category,
      targetAudience,
      pillar,
      format,
      platform,
      priority,
      dueDate,
      notes,
      status,
      id: initialData?.id,
      assignedTeam: initialData?.assignedTeam,
    });
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 overflow-hidden"
    >
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto space-y-5 py-4 pr-1.5 scrollbar-none">
        {/* Content Title */}
        <div className="space-y-1.5 flex flex-col">
          <Label
            htmlFor="title"
            className="text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            Content Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="e.g. Foundation Tutorial – Spring Collection"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
              errors.title ? "border-red-500 focus:border-red-500" : ""
            }`}
          />
          {errors.title && (
            <p className="text-[11px] text-red-500 font-medium">
              {errors.title}
            </p>
          )}
        </div>

        {/* Content Objective */}
        <div className="space-y-1.5 flex flex-col">
          <Label
            htmlFor="objective"
            className="text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            Content Objective
          </Label>
          <Input
            id="objective"
            placeholder="What is the goal of this content?"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Content Category */}
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="category"
              className="text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Content Category <span className="text-red-500">*</span>
            </Label>
            <Input
              id="category"
              placeholder="e.g. Tutorial"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
                errors.category ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.category && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.category}
              </p>
            )}
          </div>

          {/* Target Audience */}
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="targetAudience"
              className="text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Target Audience
            </Label>
            <Input
              id="targetAudience"
              placeholder="e.g. Women 18-34"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
            />
          </div>
        </div>

        {/* Content Pillar */}
        <div className="space-y-1.5 flex flex-col">
          <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Content Pillar <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                {
                  label: "Education",
                  dot: "bg-indigo-500",
                  hover:
                    "hover:border-indigo-500 hover:bg-indigo-50/30 hover:text-indigo-600",
                  selected:
                    "border-indigo-500 bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-500/30",
                },
                {
                  label: "Entertainment",
                  dot: "bg-pink-500",
                  hover:
                    "hover:border-pink-500 hover:bg-pink-50/30 hover:text-pink-600",
                  selected:
                    "border-pink-500 bg-white text-pink-700 shadow-sm ring-1 ring-pink-500/30",
                },
                {
                  label: "Lifestyle",
                  dot: "bg-emerald-500",
                  hover:
                    "hover:border-emerald-500 hover:bg-emerald-50/30 hover:text-emerald-600",
                  selected:
                    "border-emerald-500 bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-500/30",
                },
                {
                  label: "Product Review",
                  dot: "bg-amber-500",
                  hover:
                    "hover:border-amber-500 hover:bg-amber-50/30 hover:text-amber-600",
                  selected:
                    "border-amber-500 bg-white text-amber-700 shadow-sm ring-1 ring-amber-500/30",
                },
                {
                  label: "Behind the Scenes",
                  dot: "bg-purple-500",
                  hover:
                    "hover:border-purple-500 hover:bg-purple-50/30 hover:text-purple-600",
                  selected:
                    "border-purple-500 bg-white text-purple-700 shadow-sm ring-1 ring-purple-500/30",
                },
                {
                  label: "Promotion",
                  dot: "bg-red-500",
                  hover:
                    "hover:border-red-500 hover:bg-red-50/30 hover:text-red-600",
                  selected:
                    "border-red-500 bg-white text-red-700 shadow-sm ring-1 ring-red-500/30",
                },
              ] as {
                label: string;
                dot: string;
                hover: string;
                selected: string;
              }[]
            ).map(({ label, dot, hover, selected }) => {
              const isSelected = pillar === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setPillar(label)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? selected
                      : `border-gray-200 bg-white text-gray-650 ${hover}`
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full shrink-0 ${dot}`} />
                  {label}
                </button>
              );
            })}
          </div>
          {errors.pillar && (
            <p className="text-[11px] text-red-500 font-medium">
              {errors.pillar}
            </p>
          )}
        </div>

        {/* Grid for Content Type (Format) & Platform */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Content Type (Format) */}
          <div className="space-y-2 flex flex-col">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Content Type <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat("Video")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                  format === "Video"
                    ? "border-red-800 bg-red-50/25 text-red-955 ring-1 ring-red-800/10"
                    : "border-gray-200 bg-white text-gray-650 hover:bg-gray-50"
                }`}
              >
                <Video className="h-4 w-4 shrink-0" />
                Video
              </button>
              <button
                type="button"
                onClick={() => setFormat("Image")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                  format === "Image"
                    ? "border-red-800 bg-red-50/25 text-red-955 ring-1 ring-red-800/10"
                    : "border-gray-200 bg-white text-gray-655 hover:bg-gray-50"
                }`}
              >
                <ImageIcon className="h-4 w-4 shrink-0" />
                Image
              </button>
            </div>
            {errors.format && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.format}
              </p>
            )}
          </div>

          {/* Platform */}
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="platform"
              className="text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Platform <span className="text-red-500">*</span>
            </Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger
                id="platform"
                className="w-full rounded-lg border-gray-200 bg-gray-50/50 py-2.5 text-left focus:outline-none focus:border-red-800 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
              >
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-gray-100 bg-white p-1 shadow-lg z-50">
                {["Instagram", "TikTok", "YouTube"].map((plat) => (
                  <SelectItem
                    key={plat}
                    value={plat}
                    className="rounded-lg py-2 focus:bg-red-50 focus:text-red-900 cursor-pointer"
                  >
                    {plat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.platform && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.platform}
              </p>
            )}
          </div>
        </div>

        {/* Grid for Priority & Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Priority */}
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="priority"
              className="text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Priority
            </Label>
            <Select
              value={priority}
              onValueChange={(val) =>
                setPriority(val as "High" | "Medium" | "Low")
              }
            >
              <SelectTrigger
                id="priority"
                className="w-full rounded-lg border-gray-200 bg-gray-50/50 py-2.5 text-left focus:outline-none focus:border-red-800 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
              >
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-gray-100 bg-white p-1 shadow-lg z-50">
                {["High", "Medium", "Low"].map((prio) => (
                  <SelectItem
                    key={prio}
                    value={prio}
                    className="rounded-lg py-2 focus:bg-red-50 focus:text-red-900 cursor-pointer"
                  >
                    {prio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Deadline */}
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="dueDate"
              className="text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Deadline <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
                errors.dueDate ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.dueDate && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.dueDate}
              </p>
            )}
          </div>
        </div>

        {/* Production Notes & References */}
        <div className="space-y-1.5 flex flex-col">
          <Label
            htmlFor="notes"
            className="text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            Production Notes & References
          </Label>
          <textarea
            id="notes"
            placeholder="e.g. Talent script links, reference links, editing checklist, props needed, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="flex min-h-24 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors resize-none"
          />
        </div>
      </div>

      {/* Footer actions */}
      <DialogFooter className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 sm:space-x-0 shrink-0 mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="rounded-lg border-gray-200 hover:bg-gray-50 text-gray-750 px-5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="rounded-lg bg-red-800 hover:bg-red-900 text-white font-medium px-5 transition-all"
        >
          {isEdit ? "Save Changes" : "Create Plan"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// ─── Shell modal: hanya mengurus Dialog open/close.
export function ContentModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ContentModalProps) {
  const isEdit = !!initialData;
  const formKey = isOpen ? (initialData?.id ?? "new") : "closed";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-140 max-h-[90vh] flex flex-col rounded-2xl border border-gray-100 bg-white px-6 shadow-2xl outline-none">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {isEdit ? "Edit Content Plan" : "Create Content Plan"}
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            {isEdit
              ? "Update your content plan details below."
              : "Complete the form below to create a new content plan."}
          </p>
        </DialogHeader>

        <ContentModalForm
          key={formKey}
          initialData={initialData}
          onClose={onClose}
          onSave={onSave}
        />
      </DialogContent>
    </Dialog>
  );
}
