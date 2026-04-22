import * as z from "zod"

export const transporterSchema = z.object({
  name: z.string().min(2, "Transporter name must be at least 2 characters."),
  code: z.string().min(2, "Code is required."),
  contactPerson: z.string().min(2, "Contact person is required."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  email: z.string().email("Invalid email address.").optional().or(z.literal("")),
  address: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
})

export type TransporterFormValues = z.infer<typeof transporterSchema>

export interface Transporter extends TransporterFormValues {
  id: string
}
