import { useState } from "react";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import {
  tasksCardData,
  sampleTaskBoardData,
} from "@/features/tasks/data/tasksData";
import { TaskBoard } from "@/features/tasks/components/TasksBoard";
import { TasksFilter } from "@/features/tasks/components/TasksFilter";

export const TasksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypeFilter, setActiveTypeFilter] = useState("all");

  const filteredTasks = sampleTaskBoardData.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType =
      activeTypeFilter === "all" || task.type === activeTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Dashboard cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tasksCardData.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>

      {/* Filter component */}
      <TasksFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTypeFilter={activeTypeFilter}
        setActiveTypeFilter={setActiveTypeFilter}
        onAssignTeam={() => console.log("Assign Team clicked")}
        onNewTask={() => console.log("New Task clicked")}
      />

      {/* Kanban columns grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <TaskBoard tasks={filteredTasks} />
      </div>
    </div>
  );
};
