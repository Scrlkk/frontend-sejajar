import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number | null;
  user_name: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export const getTaskCommentsApi = async (taskId: number): Promise<TaskComment[]> => {
  const response = await api.get<{ data: TaskComment[] }>(ENDPOINTS.TASK_COMMENTS.BY_TASK(taskId));
  return response.data.data;
};

export const createTaskCommentApi = async (payload: {
  task_id: number;
  message: string;
}): Promise<TaskComment> => {
  const response = await api.post<{ data: TaskComment }>(ENDPOINTS.TASK_COMMENTS.BASE, payload);
  return response.data.data;
};

export const deleteTaskCommentApi = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.TASK_COMMENTS.DETAIL(id));
};
