import * as z from "zod"

export const ledgerSchema = z.object({
  name: z.string().min(2, "Ledger name must be at least 2 characters."),
  nature: z.enum(["Asset", "Liability", "Income", "Expense"]),
  groupId: z.string().min(1, "Please select a ledger group."),
  openingBalance: z.number().default(0),
  balanceType: z.enum(["Dr", "Cr"]),
  status: z.enum(["Active", "Inactive"]),
  type: z.enum(["Cash", "Bank", "General"]),
  projectId: z.string().optional(),
})

export type LedgerFormValues = z.infer<typeof ledgerSchema>

export interface Ledger extends LedgerFormValues {
  id: string
}
