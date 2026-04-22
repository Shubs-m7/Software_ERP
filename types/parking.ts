import * as z from "zod"

export const parkingSchema = z.object({
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  name: z.string().min(1, "Name is required"),
  paymentMode: z.enum(["Cash", "GPay"]),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  dateTime: z.string().optional(), // Auto-generated on save usually
})

export type ParkingFormValues = z.infer<typeof parkingSchema>

export interface ParkingEntry extends ParkingFormValues {
  id: string
  dateTime: string // Required in the interface as it will be set on creation
}
