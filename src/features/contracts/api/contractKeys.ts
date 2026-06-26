/**
 * Query Key Factory for contracts and related data.
 * Helps prevent typos, standardize invalidations, and structure caching keys.
 */
export const contractKeys = {
  all: ["contracts"] as const,
  lists: () => [...contractKeys.all, "list"] as const,
  list: (status: "active" | "deleted") => [...contractKeys.all, status] as const,
  details: () => ["contract"] as const,
  detail: (id: number | string) => [...contractKeys.details(), id] as const,
};

export const clientKeys = {
  all: ["clients"] as const,
  details: () => ["client"] as const,
  detail: (id?: number) => [...clientKeys.details(), id] as const,
};

export const userKeys = {
  all: ["users"] as const,
};

export const platformKeys = {
  all: ["platforms"] as const,
  active: () => ["platforms-active"] as const,
};

export const contentKeys = {
  all: ["contents"] as const,
  byFilter: (filter: object) => [...contentKeys.all, filter] as const,
};
