export const TASK_TYPE_CONFIG: Record<string, { label: "Script" | "Production" | "Editor" | "Caption", bg: string }> = {
  script_writer:      { label: 'Script',  bg: 'bg-amber-100 text-amber-700' },
  content_editor:     { label: 'Editor',  bg: 'bg-red-100 text-red-700' },
  admin_social_media: { label: 'Caption', bg: 'bg-violet-100 text-violet-600' },
  content_lead:       { label: 'Production', bg: 'bg-blue-100 text-blue-700' },
  superadmin:         { label: 'Production', bg: 'bg-blue-100 text-blue-700' },
  owner:              { label: 'Production', bg: 'bg-blue-100 text-blue-700' },
};

export const getTaskTypeConfig = (role: string) => {
  const norm = role?.toLowerCase() || 'content_editor';
  return TASK_TYPE_CONFIG[norm] ?? { label: 'Production' as const, bg: 'bg-blue-100 text-blue-700' };
};
