import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/utils/permissions';

export const GuestRoute: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-logo border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    const role: UserRole = user.role;
    switch (role) {
      case 'superadmin':
        return <Navigate to="/dashboard/superadmin" replace />;
      case 'admin_social_media':
        return <Navigate to="/dashboard/social-media" replace />;
      case 'content_lead':
        return <Navigate to="/dashboard/content-lead" replace />;
      case 'owner':
        return <Navigate to="/dashboard/owner" replace />;
      case 'script_writer':
        return <Navigate to="/dashboard/script-writer" replace />;
      case 'content_editor':
        return <Navigate to="/dashboard/content-editor" replace />;
      default:
        return <Navigate to="/dashboard/content-editor" replace />;
    }
  }

  return <Outlet />;
};
