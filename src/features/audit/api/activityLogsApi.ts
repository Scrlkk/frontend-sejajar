import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export interface ActivityLog {
  id: number;
  user_id: number;
  user_name: string | null;
  action: string;
  table_name: string;
  record_id: number;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  entity_name: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export const getActivityLogsApi = async (
  params?: {
    limit?: number;
    offset?: number;
    user_id?: number;
    action?: string;
    table_name?: string;
    record_id?: number;
  }
): Promise<ActivityLog[]> => {
  const response = await api.get<{ data: ActivityLog[] }>(ENDPOINTS.ACTIVITY_LOGS.BASE, {
    params,
  });
  return response.data.data;
};
