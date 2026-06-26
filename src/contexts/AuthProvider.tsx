import React, { useState, useEffect } from 'react';
import { storage } from '@/utils/storage';
import { getMeApi, loginApi, logoutApi, type LoginRequest } from '@/features/auth/api/authApi';
import type { AuthenticatedUser } from '@/utils/permissions';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(() => storage.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!storage.getAccessToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = storage.getAccessToken();
      if (token) {
        try {
          const currentUser = await getMeApi();
          setUser(currentUser);
          storage.setUser(currentUser);
          setIsAuthenticated(true);
        } catch {
          // If loading current user fails, check if the interceptor was able to refresh token
          const freshToken = storage.getAccessToken();
          if (!freshToken) {
            setUser(null);
            setIsAuthenticated(false);
          } else {
            // Interceptor resolved it, let's try one more time to fetch user profile
            try {
              const retryUser = await getMeApi();
              setUser(retryUser);
              storage.setUser(retryUser);
              setIsAuthenticated(true);
            } catch {
              storage.clearAll();
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest): Promise<AuthenticatedUser> => {
    try {
      const response = await loginApi(data);
      storage.setTokens(response.accessToken, response.refreshToken);
      storage.setUser(response.user);
      setUser(response.user);
      setIsAuthenticated(true);
      return response.user;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      storage.clearAll();
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = storage.getRefreshToken();
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      storage.clearAll();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
