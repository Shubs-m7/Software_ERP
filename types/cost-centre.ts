import * as z from "zod"

export const costCentreSchema = z.object({
  name: z.string().min(2, "Cost centre name must be at least 2 characters."),
  category: z.string().optional(),
  manager: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
  code: z.string().min(1, "Cost Centre code is required"),
  projectId: z.string().min(1, "Project mapping is required"),
})

export type CostCentreFormValues = z.infer<typeof costCentreSchema>

export interface CostCentre extends CostCentreFormValues {
  id: string
}
