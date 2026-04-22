import * as z from "zod"

export const baluDispatchSchema = z.object({
  date: z.string().min(1, "Date is required"),
  projectId: z.string().min(1, "Project is required"),
  vehicleNo: z.string().min(1, "Vehicle number is required"),
  transporter: z.string().min(1, "Transporter name is required"),
  tonnage: z.number().min(0.01, "Tonnage must be greater than 0"),
  rate: z.number().min(0.01, "Rate must be greater than 0"),
  totalAmount: z.number().optional(),
})

export type BaluDispatchFormValues = z.infer<typeof baluDispatchSchema>

export interface BaluDispatchEntry extends BaluDispatchFormValues {
  id: string
  totalAmount: number
}
