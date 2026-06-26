import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { ContentPlanCardItem } from "../components/ContentPlan";
import { getCategoryBg } from "../constants/categoryConfig";

export interface ContentTeamUser {
  id: number;
  full_name: string;
  roles: string[];
  is_online?: boolean;
}

export interface ContentPillar {
  id: number;
  pillar_name: string;
  color_key?: string | null;
}

export interface Content {
  id: number;
  contract_id: number;
  contract_name?: string;
  contract_code?: string;
  platform_id: number;
  platform_name?: string;
  platform_color_key?: string | null;
  content_category_id: number;
  category_name?: string;
  category_color_key?: string | null;
  /** Array of pillars — replaces single pillar_id/pillar_name */
  pillars: ContentPillar[];
  title: string;
  content_url?: string | null;
  description?: string | null;
  objective?: string | null;
  target_audience?: string | null;
  due_date?: string | null;
  scheduled_at?: string | null;
  priority: string;
  status: string;
  published_at?: string | null;
  created_at: string;
  updated_at?: string;
  latest_feedback?: string | null;
  is_active?: boolean;
  deleted_at?: string | null;
  format?: string | null;
  teams?: ContentTeamUser[];
}

export interface GetContentsParams {
  limit?: number;
  offset?: number;
  contract_id?: number;
  status?: string;
  platform_id?: number;
  content_category_id?: number;
  pillar_id?: number;
  priority?: string;
}

export interface CreateContentPayload {
  contract_id: number;
  platform_id: number;
  content_category_id: number;
  /** Array of pillar IDs — at least one required */
  pillar_ids: number[];
  title: string;
  content_url?: string;
  description?: string;
  objective?: string;
  target_audience?: string;
  due_date?: string;
  priority: string;
  format?: string;
  team_user_ids?: number[];
}

export interface UpdateContentPayload {
  title?: string;
  platform_id?: number;
  content_category_id?: number;
  /** Array of pillar IDs to replace existing pillars */
  pillar_ids?: number[];
  content_url?: string;
  description?: string;
  objective?: string;
  target_audience?: string;
  due_date?: string;
  scheduled_at?: string;
  priority?: string;
  status?: string;
  format?: string;
  team_user_ids?: number[];
}

export const getContentsApi = async (
  params?: GetContentsParams,
): Promise<Content[]> => {
  const response = await api.get<{ data: Content[] }>(ENDPOINTS.CONTENTS.BASE, {
    params,
  });
  return response.data.data;
};

export const getContentByIdApi = async (id: number): Promise<Content> => {
  const response = await api.get<{ data: Content }>(
    ENDPOINTS.CONTENTS.DETAIL(id),
  );
  return response.data.data;
};

export const createContentApi = async (
  data: CreateContentPayload,
): Promise<Content> => {
  const response = await api.post<{ data: Content }>(
    ENDPOINTS.CONTENTS.BASE,
    data,
  );
  return response.data.data;
};

export const updateContentApi = async (
  id: number,
  data: UpdateContentPayload,
): Promise<Content> => {
  const response = await api.put<{ data: Content }>(
    ENDPOINTS.CONTENTS.DETAIL(id),
    data,
  );
  return response.data.data;
};

export const publishContentApi = async (id: number): Promise<Content> => {
  const response = await api.patch<{ data: Content }>(
    ENDPOINTS.CONTENTS.PUBLISH(id),
  );
  return response.data.data;
};

export const deleteContentApi = async (id: number): Promise<void> => {
  await api.delete(ENDPOINTS.CONTENTS.DETAIL(id));
};

export const restoreContentApi = async (id: number): Promise<Content> => {
  const response = await api.post<{ data: Content }>(
    ENDPOINTS.CONTENTS.RESTORE(id),
  );
  return response.data.data;
};

export const mapContentToCardItem = (
  c: Content,
  assignedTeam: ContentPlanCardItem["assignedTeam"] = [],
  tasks?: ContentPlanCardItem["tasks"],
): ContentPlanCardItem => {
  // Map standard priority & status to capitalization expected by UI
  const formatPriority = (p: string): "High" | "Medium" | "Low" => {
    const norm = p.toLowerCase();
    if (norm === "high") return "High";
    if (norm === "low") return "Low";
    return "Medium";
  };

  const formatStatus = (
    s: string,
    is_active?: boolean,
    deleted_at?: string | null,
  ): ContentPlanCardItem["status"] => {
    if (is_active === false || deleted_at) return "Deleted";
    const norm = s.toLowerCase();
    if (norm === "draft") return "Draft";
    if (norm === "assigned") return "Assigned";
    if (norm === "on_progress") return "On Progress";
    if (norm === "review") return "Review";
    if (norm === "revision") return "Revision";
    if (norm === "approved") return "Approved";
    if (norm === "scheduled") return "Scheduled";
    if (norm === "published") return "Published";
    return "Draft";
  };

  const pillarsArray: ContentPillar[] = Array.isArray(c.pillars) ? c.pillars : [];
  // Use first pillar name for backward-compatible `pillar` field & categoryBg
  const firstPillarName = pillarsArray[0]?.pillar_name || "";

  return {
    id: String(c.id),
    contractId: c.contract_id,
    title: c.title,
    category: c.category_name || "tutorial",
    categoryBg: getCategoryBg(firstPillarName),
    categoryColorKey: c.category_color_key,
    platform: c.platform_name || "Instagram",
    platformColorKey: c.platform_color_key,
    format: c.format || "Video",
    priority: formatPriority(c.priority),
    dueDate: c.due_date
      ? new Date(c.due_date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "",
    overdue: c.due_date
      ? new Date(c.due_date) < new Date() &&
        !["published", "scheduled"].includes(c.status.toLowerCase())
      : false,
    feedback: c.latest_feedback || undefined,
    assignedTeam,
    status: formatStatus(c.status, c.is_active, c.deleted_at),
    objective: c.objective || "",
    targetAudience: c.target_audience || "",
    // Backward compat: first pillar name
    pillar: firstPillarName,
    // Full pillars array for multi-pillar UI
    pillars: pillarsArray,
    notes: c.description || "",
    fileUrl: c.content_url || "",
    tasks,
  };
};
