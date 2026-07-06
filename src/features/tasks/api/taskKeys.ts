/**
 * Query Key Factory for tasks.
 * Helps prevent typos, standardize invalidations, and structure caching keys.
 */
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filter?: unknown) => [...taskKeys.all, filter].filter(Boolean),
  details: () => ["task"] as const,
  detail: (id: number | string) => [...taskKeys.details(), id] as const,
  outputs: (taskId: number | string) => ["task-outputs", taskId] as const,
  comments: (taskId: number | string) => ["task-comments", taskId] as const,
  siblingOutputs: (contentId: number | string, taskId: number | string) => ["sibling-task-outputs", contentId, taskId] as const,
  allOutputs: (taskIds?: (number | string)[]) => ["all-task-outputs", taskIds].filter(Boolean),
};
