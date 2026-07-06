export interface Pillar {
  id: number;
  pillar_name: string;
  description?: string;
  color_key?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetPillarsParams {
  limit?: number;
  offset?: number;
  include_inactive?: boolean;
}
