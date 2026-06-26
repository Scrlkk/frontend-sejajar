import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export interface Pillar {
  id: number;
  pillar_name: string;
  description?: string;
  color_key?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetPillarsParams {
  limit?: number;
  offset?: number;
  include_inactive?: boolean;
}

export const getPillarsApi = async (params?: GetPillarsParams): Promise<Pillar[]> => {
  const response = await api.get<{ data: Pillar[] }>(ENDPOINTS.PILLARS.BASE, {
    params: {
      ...params,
      include_inactive: params?.include_inactive?.toString(),
    },
  });
  return response.data.data;
};

export const createPillarApi = async (data: { pillar_name: string; description?: string; color_key?: string | null }): Promise<Pillar> => {
  const response = await api.post<{ data: Pillar }>(ENDPOINTS.PILLARS.BASE, data);
  return response.data.data;
};

export const updatePillarApi = async (id: number, data: { pillar_name?: string; description?: string; is_active?: boolean; color_key?: string | null }): Promise<Pillar> => {
  const response = await api.put<{ data: Pillar }>(ENDPOINTS.PILLARS.DETAIL(id), data);
  return response.data.data;
};

export const deletePillarApi = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.PILLARS.DETAIL(id));
};
