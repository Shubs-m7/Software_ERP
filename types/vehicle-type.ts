import * as z from "zod"

export const vehicleTypeSchema = z.object({
  name: z.string().min(2, "Vehicle type name is required."),
  description: z.string().optional(),
  capacity: z.string().optional(), // e.g. "10 Ton", "15 Ton"
  status: z.enum(["Active", "Inactive"]),
})

export type VehicleTypeFormValues = z.infer<typeof vehicleTypeSchema>

export interface VehicleType extends VehicleTypeFormValues {
  id: string
}
