import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface InfoItem {
  label: string;
  value: string;
}

export interface ContractInfoProps {
  title?: string;
  items?: InfoItem[];
}

export function ContractInfo({ title = "Contract Info", items = [] }: ContractInfoProps) {
  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg p-6">
      <CardHeader className="p-0 mb-5">
        <CardTitle className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col gap-2">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={`flex items-center justify-between pb-3 text-sm font-normal ${
              index !== items.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <span className="text-slate-400/90 font-medium">{item.label}</span>
            <span className="text-slate-900 font-semibold text-right">
              {item.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

