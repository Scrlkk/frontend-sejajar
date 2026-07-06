export interface ClientData {
  client_id: number;
  client_name: string;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  joinedDate?: string;
  status?: "active" | "inactive";
}
