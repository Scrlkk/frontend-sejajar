import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "date-fns";
import type { TaskBoardItem } from "@/features/tasks/components/TasksContent";

interface TaskCalendarProps {
  tasks: TaskBoardItem[];
  title?: string;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const statusDotColors: Record<string, string> = {
  to_do: "text-gray-500",
  on_progress: "text-amber-500",
  revision: "text-red-500",
  approved: "text-emerald-500",
};

const priorityStyles: Record<string, string> = {
  low: "bg-blue-50 text-blue-700 border-blue-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  high: "bg-orange-50 text-orange-700 border-orange-100",
  critical: "bg-red-50 text-red-700 border-red-100",
};

export function TaskCalendar({ tasks }: TaskCalendarProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleGoToToday = () => {
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);

  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const allDaysGrid = eachDayOfInterval({ start: startDate, end: endDate });

  const PRIORITY_ORDER: Record<string, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  const getHeatmapClass = (day: Date) => {
    const dayTasks = tasks.filter((t) => isSameDay(t.date, day));
    if (dayTasks.length === 0)
      return "bg-transparent text-gray-700 hover:bg-gray-100";

    // Find the highest priority task on this day
    let maxVal = 0;
    dayTasks.forEach((t) => {
      const p = t.priority?.toLowerCase() || "low";
      const val = PRIORITY_ORDER[p] || 1;
      if (val > maxVal) maxVal = val;
    });

    if (maxVal === 1)
      return "bg-red-50 text-red-700 border border-red-100 font-semibold shadow-xs hover:bg-red-100/50";
    if (maxVal === 2)
      return "bg-red-100 text-red-800 font-semibold border border-red-200/50 shadow-xs hover:bg-red-200/50";
    if (maxVal === 3)
      return "bg-red-200 text-red-900 font-semibold border border-red-300/40 hover:bg-red-300/50";
    return "bg-red-logo text-white font-semibold hover:bg-red-800";
  };

  const selectedDayTasks = tasks.filter((t) => isSameDay(t.date, selectedDate));

  return (
    <Card className="w-80 bg-white rounde xd-xl border border-gray-200 outline outline-gray-300/50 shadow-lg p-5 space-y-5">
      <CardHeader className="p-0 space-y-4">
        <div className="mx-auto">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-7 w-7 rounded-lg text-gray-500"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-bold text-gray-900 min-w-27.5 text-center">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-7 w-7 rounded-lg text-gray-500"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
            <div className="flex gap-0.5 mr-1">
              <span className="h-2.5 w-2.5 rounded bg-red-50 border border-red-100" />
              <span className="h-2.5 w-2.5 rounded bg-red-100 border border-red-200/50" />
              <span className="h-2.5 w-2.5 rounded bg-red-200 border border-red-300/40" />
              <span className="h-2.5 w-2.5 rounded bg-red-logo" />
            </div>
            <span>Low</span>
            <ArrowRight className="h-4 w-4" />
            <span>High</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleGoToToday}
            className="text-xs font-bold h-6 border-gray-300 shadow-lg rounded-xl bg-gray-50/50 hover:bg-green-100/80 hover:text-green-600
            hover:border-green-600 text-gray-600"
          >
            Today
          </Button>
        </div>
      </CardHeader>

      <div className="space-y-2">
        <div className="grid grid-cols-7 text-center">
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className="text-xs font-semibold text-gray-400 py-1"
            >
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2 gap-x-1.5 justify-items-center">
          {allDaysGrid.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, today);
            const isSelected = isSameDay(day, selectedDate);

            if (!isCurrentMonth) {
              return <div key={idx} className="h-9 w-9" />;
            }

            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(day)}
                className={`h-9 w-9 text-xs rounded-sm flex items-center justify-center transition-all cursor-pointer relative
                  ${isToday ? "bg-red-logo text-white font-extrabold hover:bg-red-800" : getHeatmapClass(day)}
                  ${isSelected && !isToday ? "ring-1 ring-red-800/30 border border-red-800" : ""}
                `}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-50/60 border border-gray-100 rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-900">
          {isSameDay(selectedDate, today)
            ? "Today's Tasks"
            : `Tasks for ${format(selectedDate, "MMM d")}`}
        </h3>

        <div className="space-y-2 max-h-27.5 overflow-y-auto pr-0.5">
          {selectedDayTasks.length > 0 ? (
            selectedDayTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-2.5 text-xs font-semibold"
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <Circle
                    className={`h-2.5 w-2.5 fill-current shrink-0 mt-1 ${
                      task.status === "approved"
                        ? "text-emerald-500"
                        : statusDotColors[task.status] || "text-gray-400"
                    }`}
                  />

                  <div className="flex flex-col min-w-0 flex-1">
                    {task.category && (
                      <span className="text-[10px] text-gray-400 font-medium truncate block">
                        {task.category}
                      </span>
                    )}
                    <span
                      className={`truncate line-clamp-1 ${
                        task.status === "approved"
                          ? "text-gray-400 line-through font-semibold"
                          : "text-gray-700 font-semibold"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase border shrink-0 ${
                    priorityStyles[task.priority] || "bg-gray-50 text-gray-500"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 font-medium py-1">
              No tasks scheduled for this day.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
