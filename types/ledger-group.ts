import * as z from "zod"

export const ledgerGroupSchema = z.object({
  name: z.string().min(2, "Group name must be at least 2 characters."),
  nature: z.enum(["Asset", "Liability", "Income", "Expense"]),
  status: z.enum(["Active", "Inactive"]),
  parentGroup: z.string().optional(),
  reportCategory: z.string().optional(),
  isDirect: z.boolean().default(false),
  displayOrder: z.number().default(0),
})

export type LedgerGroupFormValues = z.infer<typeof ledgerGroupSchema>

export interface LedgerGroup extends LedgerGroupFormValues {
  id: string
}
