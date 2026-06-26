import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export interface Client {
  id: number;
  client_name: string;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetClientsParams {
  limit?: number;
  offset?: number;
  all?: boolean;
  status?: string;
}

export const getClientsApi = async (params?: GetClientsParams): Promise<Client[]> => {
  const response = await api.get<{ data: Client[] }>(ENDPOINTS.CLIENTS.BASE, {
    params,
  });
  return response.data.data;
};

export const getClientByIdApi = async (id: number): Promise<Client> => {
  const response = await api.get<{ data: Client }>(ENDPOINTS.CLIENTS.DETAIL(id));
  return response.data.data;
};

export const createClientApi = async (data: Omit<Client, 'id' | 'is_active'>): Promise<Client> => {
  const response = await api.post<{ data: Client }>(ENDPOINTS.CLIENTS.BASE, data);
  return response.data.data;
};

export const updateClientApi = async (id: number, data: Partial<Omit<Client, 'id' | 'is_active'>>): Promise<Client> => {
  const response = await api.put<{ data: Client }>(ENDPOINTS.CLIENTS.DETAIL(id), data);
  return response.data.data;
};

export const deleteClientApi = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.CLIENTS.DETAIL(id));
};

export const restoreClientApi = async (id: number): Promise<void> => {
  await api.post<void>(`${ENDPOINTS.CLIENTS.DETAIL(id)}/restore`);
};
