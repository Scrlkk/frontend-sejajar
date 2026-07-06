import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasksApi, deleteTaskApi, restoreTaskApi } from "@/features/tasks/api/tasksApi";
import { taskKeys } from "@/features/tasks/api/taskKeys";
import { toast } from "react-hot-toast";

export const useTasks = (filter?: { status?: string; limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: taskKeys.list(filter),
    queryFn: () => getTasksApi(filter),
  });
};

export const useDeleteTaskMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) => deleteTaskApi(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Tugas berhasil dihapus");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: () => {
      toast.error("Gagal menghapus tugas");
    },
  });
};

export const useRestoreTaskMutation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: number) => restoreTaskApi(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success("Tugas berhasil dikembalikan");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: () => {
      toast.error("Gagal mengembalikan tugas");
    },
  });
};
