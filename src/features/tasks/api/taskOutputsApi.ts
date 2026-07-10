import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

import type { TaskOutput } from '../types';

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

export const updateTaskOutputApi = async (
  id: number,
  data: { caption?: string; hashtag?: string },
): Promise<TaskOutput> => {
  const response = await api.patch<{ data: TaskOutput }>(ENDPOINTS.TASK_OUTPUTS.DETAIL(id), data);
  return response.data.data;
};
