import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePermissions } from "@/hooks/usePermissions";
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

import { getColorToken } from "@/features/pillars/constants/colorPalette";

export interface CalendarEvent {
  id: string | number;
  title: string;
  time: string;
  date: Date;
  platform: "TikTok" | "Instagram" | "YouTube" | string;
  platformColorKey?: string | null;
  badgeBg: string;
  lineColor: string;
  status?: string;
  category?: string;
  pillar?: string;
  format?: string;
  priority?: string;
}

interface ContentCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  selectedDay?: Date | null;
  onDaySelect?: (day: Date | null) => void;
  currentDate?: Date;
  onCurrentDateChange?: (date: Date) => void;
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
  selectedDay: propSelectedDay,
  onDaySelect,
  currentDate: propCurrentDate,
  onCurrentDateChange,
}: ContentCalendarProps) {
  const { roles } = usePermissions();
  const showContentVsTaskLegend = useMemo(() => {
    const allowed = ["owner", "content_lead", "superadmin"];
    return roles.some((r) => allowed.includes(r));
  }, [roles]);

  const [internalCurrentDate, setInternalCurrentDate] = useState(new Date());
  const currentDate =
    propCurrentDate !== undefined ? propCurrentDate : internalCurrentDate;
  const setCurrentDate = (date: Date) => {
    if (onCurrentDateChange) {
      onCurrentDateChange(date);
    } else {
      setInternalCurrentDate(date);
    }
  };

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [tempMonth, setTempMonth] = useState(currentDate.getMonth());
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  const [internalSelectedDay, setInternalSelectedDay] = useState<Date | null>(
    null,
  );

  const selectedDay =
    propSelectedDay !== undefined ? propSelectedDay : internalSelectedDay;
  const setSelectedDay = (day: Date | null) => {
    if (onDaySelect) {
      onDaySelect(day);
    } else {
      setInternalSelectedDay(day);
    }
  };

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

  const handleToday = () => {
    const todayDate = new Date();
    setCurrentDate(todayDate);
    setSelectedDay(todayDate);
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const platformsLegend = useMemo(() => {
    const seen = new Set<string>();
    const list: { name: string; colorKey?: string | null }[] = [];
    events.forEach((event) => {
      if (event.platform) {
        const norm = event.platform.trim();
        if (!seen.has(norm)) {
          seen.add(norm);
          list.push({
            name: norm,
            colorKey: event.platformColorKey,
          });
        }
      }
    });
    return list;
  }, [events]);

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

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs font-semibold text-gray-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {platformsLegend.slice(0, 4).map((p) => {
              const token = getColorToken(p.name, p.colorKey);
              return (
                <div key={p.name} className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className={`h-2 w-2 rounded-full ${token.dot}`} /> {p.name}
                </div>
              );
            })}
            {platformsLegend.length > 4 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-[11px] font-bold text-red-800 hover:text-red-950 underline cursor-pointer">
                    +{platformsLegend.length - 4} more
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 bg-white rounded-lg shadow-md border border-gray-100 flex flex-col gap-1.5">
                  {platformsLegend.slice(4).map((p) => {
                    const token = getColorToken(p.name, p.colorKey);
                    return (
                      <div key={p.name} className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-gray-700">
                        <span className={`h-2 w-2 rounded-full ${token.dot}`} /> {p.name}
                      </div>
                    );
                  })}
                </PopoverContent>
              </Popover>
            )}
          </div>
          
          {showContentVsTaskLegend && (
            <>
              <div className="hidden sm:block h-3.5 w-px bg-gray-200" />
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-gray-400" /> Content - Schedule
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full border-2 border-gray-400 bg-transparent" /> Task - Deadline
                </div>
              </div>
            </>
          )}
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

        <div className="grid h-112 grid-cols-7 gap-px bg-gray-100/50 rounded-2xl overflow-hidden border border-gray-100/30">
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
                className={`min-h-20 p-2.5 relative flex flex-col justify-between group transition-all hover:bg-slate-50/50 cursor-pointer ${
                  !isCurrentMonth
                    ? "bg-red-50/15 border border-red-100/50 rounded-xl m-1"
                    : isSelected
                      ? "bg-red-50/20 border-2 border-red-500 rounded-xl m-0.5"
                      : "bg-white border border-gray-100/60"
                } ${isToday ? "bg-emerald-50/30! border-emerald-300/50! rounded-xl m-0.5" : ""}`}
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

                {/* Event indicators (Colored Dots) */}
                <div className="flex flex-wrap items-center justify-center gap-1 mt-1.5 mb-0.5 min-h-3">
                  {isCurrentMonth &&
                    dayEvents.slice(0, 3).map((event) => {
                      const token = getColorToken(event.platform, event.platformColorKey);
                      const dotColor = token.dot;
                      const borderColor = token.dot;

                      const isTask = event.id.toString().startsWith("t_");
                      const drawAsTask = showContentVsTaskLegend && isTask;

                      return (
                        <div
                          key={event.id}
                          title={
                            showContentVsTaskLegend
                              ? `${isTask ? "Task (Deadline)" : "Content (Schedule)"}${event.time ? ` • ${event.time}` : ""} • ${event.title}`
                              : `${event.time ? `${event.time} • ` : ""}${event.title}`
                          }
                          className={`h-2 w-2 rounded-full ${
                            drawAsTask ? `bg-transparent border-2 ${borderColor}` : dotColor
                          } transition-transform hover:scale-130 shadow-sm`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDay(day);
                            onEventClick?.(event);
                          }}
                        />
                      );
                    })}
                  {isCurrentMonth && dayEvents.length > 3 && (
                    <span
                      title={`${dayEvents.length - 3} more events`}
                      className="text-[9px] font-bold text-gray-500 bg-gray-50 border border-gray-200/60 rounded px-1 flex items-center justify-center leading-none h-3.5 select-none"
                    >
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
