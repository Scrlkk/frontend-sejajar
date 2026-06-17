import {
  ContentCalendar,
  type CalendarEvent,
} from "@/features/calendar/components/Calendar";
import {
  myEvents,
  miniSchedules,
  calendarCards,
} from "@/features/calendar/data/calendarData";
import { CalendarSchedules } from "@/features/calendar/components/CalendarSchedules";
import { CalendarPublish } from "@/features/calendar/components/CalendarPublish";
import { publishItems } from "@/features/calendar/data/calendarData";
import type { MiniPublishItem } from "@/features/calendar/components/CalendarPublish";
import { SchedulesContent } from "@/features/tasks/components/SchedulesContent";
import { scheduledData } from "@/features/tasks/data/tasksData";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";

export const CalendarPage = () => {
  const handleEventClick = (event: CalendarEvent) => {
    console.log("Event diklik:", event.title);
  };

  const handlePublishClick = (item: MiniPublishItem) => {
    console.log("Konten siap dipublikasikan:", item.title);
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
          <ContentCalendar events={myEvents} onEventClick={handleEventClick} />
        </div>
        <div className="w-110 space-y-4">
          <CalendarSchedules dateTitle="April 8" schedules={miniSchedules} />
          <CalendarPublish
            items={publishItems}
            onPublishClick={handlePublishClick}
          />
        </div>
      </div>
      <SchedulesContent contents={scheduledData} />
    </div>
  );
};
