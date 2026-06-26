import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

import { getInitials, getAvatarBg, getRoleBg } from '@/utils/formatter';
import { formatDate } from '@/utils/helpers';
import { getRoleLabel } from '../constants/roleColors';

export interface User {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  roles: string[];
  role: string; // primary role
}

export interface UserData {
  id: number;
  name: string;
  initials: string;
  role: string;
  email: string;
  tasks: number;
  joined: string;
  status: string;
  avatarBg: string;
  roleBg: string;
}

export const mapUserToUserData = (user: User): UserData => {
  const displayRoles = user.roles.map(getRoleLabel).join(', ');
  return {
    id: user.id,
    name: user.full_name,
    initials: getInitials(user.full_name),
    role: displayRoles,
    email: user.email,
    tasks: 0,
    joined: formatDate(user.created_at),
    status: user.is_active ? 'active' : 'inactive',
    avatarBg: getAvatarBg(user.full_name),
    roleBg: getRoleBg(user.role),
  };
};

export interface GetUsersParams {
  limit?: number;
  offset?: number;
  all?: boolean;
}

export const getUsersApi = async (params?: GetUsersParams): Promise<User[]> => {
  const response = await api.get<{ data: User[] }>(ENDPOINTS.USERS.BASE, {
    params,
  });
  return response.data.data;
};

export const getUserByIdApi = async (id: number): Promise<User> => {
  const response = await api.get<{ data: User }>(ENDPOINTS.USERS.DETAIL(id));
  return response.data.data;
};

export const createUserApi = async (data: {
  full_name: string;
  email: string;
  password?: string;
  roles: string[];
}): Promise<User> => {
  const response = await api.post<{ data: User }>(ENDPOINTS.USERS.BASE, data);
  return response.data.data;
};

export const updateUserApi = async (
  id: number,
  data: {
    full_name?: string;
    email?: string;
    password?: string;
    roles?: string[];
  }
): Promise<User> => {
  const response = await api.put<{ data: User }>(ENDPOINTS.USERS.DETAIL(id), data);
  return response.data.data;
};

export const deactivateUserApi = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.USERS.DETAIL(id));
};

export const restoreUserApi = async (id: number): Promise<User> => {
  const response = await api.post<{ data: User }>(ENDPOINTS.USERS.RESTORE(id));
  return response.data.data;
};
