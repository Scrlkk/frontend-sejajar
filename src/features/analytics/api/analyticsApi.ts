import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export interface TopContent {
  id: number;
  title: string;
  contract_id: number;
  contract_name: string;
  status: string;
  platform_id?: number;
  platform_name?: string;
  last_updated?: string | null;
  total_views: string | number;
  total_likes: string | number;
  total_comments: string | number;
  total_shares: string | number;
}

export interface ContentEngagement {
  id: number;
  content_id: number;
  likes: number;
  views: number;
  comments: number;
  shares: number;
  recorded_at: string;
}

export interface EngagementSummary {
  content_id: number;
  total_likes: string | number;
  total_views: string | number;
  total_comments: string | number;
  total_shares: string | number;
  total_records: string | number;
  first_recorded: string;
  last_recorded: string;
}

export interface RecordEngagementPayload {
  content_id: number;
  likes?: number;
  views?: number;
  comments?: number;
  shares?: number;
  recorded_at?: string;
}

export const getTopContentsApi = async (params?: {
  limit?: number;
  contract_id?: number;
}): Promise<TopContent[]> => {
  const response = await api.get<{ data: TopContent[] }>(
    ENDPOINTS.ANALYTICS.TOP,
    { params }
  );
  return response.data.data;
};

export const getEngagementByContentApi = async (
  contentId: number,
  params?: { limit?: number; offset?: number }
): Promise<ContentEngagement[]> => {
  const response = await api.get<{ data: ContentEngagement[] }>(
    ENDPOINTS.ANALYTICS.BY_CONTENT(contentId),
    { params }
  );
  return response.data.data;
};

export const getEngagementSummaryApi = async (
  contentId: number
): Promise<EngagementSummary> => {
  const response = await api.get<{ data: EngagementSummary }>(
    ENDPOINTS.ANALYTICS.SUMMARY(contentId)
  );
  return response.data.data;
};

export const recordEngagementApi = async (
  payload: RecordEngagementPayload
): Promise<ContentEngagement> => {
  const response = await api.post<{ data: ContentEngagement }>(
    ENDPOINTS.ANALYTICS.RECORD,
    payload
  );
  return response.data.data;
};

export const deleteEngagementApi = async (
  contentId: number
): Promise<void> => {
  await api.delete(`${ENDPOINTS.ANALYTICS.BY_CONTENT(contentId)}`);
};

