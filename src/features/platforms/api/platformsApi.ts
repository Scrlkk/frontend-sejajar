import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export interface Platform {
  id: number;
  platform_name: string;
  is_active: boolean;
  color_key?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GetPlatformsParams {
  limit?: number;
  offset?: number;
  include_inactive?: boolean;
}

export const getPlatformsApi = async (params?: GetPlatformsParams): Promise<Platform[]> => {
  const response = await api.get<{ data: Platform[] }>(ENDPOINTS.PLATFORMS.BASE, {
    params: {
      ...params,
      include_inactive: params?.include_inactive?.toString(),
    },
  });
  return response.data.data;
};

export const createPlatformApi = async (data: { platform_name: string; color_key?: string | null }): Promise<Platform> => {
  const response = await api.post<{ data: Platform }>(ENDPOINTS.PLATFORMS.BASE, data);
  return response.data.data;
};

export const updatePlatformApi = async (id: number, data: { platform_name?: string; is_active?: boolean; color_key?: string | null }): Promise<Platform> => {
  const response = await api.put<{ data: Platform }>(ENDPOINTS.PLATFORMS.DETAIL(id), data);
  return response.data.data;
};

export const deletePlatformApi = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.PLATFORMS.DETAIL(id));
};

