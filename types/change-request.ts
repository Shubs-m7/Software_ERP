export interface ChangeRequest {
  id: string;
  entryId: string;
  entryType: string;
  user: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  details?: string; // Cache the entry details for display
}
