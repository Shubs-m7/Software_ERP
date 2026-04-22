import * as z from "zod"

export const VoucherTypeEnum = z.enum(["RECEIPT", "PAYMENT", "CONTRA", "JOURNAL", "SALES", "PURCHASE"])
export type VoucherType = z.infer<typeof VoucherTypeEnum>

export const voucherLineSchema = z.object({
  ledgerId: z.string().min(1, "Please select a ledger."),
  drAmount: z.number().nonnegative().default(0),
  crAmount: z.number().nonnegative().default(0),
  remark: z.string().optional(),
  narration: z.string().optional(), // Adding narration to line level for detailed registers
})

export type VoucherLine = z.infer<typeof voucherLineSchema>

export const voucherSchema = z.object({
  voucherNo: z.string().min(1, "Voucher number is required."),
  date: z.string().min(1, "Date is required."),
  type: VoucherTypeEnum,
  projectId: z.string().min(1, "Please select a site/project."),
  narration: z.string().min(5, "Narration must be at least 5 characters."),
  lines: z.array(voucherLineSchema).min(2, "At least two entry lines are required."),
})

export type VoucherFormValues = z.infer<typeof voucherSchema>

export interface Voucher extends VoucherFormValues {
  id: string
  totalAmount: number
  status: "PENDING" | "APPROVED" | "REJECTED"
  requestedBy: string
  requestedAt: string
}
