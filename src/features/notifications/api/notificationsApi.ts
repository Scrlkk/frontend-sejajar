import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export interface BackendNotification {
  id: number;
  recipient_id: number;
  sender_id: number | null;
  title: string;
  message: string;
  source_type: string;
  source_id: number;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  sender_name: string | null;
}

export interface GetNotificationsParams {
  is_read?: boolean;
  limit?: number;
  offset?: number;
}

export const getNotificationsApi = async (params?: GetNotificationsParams): Promise<BackendNotification[]> => {
  const response = await api.get<{ data: BackendNotification[] }>(ENDPOINTS.NOTIFICATIONS.BASE, {
    params,
  });
  return response.data.data;
};

export const getUnreadCountApi = async (): Promise<number> => {
  // Directly returns the wrapped success data (e.g. response.data.data = 5)
  const response = await api.get<{ data: number }>(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  return response.data.data;
};

export const markAsReadApi = async (id: number): Promise<void> => {
  await api.patch(ENDPOINTS.NOTIFICATIONS.READ(id));
};

export const markAllAsReadApi = async (): Promise<{ updated: boolean }> => {
  const response = await api.patch<{ data: { updated: boolean } }>(ENDPOINTS.NOTIFICATIONS.READ_ALL);
  return response.data.data;
};

export const deleteNotificationApi = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.NOTIFICATIONS.DETAIL(id));
};
