import { z } from "zod"

export const userRoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.record(z.object({
    view: z.boolean().default(false),
    create: z.boolean().default(false),
    edit: z.boolean().default(false),
    delete: z.boolean().default(false),
  })),
  isActive: z.boolean(),
})

export type UserRole = z.infer<typeof userRoleSchema>

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  mobile: z.string(),
  email: z.string().email(),
  password: z.string(), // In production, this would be hashed
  roleId: z.string(),
  allowedProjectIds: z.array(z.string()), // Multi-site mapping
  isActive: z.boolean(),
  createdAt: z.string(),
})

export type User = z.infer<typeof userSchema>
