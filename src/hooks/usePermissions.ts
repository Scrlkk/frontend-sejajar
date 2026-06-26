import { useAuth } from '@/hooks/useAuth';
import { hasRole, type UserRole } from '@/utils/permissions';

export const usePermissions = () => {
  const { user } = useAuth();

  const can = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    return hasRole(user.roles, requiredRoles);
  };

  const isAdmin = user?.roles.includes('superadmin') || false;
  const isOwner = user?.roles.includes('owner') || false;
  const isCreatorOrAdmin = user?.roles.some(r => ['superadmin', 'content_lead', 'content_editor', 'script_writer', 'admin_social_media'].includes(r)) || false;
  const isClient = isOwner && !isCreatorOrAdmin;

  return {
    can,
    isAdmin,
    isClient,
    roles: user?.roles || [],
    primaryRole: user?.role || null,
  };
};
