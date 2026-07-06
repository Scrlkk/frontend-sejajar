import type { ContentPillar } from "@/features/contents/types";
import type { LucideIcon } from "lucide-react";
import type { TaskStatusType } from "@/features/tasks/constants/status";

export interface Task {
  id: number;
  content_id: number;
  assigned_to: number;
  title: string;
  description: string;
  deadline?: string | null;
  status: string;
  is_active: boolean;
  assignee_name: string;
  assignee_roles: string[];
  content_title?: string;
  contract_id?: number;
  contract_name?: string;
  contract_created_by?: number;
  pillar_name?: string;
  platform_name?: string;
  platform_color_key?: string | null;
  category_name?: string;
  lead_name?: string;
  lead_id?: number;
  content_format?: string;
  content_status?: string;
  content_due_date?: string | null;
  content_scheduled_at?: string | null;
  pillars?: ContentPillar[];
  isOverdue?: boolean;
}

export interface CreateTaskPayload {
  content_id: number;
  assigned_to: number;
  title: string;
  description: string;
  deadline?: string;
  status?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  assigned_to?: number;
  deadline?: string;
  status?: string;
}

export interface TaskOutput {
  id: number;
  task_id: number;
  file_url: string;
  caption?: string | null;
  hashtag?: string | null;
  created_at: string;
  updated_at: string;
  version?: number;
  submitted_at?: string;
  file_size?: string | null;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number | null;
  user_name: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCardConfig {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  statusKey?: string | string[];
  isOverdue?: boolean;
}

export interface DeadlineItem {
  id: string | number;
  title: string;
  category: string;
  categoryBg: string;
  categoryDot: string;
  status: string;
  statusBg: string;
  statusDot: string;
  dueDateText: string;
  dueDate?: Date;
}

export interface ScheduledContentItem {
  id: string | number;
  title: string;
  campaign: string;
  platform: string;
  platformColorKey?: string | null;
  platformBg: string;
  pillar: string;
  pillars?: ContentPillar[];
  pillarBg: string;
  pillarDot: string;
  postDate: string;
  time: string;
  status: "Published" | "Approved" | "On Progress" | "Draft" | string;
  statusBg: string;
  statusDot: string;
  hasPublishButton: boolean;
  type?: string;
  caption?: string;
  hashtag?: string;
  postDateRaw?: string;
  file_url?: string;
  content_url?: string;
  content_id?: number;
  publisher_name?: string;
}

export interface TaskCommentItem {
  id: string;
  sender: string;
  senderInitials: string;
  senderBg: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
  isSystem?: boolean;
}

export interface TaskBoardItem {
  id: string | number;
  content_id?: number;
  title: string;
  type: "Script" | "Production" | "Editor" | "Caption";
  typeBg?: string;
  typeIcon?: LucideIcon;
  category: string;
  categoryDot: string;
  categoryBg?: string;
  categoryBorder?: string;
  assignee: string;
  assigneeInitials: string;
  assigneeBg: string;
  assigneeId?: number;
  contractCreatedBy?: number;
  leadId?: number;
  status: TaskStatusType;
  isOverdue: boolean;
  date: Date;
  priority: "low" | "medium" | "high" | "critical";
  description?: string;
  pillar?: string;
  pillars?: ContentPillar[];
  role?: string;
  deliverables?: string[];
  comments?: TaskCommentItem[];
  content_title?: string;
  is_active?: boolean;
  contract_name?: string;
  rolesArray?: string[];
  contentStatus?: string;
}

export interface AssignerInfo {
  name: string;
  role: string;
  initials: string;
}

export interface UploadedMediaItem {
  id: string | number;
  latest_output_id?: number;
  title: string;
  type: "video" | "image";
  durationText?: string;
  platform: "TikTok" | "Instagram" | "YouTube" | string;
  platformColorKey?: string | null;
  platformBg: string;
  fileSizeText: string;
  uploadedTimeText: string;
  status: "Approved" | "Revision" | "Uploading" | "Pending" | string;
  statusBg: string;
  statusDot: string;
  revisionNote?: string;
  assigner?: AssignerInfo;
  isOverdue?: boolean;
  content_id?: number;
  task_id?: number;
  file_url?: string;
  deadline?: string | null;
}

export interface DraftsItem {
  id: string | number;
  title: string;
  category: string;
  categoryBg: string;
  status: "Pending" | "Revision" | "Approved" | "Overdue" | string;
  statusBg: string;
  statusDot: string;
  revisionNote?: string;
  wordCount: number;
  savedTimeText: string;
  iconBg: string;
  iconColor: string;
  assigner?: {
    name: string;
    role: string;
    initials: string;
  };
  content_id?: number;
  deadline?: string | null;
}
