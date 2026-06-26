export const CONTENT_STATUS_CONFIG: Record<string, { bg: string, dot: string, label: string }> = {
  draft:      { bg: 'bg-gray-150 text-gray-600 border border-gray-200', dot: 'bg-gray-400', label: 'Draft' },
  assigned:   { bg: 'bg-blue-50 text-blue-600 border border-blue-100', dot: 'bg-blue-500', label: 'Assigned' },
  on_progress: { bg: 'bg-amber-50 text-amber-600 border border-amber-100', dot: 'bg-amber-500', label: 'On Progress' },
  review:     { bg: 'bg-purple-50 text-purple-600 border border-purple-100', dot: 'bg-purple-500', label: 'Review' },
  revision:   { bg: 'bg-red-50 text-red-600 border border-red-100', dot: 'bg-red-500', label: 'Revision' },
  approved:   { bg: 'bg-emerald-50 text-emerald-600 border border-emerald-100', dot: 'bg-emerald-500', label: 'Approved' },
  published:  { bg: 'bg-cyan-50 text-cyan-700 border border-cyan-150', dot: 'bg-cyan-500', label: 'Published' },
  overdue:    { bg: 'bg-red-100 text-red-700 border border-red-200', dot: 'bg-red-600', label: 'Overdue' },
};

export const getContentStatusConfig = (s: string): { bg: string, dot: string, label: string } => {
  const normalized = s.toLowerCase().replace(' ', '_');
  return CONTENT_STATUS_CONFIG[normalized] ?? CONTENT_STATUS_CONFIG['draft'];
};
