import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { hasRole, type UserRole } from '@/utils/permissions';
import { NotFound } from '@/layouts/NotFound';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-logo border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const isAllowed = hasRole(user.roles, allowedRoles);

  if (!isAllowed) {
    return (
      <div className="fixed inset-0 z-9999 overflow-auto">
        <NotFound />
      </div>
    );
  }

  return <Outlet />;
};
