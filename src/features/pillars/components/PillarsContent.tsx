import { Label } from "@/components/ui/label";

interface PillarsContentProps {
  pillar: string;
  setPillar: (val: string) => void;
  error?: string;
}

export const PillarsContent = ({
  pillar,
  setPillar,
  error,
}: PillarsContentProps) => {
  const pillarsList = [
    {
      label: "Education",
      dot: "bg-indigo-500",
      hover: "hover:border-indigo-500 hover:bg-indigo-50/30 hover:text-indigo-600",
      selected: "border-indigo-500 bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-500/30",
    },
    {
      label: "Entertainment",
      dot: "bg-pink-500",
      hover: "hover:border-pink-500 hover:bg-pink-50/30 hover:text-pink-600",
      selected: "border-pink-500 bg-white text-pink-700 shadow-sm ring-1 ring-pink-500/30",
    },
    {
      label: "Lifestyle",
      dot: "bg-emerald-500",
      hover: "hover:border-emerald-500 hover:bg-emerald-50/30 hover:text-emerald-600",
      selected: "border-emerald-500 bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-500/30",
    },
    {
      label: "Product Review",
      dot: "bg-amber-500",
      hover: "hover:border-amber-500 hover:bg-amber-50/30 hover:text-amber-600",
      selected: "border-amber-500 bg-white text-amber-700 shadow-sm ring-1 ring-amber-500/30",
    },
    {
      label: "Behind the Scenes",
      dot: "bg-purple-500",
      hover: "hover:border-purple-500 hover:bg-purple-50/30 hover:text-purple-600",
      selected: "border-purple-500 bg-white text-purple-700 shadow-sm ring-1 ring-purple-500/30",
    },
    {
      label: "Promotion",
      dot: "bg-red-500",
      hover: "hover:border-red-500 hover:bg-red-50/30 hover:text-red-600",
      selected: "border-red-500 bg-white text-red-700 shadow-sm ring-1 ring-red-500/30",
    },
  ];

  return (
    <div className="space-y-1.5 flex flex-col">
      <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Content Pillar <span className="text-red-500">*</span>
      </Label>
      <div className="flex flex-wrap gap-2">
        {pillarsList.map(({ label, dot, hover, selected }) => {
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
      {error && (
        <p className="text-[11px] text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};
