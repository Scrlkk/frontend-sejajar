export const CONTENT_STATUS = {
  DRAFT: "Draft",
  ASSIGNED: "Assigned",
  ON_PROGRESS: "On Progress",
  REVIEW: "Review",
  REVISION: "Revision",
  APPROVED: "Approved",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  DELETED: "Deleted",
} as const;

export type ContentStatusType = typeof CONTENT_STATUS[keyof typeof CONTENT_STATUS];
