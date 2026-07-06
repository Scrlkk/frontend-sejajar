import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '../types';
export type { Task, CreateTaskPayload, UpdateTaskPayload };

const mapTaskStatusFromBackend = (task: Task): Task => {
  return {
    ...task,
    status: task.status === "review" ? "pending" : task.status,
  };
};

const mapTaskStatusToBackend = (status?: string): string | undefined => {
  if (status === "pending") return "review";
  return status;
};

export const getTasksApi = async (params?: {
  content_id?: number;
  contract_id?: number;
  assigned_to?: number;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<Task[]> => {
  const queryParams = params
    ? {
        ...params,
        status: params.status === "pending" ? "review" : params.status,
      }
    : undefined;

  const response = await api.get<{ data: Task[] }>(ENDPOINTS.TASKS.BASE, {
    params: queryParams,
  });
  return response.data.data.map(mapTaskStatusFromBackend);
};

export const getTaskByIdApi = async (id: number): Promise<Task> => {
  const response = await api.get<{ data: Task }>(ENDPOINTS.TASKS.DETAIL(id));
  return mapTaskStatusFromBackend(response.data.data);
};


export const createTaskApi = async (payload: CreateTaskPayload): Promise<Task> => {
  const body = {
    ...payload,
    status: mapTaskStatusToBackend(payload.status),
  };
  const response = await api.post<{ data: Task }>(ENDPOINTS.TASKS.BASE, body);
  return mapTaskStatusFromBackend(response.data.data);
};

export const updateTaskApi = async (id: number, payload: UpdateTaskPayload): Promise<Task> => {
  const body = {
    ...payload,
    status: mapTaskStatusToBackend(payload.status),
  };
  const response = await api.put<{ data: Task }>(ENDPOINTS.TASKS.DETAIL(id), body);
  return mapTaskStatusFromBackend(response.data.data);
};

export const deleteTaskApi = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.TASKS.DETAIL(id));
};

export const restoreTaskApi = async (id: number): Promise<Task> => {
  const response = await api.post<{ data: Task }>(`${ENDPOINTS.TASKS.DETAIL(id)}/restore`);
  return mapTaskStatusFromBackend(response.data.data);
};
