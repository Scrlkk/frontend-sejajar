import { useState } from "react";
import { isSameDay } from "date-fns";
import {
  ContentCalendar,
  type CalendarEvent,
} from "@/features/calendar/components/Calendar";
import {
  myEvents,
  calendarCards,
} from "@/features/calendar/data/calendarData";
import { CalendarSchedules, type MiniScheduleItem } from "@/features/calendar/components/CalendarSchedules";
import { SchedulesContent } from "@/features/tasks/components/SchedulesContent";
import { scheduledData } from "@/features/tasks/data/tasksData";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";

export const CalendarPage = () => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date(2026, 5, 18));

  const handleEventClick = (event: CalendarEvent) => {
    console.log("Event diklik:", event.title);
  };

  // Filter events for the selected day
  const dailyEvents = selectedDay
    ? myEvents.filter((event) => isSameDay(event.date, selectedDay))
    : [];

  // Map CalendarEvent to MiniScheduleItem
  const dailySchedules: MiniScheduleItem[] = dailyEvents.map((event) => ({
    id: event.id,
    title: event.title,
    category: event.platform,
    categoryBg: "",
    categoryDot: "",
    status: event.status || "Scheduled",
    statusBg: "",
    statusDot: "",
    platform: event.platform,
    time: event.time,
  }));

  const formatSelectedDate = (date: Date | null) => {
    if (!date) return "No Date Selected";
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {calendarCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div className="w-full h-full flex space-x-4">
        <div className="w-full h-full">
          <ContentCalendar 
            events={myEvents} 
            onEventClick={handleEventClick} 
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
          />
        </div>
        <div className="w-110 space-y-4">
          <CalendarSchedules 
            dateTitle={formatSelectedDate(selectedDay)} 
            schedules={dailySchedules} 
          />
        </div>
      </div>
      <SchedulesContent contents={scheduledData} />
    </div>
  );
};
