export const taskBoardColumns = [
  { key: 'to_do' as const,       label: 'TO DO',       dotColor: 'bg-gray-500' },
  { key: 'on_progress' as const, label: 'ON PROGRESS', dotColor: 'bg-amber-500' },
  { key: 'pending' as const,     label: 'REVIEW',     dotColor: 'bg-purple-500' },
  { key: 'revision' as const,    label: 'REVISION',    dotColor: 'bg-red-500' },
  { key: 'approved' as const,    label: 'APPROVED',    dotColor: 'bg-emerald-500' },
];
