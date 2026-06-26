export const ROLE_COLORS: Record<string, { fill: string; badge: string }> = {
  superadmin:         { fill: '#ef4444', badge: 'bg-red-50 text-red-600 hover:bg-red-50' },
  owner:              { fill: '#f59e0b', badge: 'bg-amber-50 text-amber-600 hover:bg-amber-50' },
  content_lead:       { fill: '#3b82f6', badge: 'bg-blue-50 text-blue-600 hover:bg-blue-50' },
  content_editor:     { fill: '#ec4899', badge: 'bg-pink-50 text-pink-500 hover:bg-pink-50' },
  script_writer:      { fill: '#8b5cf6', badge: 'bg-purple-50 text-purple-600 hover:bg-purple-50' },
  admin_social_media: { fill: '#10b981', badge: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50' },
};

export const getRoleBg = (role: string) => ROLE_COLORS[role]?.badge ?? 'bg-gray-50 text-gray-600';

export const ROLE_LABELS: Record<string, string> = {
  superadmin: 'Super Admin',
  owner: 'Owner',
  content_lead: 'Content Lead',
  content_editor: 'Editor',
  script_writer: 'Script Writer',
  admin_social_media: 'Admin Social Media',
};
export const getRoleLabel = (role: string) => ROLE_LABELS[role] ?? role;

export const FORM_TO_API_ROLE: Record<string, string> = {
  Owner: "owner",
  "Content Lead": "content_lead",
  "Admin Social Media": "admin_social_media",
  "Content Editor": "content_editor",
  "Script Writer": "script_writer",
};

export const ROLE_VISUALS: Record<string, { avatarBg: string; roleBg: string }> = {
  "Owner": {
    avatarBg: "bg-amber-50 text-amber-600",
    roleBg: "bg-amber-50 text-amber-600 hover:bg-amber-50",
  },
  "Content Lead": {
    avatarBg: "bg-blue-50 text-blue-600",
    roleBg: "bg-blue-50 text-blue-600 hover:bg-blue-50",
  },
  "Admin Social Media": {
    avatarBg: "bg-emerald-50 text-emerald-600",
    roleBg: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
  },
  "Content Editor": {
    avatarBg: "bg-pink-50 text-pink-600",
    roleBg: "bg-pink-50 text-pink-500 hover:bg-pink-50",
  },
  "Editor": {
    avatarBg: "bg-pink-50 text-pink-600",
    roleBg: "bg-pink-50 text-pink-500 hover:bg-pink-50",
  },
  "Script Writer": {
    avatarBg: "bg-purple-50 text-purple-600",
    roleBg: "bg-purple-50 text-purple-600 hover:bg-purple-50",
  },
  "Super Admin": {
    avatarBg: "bg-red-50 text-red-600",
    roleBg: "bg-red-50 text-red-600 hover:bg-red-50",
  },
  "Superadmin": {
    avatarBg: "bg-red-50 text-red-600",
    roleBg: "bg-red-50 text-red-600 hover:bg-red-50",
  },
};

export const getRoleVisuals = (roleName: string) =>
  ROLE_VISUALS[roleName] ?? {
    avatarBg: "bg-gray-50 text-gray-600",
    roleBg: "bg-gray-50 text-gray-500 hover:bg-gray-50",
  };

