import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import {
  tasksCardData,
  sampleTaskBoardData,
} from "@/features/tasks/data/tasksData";
import { TaskBoard } from "@/features/tasks/components/TasksBoard";
import { TasksFilter } from "@/features/tasks/components/TasksFilter";
import { TasksDrawer } from "@/features/tasks/components/TasksDrawer";
import type { TaskBoardItem } from "@/features/tasks/components/TasksContent";

export const TasksPage = () => {
  const [tasks, setTasks] = useState<TaskBoardItem[]>(() => {
    return sampleTaskBoardData.map((task, idx) => ({
      ...task,
      description:
        task.description ||
        `Task details specifically defined for ${task.assignee}. Complete the ${task.type.toLowerCase()} for the ${task.category} campaign. Ensure all deliverables match brand guidelines.`,
      pillar:
        task.pillar || (idx % 2 === 0 ? "Behind the Scenes" : "Product Review"),
      role:
        task.role ||
        (task.type === "Script"
          ? "Scriptwriter"
          : task.type === "Editor"
            ? "Video Editor"
            : "Caption Specialist"),
      deliverables:
        task.deliverables ||
        (idx % 3 === 0
          ? [`deliverable_${task.type.toLowerCase()}_v1.jpg`]
          : []),
      comments: task.comments || [
        {
          id: `comment-1-${idx}`,
          sender: "System",
          senderInitials: "SY",
          senderBg: "bg-slate-100 text-slate-600",
          text: `Task automatically assigned to ${task.assignee}.`,
          timestamp: "2 days ago",
        },
        {
          id: `comment-2-${idx}`,
          sender: task.assignee,
          senderInitials: task.assigneeInitials,
          senderBg: task.assigneeBg,
          text: "Starting work on this task. Will upload the initial draft by tomorrow.",
          timestamp: "1 day ago",
        },
      ],
    }));
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypeFilter, setActiveTypeFilter] = useState("all");

  const [selectedTask, setSelectedTask] = useState<TaskBoardItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const taskIdParam = searchParams.get("id");

  const lastProcessedIdRef = useRef<string | null>(null);

  // Intercept the 'id' parameter to auto-open the drawer on route navigation
  useEffect(() => {
    if (taskIdParam) {
      if (lastProcessedIdRef.current !== taskIdParam) {
        const task = tasks.find((t) => String(t.id) === String(taskIdParam));
        if (task) {
          const timer = setTimeout(() => {
            lastProcessedIdRef.current = taskIdParam;
            setSelectedTask(task);
            setIsDrawerOpen(true);
          }, 0);
          return () => clearTimeout(timer);
        }
      }
    } else {
      lastProcessedIdRef.current = null;
    }
  }, [taskIdParam, tasks]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType =
      activeTypeFilter === "all" || task.type === activeTypeFilter;

    return matchesSearch && matchesType;
  });

  const handleSaveTask = (updatedTask: TaskBoardItem) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    );
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTask(null);
    // Clear search param once closed
    if (searchParams.has("id")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("id");
      setSearchParams(newParams, { replace: true });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tasksCardData.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>

      <TasksFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTypeFilter={activeTypeFilter}
        setActiveTypeFilter={setActiveTypeFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <TaskBoard
          tasks={filteredTasks}
          onSelectTask={(task) => {
            setSelectedTask(task);
            setIsDrawerOpen(true);
            const newParams = new URLSearchParams(searchParams);
            newParams.set("id", String(task.id));
            setSearchParams(newParams, { replace: true });
          }}
        />
      </div>

      <TasksDrawer
        key={selectedTask?.id ?? "none"}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        task={selectedTask}
        onSave={handleSaveTask}
      />
    </div>
  );
};
