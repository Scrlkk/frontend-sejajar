import { api } from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { Content, ContentPillar, ContentTeamUser, GetContentsParams, ContentPlanCardItem } from '../types';
export type { Content, ContentPillar, ContentTeamUser, GetContentsParams, ContentPlanCardItem };
import { getCategoryBg } from "../constants/categoryConfig";
import { formatDateLongEN } from "@/utils/helpers";

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
    dueDate: formatDateLongEN(c.due_date),
    overdue: c.due_date
      ? new Date(c.due_date) < new Date() &&
        !["published", "scheduled"].includes(c.status.toLowerCase())
      : false,
    feedback: c.latest_feedback || undefined,
    assignedTeam,
    status: formatStatus(c.status, c.is_active, c.deleted_at),
    objective: c.objective || "",
    targetAudience: c.target_audience || "",
    pillar: firstPillarName,
    pillars: pillarsArray,
    notes: c.description || "",
    fileUrl: c.content_url || "",
    tasks,
  };
};
