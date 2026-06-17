import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  taskBoardColumns,
  sampleTaskBoardData,
} from "@/features/tasks/data/tasksData";
import { TaskDashboardContent } from "@/features/tasks/components/TasksDashboardContent";

interface TaskDashboardProps {
  title?: string;
  onViewAll?: () => void;
}

export function TaskDashboard({
  title = "My Tasks",
  onViewAll,
}: TaskDashboardProps) {
  const scriptTasks = sampleTaskBoardData.filter(
    (task) => task.type === "Script",
  );

  const activeColumns = taskBoardColumns.filter((col) => col.key !== "approved");

  return (
    <Card className="w-full bg-white rounded-xl border border-gray-200 outline outline-gray-300/50 shadow-lg p-6 space-y-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        <button
          onClick={onViewAll}
          className="text-sm font-bold text-red-800 hover:text-red-900 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          All tasks
          <ArrowRight className="h-4 w-4" />
        </button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 items-start">
          {activeColumns.map((column) => {
            const columnTasks = scriptTasks.filter(
              (task) => task.status === column.key,
            );

            return (
              <div key={column.key} className="space-y-4 w-full">
                <div className="flex items-center justify-between text-sm font-bold text-gray-700 px-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${column.dotColor}`}
                    />
                    <span className="capitalize font-bold">
                      {column.label
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </div>

                  <span className="h-6 min-w-6 px-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-full flex items-center justify-center">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnTasks.length > 0 ? (
                    columnTasks.map((task) => (
                      <TaskDashboardContent key={task.id} task={task} />
                    ))
                  ) : (
                    <div className="h-24 rounded-2xl border border-dashed border-gray-100 bg-gray-50/20 flex items-center justify-center text-xs text-gray-400 font-medium">
                      No script tasks
                    </div>
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
