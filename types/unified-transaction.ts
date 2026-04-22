export type TransactionType = "Collection" | "Expense" | "Dispatch";

export interface UnifiedTransaction {
  id: string;
  time: string;
  date: string;
  type: TransactionType;
  project: string;
  details: string;
  amount: number;
  paymentMode: string;
  status: "Success" | "Pending" | "Void";
  businessType: "PARKING" | "BALU";
  isEdited?: boolean;
  editedBy?: string;
  editedAt?: string;
}
