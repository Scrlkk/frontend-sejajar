export const TASK_STATUS = {
  TO_DO: "to_do",
  ON_PROGRESS: "on_progress",
  PENDING: "pending",
  REVIEW: "review",
  REVISION: "revision",
  APPROVED: "approved",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
} as const;

export type TaskStatusType = typeof TASK_STATUS[keyof typeof TASK_STATUS];
