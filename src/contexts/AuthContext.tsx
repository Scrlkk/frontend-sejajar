import React, { createContext } from 'react';
import type { AuthenticatedUser } from '@/utils/permissions';
import type { LoginRequest } from '@/features/auth/api/authApi';

export interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<AuthenticatedUser>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AuthenticatedUser | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
