import { TaskCalendar } from "@/features/calendar/components/TasksCalendar";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import {
  contentEditorCards,
  sampleDeadlines,
} from "@/features/dashboard/data/contenteditor";
import { RecentComments } from "@/features/reviews/components/RecentComments";
import { sampleComments } from "@/features/reviews/data/reviewsData";
import { TaskDashboard } from "@/features/tasks/components/TasksDashboard";
import { UpcomingDeadlines } from "@/features/tasks/components/UpcomingDeadlines";
import { sampleTaskBoardData } from "@/features/tasks/data/tasksData";
import { useNavigate } from "react-router-dom";

export const ContentEditorPage = () => {
  const navigate = useNavigate();

  const handleViewAllTasks = () => {
    navigate("/tasks");
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contentEditorCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <div className="flex space-x-4">
        <TaskDashboard onViewAll={handleViewAllTasks} />
        <div className="w-100">
          <TaskCalendar tasks={sampleTaskBoardData} />
        </div>
      </div>
      <div className="flex space-x-4">
        <UpcomingDeadlines deadlines={sampleDeadlines} />
        <RecentComments
          comments={sampleComments}
          maxHeightClass="max-h-[300px]"
        />
      </div>
    </div>
  );
};
