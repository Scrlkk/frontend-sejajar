import axios from 'axios';
import toast from 'react-hot-toast';
import { api } from './api';
import { storage } from '../utils/storage';
import { ENDPOINTS } from './endpoints';

interface FailedRequestPromise {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequestPromise[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupInterceptors = () => {
  api.interceptors.request.use(
    (config) => {
      const accessToken = storage.getAccessToken();
      if (accessToken && config.headers) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      console.log("[Axios Interceptor Error]:", {
        url: originalRequest?.url,
        status: error.response?.status,
        ends_with_login: originalRequest?.url?.endsWith(ENDPOINTS.AUTH.LOGIN),
      });

      if (error.response?.status === 429) {
        const retryAfterHeader = error.response.headers['retry-after'];
        const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 0;

        const rateLimitEvent = new CustomEvent('api-rate-limit', {
          detail: { retryAfter },
        });
        window.dispatchEvent(rateLimitEvent);

        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/login')
      ) {
        if (originalRequest.url?.includes('/auth/refresh')) {
          storage.clearAll();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
              }
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = storage.getRefreshToken();
        if (!refreshToken) {
          storage.clearAll();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}${ENDPOINTS.AUTH.REFRESH}`,
            { refresh_token: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          storage.setTokens(accessToken, newRefreshToken);

          processQueue(null, accessToken);
          isRefreshing = false;

          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          
          if (axios.isAxiosError(refreshError) && refreshError.response?.status === 429) {
            return Promise.reject(refreshError);
          }

          storage.clearAll();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      if (error.response && error.response.status >= 400 && error.response.status !== 401 && error.response.status !== 429) {
        const message = error.response.data?.message || "Terjadi kesalahan pada server.";
        toast.error(message);
      }

      return Promise.reject(error);
    }
  );
};
