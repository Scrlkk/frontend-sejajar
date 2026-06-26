import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export interface ContentReview {
  id: number;
  content_id: number;
  reviewer_id: number;
  reviewer_name: string;
  feedback: string;
  created_at: string;
  updated_at: string;
}

export interface GetReviewsParams {
  limit?: number;
  offset?: number;
}

export const getReviewsByContentApi = async (
  contentId: number,
  params?: GetReviewsParams
): Promise<ContentReview[]> => {
  const response = await api.get<{ data: ContentReview[] }>(
    ENDPOINTS.REVIEWS.BY_CONTENT(contentId),
    { params }
  );
  return response.data.data;
};

export const createReviewApi = async (payload: {
  content_id: number;
  feedback: string;
}): Promise<ContentReview> => {
  const response = await api.post<{ data: ContentReview }>(
    ENDPOINTS.REVIEWS.BASE,
    payload
  );
  return response.data.data;
};
