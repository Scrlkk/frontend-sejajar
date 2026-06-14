import { Plus, ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  TasksContent,
  type TaskBoardItem,
} from "@/features/tasks/components/TasksContent";
import { taskBoardColumns } from "@/features/tasks/data/tasksData";

interface TasksBoardProps {
  tasks: TaskBoardItem[];
}

const columnBgColors: Record<string, string> = {
  todo: "bg-gray-300/50",
  onProgress: "bg-yellow-100/50",
  revision: "bg-red-200/50",
  done: "bg-emerald-100/50",
};

export function TaskBoard({ tasks }: TasksBoardProps) {
  const getColumnTasks = (status: TaskBoardItem["status"]) =>
    tasks.filter((t) => t.status === status);

  return (
    <>
      {taskBoardColumns.map((column) => {
        const columnTasks = getColumnTasks(column.key);

        return (
          <div key={column.key}>
            {/* Column Header Card */}
            <Card className="bg-white rounded-t-xl rounded-b-none border border-b-0 border-gray-200 outline outline-gray-300/40 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${column.dotColor}`}
                />
                <span className="text-xs font-bold text-gray-700 tracking-wide">
                  {column.label}
                </span>
                <span className="text-xs font-bold text-gray-400 bg-gray-200/60 rounded-md px-1.5 py-0.5 min-w-5 text-center">
                  {columnTasks.length}
                </span>
              </div>
              <button className="h-6 w-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors">
                <Plus className="h-4 w-4" />
              </button>
            </Card>

            {/* Column Tasks Container */}
            <div
              className={`rounded-b-xl border-gray-200 outline outline-gray-300/40 shadow-lg p-3 min-h-37.5 ${columnBgColors[column.key] || "bg-gray-50/50"}`}
            >
              <div className="space-y-3">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <TasksContent key={task.id} task={task} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 px-4 text-center rounded-xl border border-dashed border-gray-300/80 bg-white/30 backdrop-blur-[2px]">
                    <div className="h-10 w-10 rounded-full bg-white border border-gray-200/50 flex items-center justify-center text-gray-400 mb-3 shadow-sm">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold text-gray-600">
                      No Tasks
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-37.5">
                      No tasks assigned to this column yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
