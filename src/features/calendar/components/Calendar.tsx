import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  setMonth,
  setYear,
} from "date-fns";

export interface CalendarEvent {
  id: string | number;
  title: string;
  time: string;
  date: Date;
  platform: "TikTok" | "Instagram" | "YouTube" | string;
  badgeBg: string;
  lineColor: string;
  status?: "Draft" | "Schedule" | "Revision";
}

interface ContentCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function ContentCalendar({
  events,
  onEventClick,
}: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [tempMonth, setTempMonth] = useState(currentDate.getMonth());
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const handlePickerOpen = (open: boolean) => {
    if (open) {
      setTempMonth(currentDate.getMonth());
      setTempYear(currentDate.getFullYear());
    }
    setIsPickerOpen(open);
  };

  const handleApply = () => {
    let newDate = setMonth(currentDate, tempMonth);
    newDate = setYear(newDate, tempYear);
    setCurrentDate(newDate);
    setIsPickerOpen(false);
  };

  const handleToday = () => setCurrentDate(new Date());

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const allDaysGrid = eachDayOfInterval({ start: startDate, end: endDate });
  const today = new Date();

  return (
    <Card className="w-full max-h-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-lg p-4">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between p-0 mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            className="h-9 w-9 rounded-xl border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Popover open={isPickerOpen} onOpenChange={handlePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="text-xl font-bold text-gray-900 px-3 py-1 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
              >
                {format(currentDate, "MMMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-72 p-4 bg-white rounded-2xl shadow-xl border border-gray-200 outline outline-gray-300/40"
              align="start"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setTempYear((y) => y - 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-bold text-gray-800 tabular-nums">
                    {tempYear}
                  </span>
                  <button
                    onClick={() => setTempYear((y) => y + 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="grid grid-cols-4 gap-1.5">
                  {MONTHS.map((m, idx) => {
                    const isSelected = idx === tempMonth;
                    const isCurrentMonth =
                      idx === today.getMonth() &&
                      tempYear === today.getFullYear();
                    return (
                      <button
                        key={m}
                        onClick={() => setTempMonth(idx)}
                        className={`py-1.5 px-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-red-800 text-white shadow-sm scale-[1.03]"
                            : isCurrentMonth
                              ? "bg-gray-50 text-red-800 ring-1 ring-red-800/30 hover:bg-red-50"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {m.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>

                <div className="h-px bg-gray-100" />

                <Button
                  size="sm"
                  className="w-full bg-red-800 hover:bg-red-900 text-white rounded-xl text-xs h-9 font-semibold transition-colors"
                  onClick={handleApply}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-9 w-9 rounded-xl border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            onClick={handleToday}
            className="h-7 px-3 rounded-lg border-gray-300 bg-gray-50/50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-xs font-semibold gap-1 transition-colors ml-1"
          >
            Today
          </Button>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#252f41]" /> TikTok
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-pink-500" /> Instagram
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-600" /> YouTube
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-7 text-center mb-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-sm font-bold text-gray-400 py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-100/50 rounded-2xl overflow-hidden border border-gray-100/30">
          {allDaysGrid.map((day, dayIdx) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, today);
            const isSelected = selectedDay
              ? isSameDay(day, selectedDay)
              : false;

            const dayEvents = events.filter((event) =>
              isSameDay(event.date, day),
            );

            return (
              <div
                key={dayIdx}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`min-h-27.5 p-2 relative flex flex-col justify-between group transition-colors cursor-pointer ${
                  !isCurrentMonth
                    ? "bg-red-50/30 border border-red-200/40 rounded-xl m-1"
                    : isSelected
                      ? "bg-red-50/30 border-2 border-red-500 rounded-xl m-0.5"
                      : "bg-white"
                } ${isToday ? "bg-emerald-50/40! border-emerald-300/60! rounded-xl m-0.5" : ""}`}
              >
                <div className="flex justify-end items-start w-full">
                  <span
                    className={`text-xs font-bold p-1 rounded-md min-w-5.5 text-center ${
                      !isCurrentMonth ? "text-gray-400/70" : "text-gray-700"
                    } ${isToday ? "bg-emerald-500 text-white rounded-md px-1.5 font-bold" : ""}`}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                <div className="mt-1 space-y-1 flex-1 overflow-y-auto max-h-18.75 scrollbar-none">
                  {isCurrentMonth &&
                    dayEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onEventClick?.(event)}
                        className={`text-[10px] md:text-xs font-medium p-1.5 border-l-2 ${event.lineColor} ${event.badgeBg} truncate cursor-pointer transition-all flex flex-col justify-center`}
                      >
                        <span className="truncate">
                          <span className="opacity-80 font-medium mr-1">
                            {event.time}
                          </span>
                          • {event.title}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
