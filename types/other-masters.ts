import { z } from "zod"

export const bgStatusEnum = z.enum(["Active", "Expired", "Returned", "Invoked"])
export type BGStatus = z.infer<typeof bgStatusEnum>

export const bankGuaranteeSchema = z.object({
  id: z.string(),
  bankName: z.string().min(2, "Bank name is required"),
  bgNumber: z.string().min(2, "BG number is required"),
  amount: z.number().positive(),
  issueDate: z.string(),
  expiryDate: z.string(),
  purpose: z.string().optional(),
  status: bgStatusEnum,
  createdBy: z.string(),
  createdAt: z.string(),
  updatedBy: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type BankGuarantee = z.infer<typeof bankGuaranteeSchema>

export const securityDepositSchema = z.object({
  id: z.string(),
  particulars: z.string().min(2, "Particulars required"),
  amount: z.number().positive(),
  date: z.string(),
  type: z.enum(["REFUNDABLE", "NON-REFUNDABLE"]),
  status: z.enum(["Held", "Refunded", "Adjusted"]),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedBy: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type SecurityDeposit = z.infer<typeof securityDepositSchema>
