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
import { User } from "lucide-react";
import type { ContractCardItem } from "@/features/contracts/components/Contracts";
import { sampleTeamMembers } from "@/features/contracts/data/contractsData";

// Only filter members with role "Content Lead"
const contentLeads = sampleTeamMembers.filter((m) => m.role === "Content Lead");

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ContractCardItem> & { id?: string | number }) => void;
  initialData?: ContractCardItem | null;
  contractsList: ContractCardItem[];
}

interface ContractModalFormProps {
  initialData?: ContractCardItem | null;
  onClose: () => void;
  onSave: (data: Partial<ContractCardItem> & { id?: string | number }) => void;
  contractsList: ContractCardItem[];
}

function formatDateToInput(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateToDisplay(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

// Format number input value into Indonesian Rupiah (Rp. XX,XXX,XXX)
function formatRupiah(value: string): string {
  const numberString = value.replace(/[^0-9]/g, "");
  if (!numberString) return "";
  const formatted = Number(numberString).toLocaleString("en-US");
  return `Rp. ${formatted}`;
}

// Parse initial database values (e.g. "Rp 15M" or "Rp. 15,000,000") to expanded formatted Rupiah strings
function parseInitialValue(value?: string): string {
  if (!value) return "";
  const clean = value.replace(/[^0-9mM]/g, "");
  if (clean.toLowerCase().endsWith("m")) {
    const num = parseFloat(clean);
    if (!isNaN(num)) {
      return `Rp. ${(num * 1000000).toLocaleString("en-US")}`;
    }
  }
  const numOnly = clean.replace(/[^0-9]/g, "");
  if (numOnly) {
    return `Rp. ${Number(numOnly).toLocaleString("en-US")}`;
  }
  return value;
}

// Get custom selection classes (focus border / background) depending on Content Lead name
function getLeadSelectedClasses(leadName: string) {
  switch (leadName) {
    case "Sarah Mitchell":
      return "border-indigo-500 bg-indigo-50/40 text-indigo-900 ring-2 ring-indigo-500/20";
    case "Alisha Khan":
      return "border-amber-500 bg-amber-50/40 text-amber-900 ring-2 ring-amber-500/20";
    case "Michael Brown":
      return "border-emerald-500 bg-emerald-50/40 text-emerald-900 ring-2 ring-emerald-500/25";
    default:
      return "border-blue-500 bg-blue-50/40 text-blue-900 ring-2 ring-blue-500/20";
  }
}

function ContractModalForm({
  initialData,
  onClose,
  onSave,
  contractsList,
}: ContractModalFormProps) {
  const isEdit = !!initialData;

  const [title, setTitle] = React.useState(initialData?.title ?? "");
  const [description, setDescription] = React.useState(
    initialData?.description ?? "",
  );
  const [platforms, setPlatforms] = React.useState<string[]>(
    initialData?.platforms ?? [],
  );
  const [startDate, setStartDate] = React.useState(
    formatDateToInput(initialData?.startDate) ?? "",
  );
  const [endDate, setEndDate] = React.useState(
    formatDateToInput(initialData?.endDate) ?? "",
  );
  const [valueAmount, setValueAmount] = React.useState(
    () => parseInitialValue(initialData?.valueAmount) ?? "",
  );

  // Client autocomplete state
  const [brand, setBrand] = React.useState(initialData?.brand ?? "");
  const [isClientListOpen, setIsClientListOpen] = React.useState(false);

  // Content Lead autocomplete state (starts empty on create)
  const [contentLead, _setContentLead] = React.useState(
    initialData?.contentLead ?? "",
  );
  const [searchLeadText, _setSearchLeadText] = React.useState(
    initialData?.contentLead ?? "",
  );

  const contentLeadRef = React.useRef(initialData?.contentLead ?? "");
  const searchLeadTextRef = React.useRef(initialData?.contentLead ?? "");

  const setContentLead = (val: string) => {
    contentLeadRef.current = val;
    _setContentLead(val);
  };

  const setSearchLeadText = (val: string) => {
    searchLeadTextRef.current = val;
    _setSearchLeadText(val);
  };

  const [isLeadListOpen, setIsLeadListOpen] = React.useState(false);

  // Status (Active / Canceled)
  const [status, setStatus] = React.useState<string>(
    initialData?.status ?? "Active",
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const clients = [
    "TechVision Corp",
    "FreshBrew Coffee",
    "BeautyGlow Brand",
    "FitLife Sports",
    "Zara Studio",
    "ElectroShop",
    "GreenLeaf Org",
  ];

  const filteredClients = clients.filter((c) =>
    c.toLowerCase().includes(brand.toLowerCase()),
  );

  const filteredContentLeads = contentLeads.filter((m) =>
    m.name.toLowerCase().includes(searchLeadText.toLowerCase()),
  );

  const getActiveContractsCount = (leadName: string) => {
    return contractsList.filter(
      (c) =>
        (c.contentLead === leadName ||
          (!c.contentLead && leadName === "Sarah Mitchell")) &&
        c.status === "Active",
    ).length;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Contract title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (platforms.length === 0)
      newErrors.platforms = "Select at least one platform";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (!valueAmount.trim())
      newErrors.valueAmount = "Revenue / contract value is required";
    if (!brand.trim()) newErrors.brand = "Client is required";
    if (!contentLead) newErrors.contentLead = "Content lead is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const currentProgress = initialData?.currentProgress ?? 0;
    const targetProgress = initialData?.targetProgress ?? 10;

    // Auto calculate completed or overdue
    let finalStatus = status;

    if (currentProgress >= targetProgress && targetProgress > 0) {
      finalStatus = "Completed";
    } else if (finalStatus !== "Canceled") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);

      if (end < today) {
        finalStatus = "Overdue";
      } else {
        finalStatus = "Active";
      }
    }

    // Map style helper for status badge
    let statusBg = "bg-green-50 text-green-600 border border-green-100";
    let statusDot = "bg-green-500";
    if (finalStatus === "Completed") {
      statusBg = "bg-blue-50 text-blue-600 border border-blue-100";
      statusDot = "bg-blue-500";
    } else if (finalStatus === "Canceled") {
      statusBg = "bg-gray-50 text-gray-500 border border-gray-200";
      statusDot = "bg-gray-400";
    } else if (finalStatus === "Overdue") {
      statusBg = "bg-red-50 text-red-600 border border-red-100";
      statusDot = "bg-red-500";
    }

    onSave({
      id: initialData?.id,
      title,
      description,
      platforms,
      startDate: formatDateToDisplay(startDate),
      endDate: formatDateToDisplay(endDate),
      valueAmount,
      brand,
      contentLead,
      status: finalStatus,
      statusBg,
      statusDot,
      currentProgress,
      targetProgress,
    });
    onClose();
  };

  const selectedLeadObj = sampleTeamMembers.find((m) => m.name === contentLead);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1.5 scrollbar-none">
        {/* Contract Title */}
        <div className="space-y-1.5 flex flex-col">
          <Label
            htmlFor="title"
            className="text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            Contract Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="e.g. Q3 Brand Awareness Campaign"
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

        {/* Client & Content Lead */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client Selection (Autocomplete/Search field) */}
          <div className="space-y-1.5 flex flex-col relative">
            <Label
              htmlFor="brand"
              className="text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Client / Brand <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="brand"
                placeholder="Search or enter Client..."
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setIsClientListOpen(true);
                }}
                onFocus={() => setIsClientListOpen(true)}
                onBlur={() => {
                  setTimeout(() => setIsClientListOpen(false), 200);
                }}
                className={`rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
                  errors.brand ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {isClientListOpen && filteredClients.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-1 flex flex-col">
                  {filteredClients.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setBrand(c);
                        setIsClientListOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.brand && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.brand}
              </p>
            )}
          </div>

          {/* Content Lead Selection (Autocomplete/Search field) */}
          <div className="space-y-1.5 flex flex-col relative">
            <Label
              htmlFor="contentLead"
              className="text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Content Lead <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="relative flex items-center">
                {selectedLeadObj ? (
                  <div
                    className={`absolute left-3 h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 z-10 ${selectedLeadObj.avatarBg}`}
                  >
                    {selectedLeadObj.initials}
                  </div>
                ) : (
                  <div className="absolute left-3 h-5 w-5 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 shrink-0 z-10">
                    <User className="h-2.5 w-2.5" />
                  </div>
                )}
                <Input
                  id="contentLead"
                  placeholder="Search Content Lead..."
                  value={searchLeadText}
                  onChange={(e) => {
                    setSearchLeadText(e.target.value);
                    setIsLeadListOpen(true);
                  }}
                  onFocus={() => setIsLeadListOpen(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsLeadListOpen(false);
                      const currentSearchText = searchLeadTextRef.current;
                      const currentLead = contentLeadRef.current;

                      if (!currentSearchText.trim()) {
                        setContentLead("");
                      } else {
                        const match = contentLeads.find(
                          (m) =>
                            m.name.toLowerCase() ===
                            currentSearchText.toLowerCase(),
                        );
                        if (match) {
                          setContentLead(match.name);
                          setSearchLeadText(match.name);
                        } else {
                          setSearchLeadText(currentLead);
                        }
                      }
                    }, 200);
                  }}
                  className={`rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors w-full pl-10 ${
                    errors.contentLead
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                />
              </div>

              {isLeadListOpen && filteredContentLeads.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-1 flex flex-col gap-1">
                  {filteredContentLeads.map((m) => {
                    const activeCount = getActiveContractsCount(m.name);
                    const isSelected = contentLead === m.name;
                    const selectedClasses = getLeadSelectedClasses(m.name);

                    return (
                      <button
                        key={m.name}
                        type="button"
                        onClick={() => {
                          setContentLead(m.name);
                          setSearchLeadText(m.name);
                          setIsLeadListOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2.5 border transition-all duration-150 ${
                          isSelected
                            ? selectedClasses
                            : "border-transparent bg-white hover:bg-slate-50 text-gray-700"
                        }`}
                      >
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${m.avatarBg}`}
                        >
                          {m.initials}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-semibold text-gray-800 leading-tight">
                            {m.name}
                          </span>
                          <span className="text-[9px] text-gray-400 font-medium">
                            {activeCount} active{" "}
                            {activeCount === 1 ? "contract" : "contracts"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {errors.contentLead && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.contentLead}
              </p>
            )}
          </div>
        </div>

        {/* Start Date & End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="startDate"
              className="text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
                errors.startDate ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.startDate && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.startDate}
              </p>
            )}
          </div>

          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="endDate"
              className="text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              End Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
                errors.endDate ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.endDate && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.endDate}
              </p>
            )}
          </div>
        </div>

        {/* Value Amount / Revenue & Status Selection buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col">
            <Label
              htmlFor="valueAmount"
              className="text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Revenue / Value <span className="text-red-500">*</span>
            </Label>
            <Input
              id="valueAmount"
              placeholder="e.g. Rp. 15,000,000"
              value={valueAmount}
              onChange={(e) => setValueAmount(formatRupiah(e.target.value))}
              className={`rounded-lg border-gray-200 bg-gray-50/50 py-2.5 focus:outline-none focus:border-red-800 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors ${
                errors.valueAmount ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.valueAmount && (
              <p className="text-[11px] text-red-500 font-medium">
                {errors.valueAmount}
              </p>
            )}
          </div>

          {/* Status Selection Buttons (only for Edit mode, Active vs Cancel) */}
          <div className="space-y-1.5 flex flex-col">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Status
            </Label>
            {isEdit ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("Active")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer outline-none ${
                    status === "Active"
                      ? "border-green-600 bg-green-50 text-green-700 ring-2 ring-green-600/20"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 focus:border-green-300 focus:ring-2 focus:ring-green-500/10"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("Canceled")}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer outline-none ${
                    status === "Canceled"
                      ? "border-slate-500 bg-slate-100 text-slate-700 ring-2 ring-slate-500/20"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 focus:border-slate-300 focus:ring-2 focus:ring-slate-500/10"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-start py-2 px-3 border border-gray-100 bg-gray-50/50 rounded-lg text-xs font-semibold text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0 mr-2" />
                Active (Default)
              </div>
            )}
            <p className="text-[9px] text-gray-400 font-medium leading-normal mt-1">
              Note: Status is set to Completed automatically if progress reaches
              100%. Overdue status is calculated automatically when the end date
              has passed.
            </p>
          </div>
        </div>

        {/* Platforms Selection Buttons */}
        <div className="space-y-2 flex flex-col">
          <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Platforms <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {["Instagram", "TikTok", "YouTube"].map((platform) => {
              const isSelected = platforms.includes(platform);

              let activeStyle = "";
              if (platform === "Instagram") {
                activeStyle = isSelected
                  ? "border-pink-500 bg-pink-50 text-pink-600 ring-2 ring-pink-500/20 font-semibold focus:outline-none"
                  : "border-gray-200 bg-white text-gray-600 focus:outline-none";
              } else if (platform === "TikTok") {
                activeStyle = isSelected
                  ? "border-slate-800 bg-slate-50 text-slate-900 ring-2 ring-slate-800/20 font-semibold focus:outline-none"
                  : "border-gray-200 bg-white text-gray-600 focus:outline-none";
              } else if (platform === "YouTube") {
                activeStyle = isSelected
                  ? "border-red-600 bg-red-50 text-red-600 ring-2 ring-red-600/20 font-semibold focus:outline-none"
                  : "border-gray-200 bg-white text-gray-600 focus:outline-none";
              }

              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setPlatforms((prev) =>
                        prev.filter((p) => p !== platform),
                      );
                    } else {
                      setPlatforms((prev) => [...prev, platform]);
                    }
                  }}
                  className={`flex items-center justify-center py-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer outline-none ${activeStyle}`}
                >
                  {platform}
                </button>
              );
            })}
          </div>
          {errors.platforms && (
            <p className="text-[11px] text-red-500 font-medium">
              {errors.platforms}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5 flex flex-col">
          <Label
            htmlFor="description"
            className="text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            Description <span className="text-red-500">*</span>
          </Label>
          <textarea
            id="description"
            placeholder="Enter contract description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`flex min-h-20 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-red-800 transition-colors resize-none ${
              errors.description ? "border-red-500 focus:border-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="text-[11px] text-red-500 font-medium">
              {errors.description}
            </p>
          )}
        </div>
      </div>

      <DialogFooter className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0 mt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="rounded-lg border-gray-200 hover:bg-gray-50 text-gray-755 px-5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="rounded-lg bg-red-800 hover:bg-red-900 text-white font-medium px-5 transition-all"
        >
          {isEdit ? "Save Changes" : "Add Contract"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ContractModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  contractsList,
}: ContractModalProps) {
  const isEdit = !!initialData;
  const formKey = isOpen ? String(initialData?.id ?? "new") : "closed";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-140 max-h-[90vh] flex flex-col rounded-2xl border border-gray-100 bg-white px-6 shadow-2xl outline-none">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {isEdit ? "Edit Contract" : "Add Contract"}
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            {isEdit
              ? "Update your contract details below."
              : "Complete the form below to register a new contract."}
          </p>
        </DialogHeader>

        <ContractModalForm
          key={formKey}
          initialData={initialData}
          onClose={onClose}
          onSave={onSave}
          contractsList={contractsList}
        />
      </DialogContent>
    </Dialog>
  );
}
