export const TASK_STATUS = [
  'to_do',
  'on_progress',
  'review',
  'revision',
  'approved',
  'scheduled',
  'published',
  'overdue',
] as const;

export const CONTENT_STATUS = [
  'draft',
  'assigned',
  'on_progress',
  'review',
  'revision',
  'approved',
  'published',
  'overdue',
] as const;

export const CONTRACT_STATUS = ['active', 'completed', 'cancelled', 'overdue'] as const;

export const CONTENT_PRIORITY = ['low', 'medium', 'high'] as const;
