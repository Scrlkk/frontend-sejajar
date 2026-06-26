import { api } from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export const getDashboardWidgetApi = async <T = unknown>(
  name: string,
  params?: Record<string, unknown>
): Promise<T> => {
  const response = await api.get<{ data: T }>(ENDPOINTS.DASHBOARD.WIDGETS(name), {
    params,
  });
  return response.data.data;
};

export const getDashboardChartsApi = async <T = unknown>(
  params: {
    metric: string;
    from?: string;
    to?: string;
    limit?: number;
    chartMetric?: string;
    granularity?: string;
  }
): Promise<T> => {
  const response = await api.get<{ data: T }>(ENDPOINTS.DASHBOARD.CHARTS, {
    params,
  });
  return response.data.data;
};

export const getDashboardSummaryApi = async <T = unknown>(): Promise<T> => {
  const response = await api.get<{ data: T }>(ENDPOINTS.DASHBOARD.SUMMARY);
  return response.data.data;
};

export const getDashboardSystemApi = async <T = unknown>(): Promise<T> => {
  const response = await api.get<{ data: T }>(ENDPOINTS.DASHBOARD.SYSTEM);
  return response.data.data;
};

