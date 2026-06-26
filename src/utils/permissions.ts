export type UserRole =
  | 'superadmin'
  | 'owner'
  | 'content_lead'
  | 'content_editor'
  | 'script_writer'
  | 'admin_social_media';

export interface AuthenticatedUser {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  roles: UserRole[];
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  superadmin: 6,
  owner: 5,
  content_lead: 4,
  content_editor: 3,
  script_writer: 3,
  admin_social_media: 3,
};

export const hasRole = (userRoles: UserRole[], required: UserRole[]) =>
  required.some((r) => userRoles.includes(r));
