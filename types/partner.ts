import * as z from "zod"

export const partnerSchema = z.object({
  name: z.string().min(2, "Partner name must be at least 2 characters."),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits."),
  email: z.string().email("Invalid email address."),
  shareRatio: z.number().min(0).max(100).default(0),
  openingCapital: z.number().min(0).default(0),
  status: z.enum(["Active", "Inactive"]),
})

export type PartnerFormValues = z.infer<typeof partnerSchema>

export interface Partner extends PartnerFormValues {
  id: string
}
