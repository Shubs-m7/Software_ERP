import * as z from "zod"

export interface PermissionRule {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface DynamicRole {
  name: string;
  id: string;
  permissions: Record<string, PermissionRule>;
}

export const settingsSchema = z.object({
  currentFinancialYear: z.string(),
  lockUntilDate: z.string().optional(),
  allowBackdatedEntries: z.boolean().default(true),
  backdateLimitDays: z.number().default(90),
  requireApprovalForEdits: z.boolean().default(true),
})

export type GlobalSettings = z.infer<typeof settingsSchema>
