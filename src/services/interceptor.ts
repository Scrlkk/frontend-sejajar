import axios from 'axios';
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
  // Request Interceptor
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

  // Response Interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      console.log("[Axios Interceptor Error]:", {
        url: originalRequest?.url,
        status: error.response?.status,
        ends_with_login: originalRequest?.url?.endsWith(ENDPOINTS.AUTH.LOGIN),
      });

      // 1. Handle 429 Too Many Requests
      if (error.response?.status === 429) {
        const retryAfterHeader = error.response.headers['retry-after'];
        const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 0;

        // Dispatch CustomEvent to be consumed by useRateLimit hook in Phase 3
        const rateLimitEvent = new CustomEvent('api-rate-limit', {
          detail: { retryAfter },
        });
        window.dispatchEvent(rateLimitEvent);

        return Promise.reject(error);
      }

      // 2. Handle 401 Unauthorized (exclude Login endpoint)
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/login')
      ) {
        // If the refresh request itself fails with 401, clear all and redirect
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
          // Use plain axios instance to avoid circular calls with the interceptor api instance
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}${ENDPOINTS.AUTH.REFRESH}`,
            { refresh_token: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          // Access nested data.data as per response wrapper schema from backend:
          // { status: "success", message: "...", data: { accessToken, refreshToken } }
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
          storage.clearAll();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
