export const TASK_STATUS_CONFIG: Record<string, { bg: string, dot: string, label: string }> = {
  to_do:      { bg: 'bg-gray-50 text-gray-600 hover:bg-gray-50',         dot: 'bg-gray-600',    label: 'To Do' },
  on_progress:{ bg: 'bg-amber-50 text-amber-600 hover:bg-amber-50',      dot: 'bg-amber-500',   label: 'On Progress' },
  pending:    { bg: 'bg-purple-50 text-purple-600 hover:bg-purple-50',   dot: 'bg-purple-500',  label: 'Review' },
  review:     { bg: 'bg-purple-50 text-purple-600 hover:bg-purple-50',   dot: 'bg-purple-500',  label: 'Review' },
  revision:   { bg: 'bg-red-50 text-red-600 hover:bg-red-50',            dot: 'bg-red-500',     label: 'Revision' },
  approved:   { bg: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50',dot: 'bg-emerald-500', label: 'Approved' },
  scheduled:  { bg: 'bg-blue-50 text-blue-600 hover:bg-blue-50',         dot: 'bg-blue-500',    label: 'Scheduled' },
  published:  { bg: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-50',         dot: 'bg-cyan-500',    label: 'Published' },
  overdue:    { bg: 'bg-red-100 text-red-700 hover:bg-red-100',          dot: 'bg-red-600',     label: 'Overdue' },
};

export const getTaskStatusConfig = (s: string) => {
  const normalized = s?.toLowerCase() || 'to_do';
  return TASK_STATUS_CONFIG[normalized] ?? TASK_STATUS_CONFIG['to_do'];
};
