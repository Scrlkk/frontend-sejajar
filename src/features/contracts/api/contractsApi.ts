import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { getContractStatusConfig } from '../constants/statusConfig';
import { formatCurrencyIDR, formatDate } from '@/utils/helpers';
import type { ContractCardItem } from '../components/Contracts';

export interface ContractPlatform {
  id: number;
  platform_name: string;
}

export interface ContractTeamUser {
  id: number;
  full_name: string;
  roles: string[];
  is_online?: boolean;
}

export interface Contract {
  id: number;
  client_id: number;
  contract_code: string;
  contract_name: string;
  description: string;
  start_date: string;
  end_date: string;
  revenue: string;
  status: string;
  created_by: number;
  lead_by: number;
  created_by_name: string;
  lead_by_name: string;
  platforms: ContractPlatform[];
  teams: ContractTeamUser[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  client_name?: string;
  company_name?: string;
}

export interface GetContractsParams {
  limit?: number;
  offset?: number;
  client_id?: number;
  status?: string;
}

export const getContractsApi = async (params?: GetContractsParams): Promise<Contract[]> => {
  const response = await api.get<{ data: Contract[] }>(ENDPOINTS.CONTRACTS.BASE, {
    params,
  });
  return response.data.data;
};

export const getContractByIdApi = async (id: number): Promise<Contract> => {
  const response = await api.get<{ data: Contract }>(ENDPOINTS.CONTRACTS.DETAIL(id));
  return response.data.data;
};

export const createContractApi = async (data: {
  client_id: number;
  contract_code: string;
  contract_name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  revenue?: number;
  lead_by: number;
  platform_ids?: number[];
  team_user_ids?: number[];
}): Promise<Contract> => {
  const response = await api.post<{ data: Contract }>(ENDPOINTS.CONTRACTS.BASE, data);
  return response.data.data;
};

export const updateContractApi = async (
  id: number,
  data: {
    contract_name?: string;
    contract_code?: string;
    description?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    revenue?: number;
    lead_by?: number;
    platform_ids?: number[];
    team_user_ids?: number[];
  }
): Promise<Contract> => {
  const response = await api.put<{ data: Contract }>(ENDPOINTS.CONTRACTS.DETAIL(id), data);
  return response.data.data;
};

export const deleteContractApi = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.CONTRACTS.DETAIL(id));
};

export const restoreContractApi = async (id: number): Promise<void> => {
  await api.post<void>(`${ENDPOINTS.CONTRACTS.DETAIL(id)}/restore`);
};

export interface ContentProgressItem {
  id: number;
  contract_id: number;
  status: string;
}

export const getContentsForProgressApi = async (): Promise<ContentProgressItem[]> => {
  const response = await api.get<{ data: ContentProgressItem[] }>(ENDPOINTS.CONTENTS.BASE, {
    params: { limit: 1000 },
  });
  return response.data.data;
};

export const mapContractToCardItem = (
  c: Contract,
  totalProgress: number = 0,
  currentProgress: number = 0
): ContractCardItem => {
  const isOverdue =
    c.status.toLowerCase() === "active" &&
    c.end_date &&
    new Date(c.end_date) < new Date() &&
    (totalProgress === 0 || currentProgress < totalProgress);

  const statusCfg = getContractStatusConfig(isOverdue ? "overdue" : c.status);
  return {
    id: c.id,
    code: c.contract_code,
    title: c.contract_name,
    brand: c.company_name || c.client_name || '',
    description: c.description || '',
    platforms: c.platforms.map((p) => p.platform_name),
    currentProgress,
    targetProgress: totalProgress,
    startDate: formatDate(c.start_date),
    endDate: formatDate(c.end_date),
    rawStartDate: c.start_date,
    rawEndDate: c.end_date,
    valueAmount: formatCurrencyIDR(Number(c.revenue)),
    value: Number(c.revenue),
    status: statusCfg.label,
    statusBg: statusCfg.bg,
    statusDot: statusCfg.dot,
    createdBy: c.lead_by_name,
    deletedAt: c.is_active ? null : (c.updated_at || new Date().toISOString()),
  };
};
