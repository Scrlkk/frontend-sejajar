import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export interface ContentCategory {
  id: number;
  type_name: string;
  color_key?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetContentCategoriesParams {
  limit?: number;
  offset?: number;
  include_inactive?: boolean;
}

export const getContentCategoriesApi = async (params?: GetContentCategoriesParams): Promise<ContentCategory[]> => {
  const response = await api.get<{ data: ContentCategory[] }>(ENDPOINTS.CONTENT_CATEGORIES.BASE, {
    params: {
      ...params,
      include_inactive: params?.include_inactive?.toString(),
    },
  });
  return response.data.data;
};

export const createContentCategoryApi = async (data: { type_name: string; color_key?: string | null }): Promise<ContentCategory> => {
  const response = await api.post<{ data: ContentCategory }>(ENDPOINTS.CONTENT_CATEGORIES.BASE, data);
  return response.data.data;
};

export const updateContentCategoryApi = async (
  id: number,
  data: { type_name?: string; is_active?: boolean; color_key?: string | null }
): Promise<ContentCategory> => {
  const response = await api.put<{ data: ContentCategory }>(ENDPOINTS.CONTENT_CATEGORIES.DETAIL(id), data);
  return response.data.data;
};

export const deleteContentCategoryApi = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.CONTENT_CATEGORIES.DETAIL(id));
};
