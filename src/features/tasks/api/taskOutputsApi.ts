import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export interface TaskOutput {
  id: number;
  task_id: number;
  file_url: string;
  caption?: string | null;
  hashtag?: string | null;
  created_at: string;
  updated_at: string;
  version?: number;
  submitted_at?: string;
  file_size?: string | null;
}

export const getTaskOutputsApi = async (taskId: number): Promise<TaskOutput[]> => {
  const response = await api.get<{ data: TaskOutput[] }>(ENDPOINTS.TASK_OUTPUTS.BY_TASK(taskId));
  return response.data.data;
};

export const getAllTaskOutputsApi = async (params?: {
  limit?: number;
  offset?: number;
}): Promise<TaskOutput[]> => {
  const response = await api.get<{ data: TaskOutput[] }>(ENDPOINTS.TASK_OUTPUTS.BASE, {
    params,
  });
  return response.data.data;
};


export const createTaskOutputApi = async (formData: FormData): Promise<TaskOutput> => {
  const response = await api.post<{ data: TaskOutput }>(ENDPOINTS.TASK_OUTPUTS.BASE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const deleteTaskOutputApi = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.TASK_OUTPUTS.DETAIL(id));
};
