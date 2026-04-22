import * as z from "zod"

export const registerRowSchema = z.object({
  vehicleNo: z.string().min(1, "Required"),
  lrNo: z.string().optional(),
  tyreNo: z.number().int().optional(),
  rNr: z.enum(["R", "NR"]).default("R"),
  ton: z.number().min(0).default(0),
  rate: z.number().min(0).default(0),
  addiAmount: z.number().min(0).default(0),
  total: z.number().min(0).default(0),
  cash: z.number().min(0).default(0),
  upi: z.number().min(0).default(0),
  refund: z.number().min(0).default(0),
  transporter: z.string().optional(),
  remark: z.string().optional(),
})

export const registerBatchSchema = z.object({
  date: z.string().min(1, "Date is required"),
  projectId: z.string().min(1, "Project is required"),
  rows: z.array(registerRowSchema).min(1, "At least one row is required"),
})

export type RegisterRowValues = z.infer<typeof registerRowSchema>
export type RegisterBatchValues = z.infer<typeof registerBatchSchema>
