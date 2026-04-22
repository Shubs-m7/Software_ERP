export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "LOGIN" | "LOGOUT" | "SETTINGS_CHANGE";

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  module: string;
  referenceId: string;
  description: string;
  ipAddress?: string;
  metadata?: Record<string, any>; // Store before/after state if needed
}
