import {
  ContentCalendar,
  type CalendarEvent,
} from "@/features/calendar/components/Calendar";
import { myEvents, miniSchedules } from "@/features/calendar/data/calendarData";
import { CalendarSchedules } from "@/features/calendar/components/CalendarSchedules";
import { PlatformSummary } from "@/features/calendar/components/PlatformSummary";
import { samplePlatformSummary } from "@/features/calendar/data/calendarData";
import { CalendarPublish } from "@/features/calendar/components/CalendarPublish";
import { publishItems } from "@/features/calendar/data/calendarData";
import type { MiniPublishItem } from "@/features/calendar/components/CalendarPublish";

export const CalendarPage = () => {
  const handleEventClick = (event: CalendarEvent) => {
    console.log("Event diklik:", event.title);
  };

  const handlePublishClick = (item: MiniPublishItem) => {
    console.log("Konten siap dipublikasikan:", item.title);
  };

  return (
    <div className="space-y-4">
      <div className="w-full flex space-x-4">
        <div className="w-full">
          <ContentCalendar events={myEvents} onEventClick={handleEventClick} />
        </div>
        <div className="w-110 space-y-4">
          <CalendarSchedules dateTitle="April 8" schedules={miniSchedules} />
          <CalendarPublish
            items={publishItems}
            onPublishClick={handlePublishClick}
          />
          <PlatformSummary platforms={samplePlatformSummary} />
        </div>
      </div>
    </div>
  );
};
