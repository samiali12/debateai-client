export interface DebateType {
  id: number;
  title: string;
  description: string;
  status: "pending" | "active" | "completed" | "archived";
  created_by: number;
  created_at: Date;
  updated_at: Date;
}
