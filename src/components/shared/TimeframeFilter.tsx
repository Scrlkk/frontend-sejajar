import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NoCheckSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 px-3 text-xs font-semibold outline-none focus:bg-slate-50 focus:text-slate-900 hover:bg-slate-50 data-disabled:pointer-events-none data-disabled:opacity-50 transition-colors",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
NoCheckSelectItem.displayName = "NoCheckSelectItem";

interface TimeframeFilterProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function TimeframeFilter({
  value,
  onValueChange,
  className,
}: TimeframeFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-full sm:w-36.5 rounded-xl border-gray-200 bg-gray-50/50 text-sm h-10 ${className}`}>
        <SelectValue placeholder="All Time" />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200/80 shadow-md rounded-xl p-1 z-50">
        <NoCheckSelectItem value="all">All Time</NoCheckSelectItem>
        <NoCheckSelectItem value="today">Today</NoCheckSelectItem>
        <NoCheckSelectItem value="week">This Week</NoCheckSelectItem>
        <NoCheckSelectItem value="month">This Month</NoCheckSelectItem>
        <NoCheckSelectItem value="year">This Year</NoCheckSelectItem>
      </SelectContent>
    </Select>
  );
}
