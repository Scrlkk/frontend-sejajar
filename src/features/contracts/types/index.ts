export interface ContractPlatform {
  id: number;
  platform_name: string;
}

export interface ContractTeamUser {
  id: number;
  full_name: string;
  roles: string[];
  is_online?: boolean;
}

export interface Contract {
  id: number;
  client_id: number;
  contract_code: string;
  contract_name: string;
  description: string;
  start_date: string;
  end_date: string;
  revenue: string;
  status: string;
  created_by: number;
  lead_by: number;
  created_by_name: string;
  lead_by_name: string;
  platforms: ContractPlatform[];
  teams: ContractTeamUser[];
  is_active: boolean;
  contract_manager_id?: number | null;
  contract_manager_name?: string | null;
  created_at?: string;
  updated_at?: string;
  client_name?: string;
  company_name?: string;
}

export interface ContractCardItem {
  id: string | number;
  code: string;
  title: string;
  brand: string;
  description: string;
  platforms: string[];
  currentProgress: number;
  targetProgress: number;
  startDate: string;
  endDate: string;
  rawStartDate?: string;
  rawEndDate?: string;
  valueAmount: string;
  value?: number;
  status: "Completed" | "Active" | "Overdue" | string;
  statusBg: string;
  statusDot: string;
  year?: number;
  createdBy?: string;
  createdByUserId?: number;
  deletedAt?: string | null;
}

export interface ContractItem {
  id: string | number;
  code: string;
  title: string;
  brand: string;
  platforms: string[];
  currentProgress: number;
  targetProgress: number;
  date: string;
  statusText?: string;
}
