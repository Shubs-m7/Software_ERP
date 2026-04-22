import * as z from "zod"

export const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  projectId: z.string().min(1, "Project is required"),
  ledgerId: z.string().min(1, "Ledger is required"),
  costCentreId: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  paymentMode: z.enum(["Cash", "Bank Transfer", "UPI", "Cheque"]),
  remark: z.string().optional(),
})

export type ExpenseFormValues = z.infer<typeof expenseSchema>

export interface ExpenseEntry extends ExpenseFormValues {
  id: string
}
