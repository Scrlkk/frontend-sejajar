import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export interface CardDashboardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  isEmpty?: boolean;
  emptyValue?: string | number;
  emptyDescription?: string;
  mutedIfEmpty?: boolean;
}

export function CardDashboard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-gray-600",
  iconBgColor = "bg-gray-600/10",
  isEmpty,
  emptyValue = "-",
  emptyDescription,
  mutedIfEmpty = true,
}: CardDashboardProps) {
  const isCardEmpty = isEmpty ?? (value === undefined || value === null || value === "" || value === 0);

  const displayValue = isCardEmpty ? emptyValue : value;
  const displayDescription = isCardEmpty 
    ? (emptyDescription !== undefined ? emptyDescription : description)
    : description;

  return (
    <Card className={`w-full flex justify-between transition-all duration-300 ${
      isCardEmpty && mutedIfEmpty ? "opacity-75 border-dashed border-gray-200" : ""
    }`}>
      <CardHeader className="p-4 pl-6">
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            {title}
          </CardTitle>
          <CardDescription className={`text-2xl font-bold ${
            isCardEmpty ? "text-gray-400 font-medium" : "text-primary"
          }`}>
            {displayValue}
          </CardDescription>
          {displayDescription && (
            <p className="text-xs text-muted-foreground">{displayDescription}</p>
          )}
        </div>
      </CardHeader>
      <div className="flex justify-end p-4 pr-6">
        <div
          className={`rounded-xl transition-colors duration-300 w-11.5 h-11.5 flex items-center justify-center ${
            isCardEmpty ? "bg-gray-100 text-gray-400" : iconBgColor
          }`}
        >
          <Icon className={`w-6 h-6 transition-colors duration-300 ${isCardEmpty ? "text-gray-400" : iconColor}`} />
        </div>
      </div>
    </Card>
  );
}
