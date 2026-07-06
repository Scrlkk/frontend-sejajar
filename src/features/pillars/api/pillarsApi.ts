import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

import type { Pillar, GetPillarsParams } from '../types';
export type { Pillar, GetPillarsParams };

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
