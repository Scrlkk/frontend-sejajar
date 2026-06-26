import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getPillarsApi } from "@/features/pillars/api/pillarsApi";
import { getColorToken } from "@/features/pillars/constants/colorPalette";

interface PillarsContentProps {
  /** Array of selected pillar names */
  pillars: string[];
  setPillars: (val: string[]) => void;
  error?: string;
}

export const PillarsContent = ({
  pillars,
  setPillars,
  error,
}: PillarsContentProps) => {
  const { data: apiPillars = [] } = useQuery({
    queryKey: ["pillars"],
    queryFn: () => getPillarsApi({ limit: 100 }),
  });

  const toggle = (name: string) => {
    if (pillars.includes(name)) {
      setPillars(pillars.filter((p) => p !== name));
    } else {
      setPillars([...pillars, name]);
    }
  };

  return (
    <div className="space-y-1.5 flex flex-col">
      <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Content Pillar <span className="text-red-500">*</span>
        {pillars.length > 0 && (
          <span className="ml-1.5 text-[10px] font-normal normal-case text-gray-400">
            ({pillars.length} selected)
          </span>
        )}
      </Label>
      <div className="flex flex-wrap gap-2">
        {apiPillars.map((p) => {
          const label = p.pillar_name;
          const isSelected = pillars.includes(label);
          const color = getColorToken(p.id, p.color_key);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(label)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? color.selected
                  : `border-gray-200 bg-white text-gray-500 ${color.hover}`
              }`}
            >
              <span className={`h-2 w-2 rounded-full shrink-0 ${color.dot}`} />
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
