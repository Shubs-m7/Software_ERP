import * as z from "zod"

export const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters."),
  type: z.enum(["PARKING", "BALU"], {
    required_error: "Please select a project type.",
  }),
  startDate: z.string().min(1, "Please select a start date."),
  status: z.enum(["Active", "Inactive"]),
  reportingMode: z.enum(["Cost Centre", "Non-Cost Centre"]).default("Non-Cost Centre"),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

export interface Project extends ProjectFormValues {
  id: string
}
