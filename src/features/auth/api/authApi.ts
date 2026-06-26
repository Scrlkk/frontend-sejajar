import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import type { AuthenticatedUser } from '@/utils/permissions';

export interface LoginResponse {
  user: AuthenticatedUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<{ data: LoginResponse }>(ENDPOINTS.AUTH.LOGIN, data);
  return response.data.data;
};

export const refreshTokenApi = async (refresh_token: string): Promise<RefreshResponse> => {
  const response = await api.post<{ data: RefreshResponse }>(ENDPOINTS.AUTH.REFRESH, {
    refresh_token,
  });
  return response.data.data;
};

export const logoutApi = async (refresh_token: string): Promise<void> => {
  await api.post(ENDPOINTS.AUTH.LOGOUT, { refresh_token });
};

export const getMeApi = async (): Promise<AuthenticatedUser> => {
  const response = await api.get<{ data: AuthenticatedUser }>(ENDPOINTS.AUTH.ME);
  return response.data.data;
};
