export const ACTION_CONFIG: Record<string, { bg: string, label: string }> = {
  CREATE:  { bg: 'bg-pink-100 text-pink-600 hover:bg-pink-100',     label: 'CREATE' },
  UPDATE:  { bg: 'bg-amber-100 text-amber-700 hover:bg-amber-100',  label: 'UPDATE' },
  DELETE:  { bg: 'bg-red-100 text-red-700 hover:bg-red-100',        label: 'DELETE' },
  PUBLISH: { bg: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100', label: 'PUBLISH' },
  LOGIN:   { bg: 'bg-blue-100 text-blue-700 hover:bg-blue-100',     label: 'LOGIN' },
  LOGOUT:  { bg: 'bg-gray-100 text-gray-700 hover:bg-gray-100',     label: 'LOGOUT' },
};

export const getActionConfig = (action: string) =>
  ACTION_CONFIG[action] ?? ACTION_CONFIG['UPDATE'];

export const getActionBg = (action: string) =>
  getActionConfig(action).bg;
