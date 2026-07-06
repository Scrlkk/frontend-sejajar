import type { ContentStatusType } from "@/features/contents/constants/status";

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
}

export interface TeamMember {
  name: string;
  initials: string;
  avatarBg: string;
  role?: string;
}

export interface ContentPlanCardItem {
  id: string;
  contractId?: number;
  title: string;
  category: string;
  categoryBg?: string;
  categoryColorKey?: string | null;
  platform: string;
  platformColorKey?: string | null;
  format: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  overdue?: boolean;
  feedback?: string;
  assignedTeam?: TeamMember[];
  status: ContentStatusType;
  objective?: string;
  targetAudience?: string;
  pillar?: string;
  pillars?: ContentPillar[];
  notes?: string;
  tasks?: Record<number, { title: string; description: string; deadline?: string | null }>;
  taskStats?: {
    total: number;
    approved: number;
    pending: number;
  };
  fileUrl?: string;
}
