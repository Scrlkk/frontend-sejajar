export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  USERS: {
    BASE: '/api/users',
    DETAIL: (id: number) => `/api/users/${id}`,
    RESTORE: (id: number) => `/api/users/${id}/restore`,
  },
  CLIENTS: {
    BASE: '/api/clients',
    DETAIL: (id: number) => `/api/clients/${id}`,
  },
  CONTRACTS: {
    BASE: '/api/contracts',
    DETAIL: (id: number) => `/api/contracts/${id}`,
  },
  CONTENTS: {
    BASE: '/api/contents',
    DETAIL: (id: number) => `/api/contents/${id}`,
    PUBLISH: (id: number) => `/api/contents/${id}/publish`,
    RESTORE: (id: number) => `/api/contents/${id}/restore`,
  },
  TASKS: {
    BASE: '/api/tasks',
    DETAIL: (id: number) => `/api/tasks/${id}`,
  },
  TASK_OUTPUTS: {
    BASE: '/api/task-outputs',
    BY_TASK: (taskId: number) => `/api/task-outputs/task/${taskId}`,
    DETAIL: (id: number) => `/api/task-outputs/${id}`,
  },
  TASK_COMMENTS: {
    BASE: '/api/task-comments',
    BY_TASK: (taskId: number) => `/api/task-comments/task/${taskId}`,
    DETAIL: (id: number) => `/api/task-comments/${id}`,
  },
  REVIEWS: {
    BASE: '/api/reviews',
    BY_CONTENT: (contentId: number) => `/api/reviews/content/${contentId}`,
  },
  PLATFORMS: {
    BASE: '/api/platforms',
    DETAIL: (id: number) => `/api/platforms/${id}`,
  },
  CONTENT_CATEGORIES: {
    BASE: '/api/content-categories',
    DETAIL: (id: number) => `/api/content-categories/${id}`,
  },
  PILLARS: {
    BASE: '/api/pillars',
    DETAIL: (id: number) => `/api/pillars/${id}`,
  },
  ANALYTICS: {
    TOP: '/api/analytics/top',
    BY_CONTENT: (id: number) => `/api/analytics/content/${id}`,
    SUMMARY: (id: number) => `/api/analytics/content/${id}/summary`,
    RECORD: '/api/analytics/engagements',
  },
  PORTFOLIO: {
    BASE: '/api/portfolio',
    DETAIL: (id: number) => `/api/portfolio/${id}`,
  },
  ACTIVITY_LOGS: {
    BASE: '/api/activity-logs',
  },
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    UNREAD_COUNT: '/api/notifications/unread-count',
    READ_ALL: '/api/notifications/read-all',
    DETAIL: (id: number) => `/api/notifications/${id}`,
    READ: (id: number) => `/api/notifications/${id}/read`,
  },
  DASHBOARD: {
    SUMMARY: '/api/dashboard/summary',
    SYSTEM: '/api/dashboard/system',
    CHARTS: '/api/dashboard/charts',
    WIDGETS: (name: string) => `/api/dashboard/widgets/${name}`,
  },
};
