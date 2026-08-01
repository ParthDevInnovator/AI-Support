import { z } from 'zod'
import { UserRole } from '../types/enums'

// ── Invite Team Member ────────────────────────────────────────────────────────
export const InviteUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    role: z.enum([UserRole.ADMIN, UserRole.USER]).default(UserRole.USER),
})
export type InviteUserInput = z.infer<typeof InviteUserSchema>

// ── Update User Role ──────────────────────────────────────────────────────────
export const UpdateUserRoleSchema = z.object({
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
})
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>

// ── Update User Status ────────────────────────────────────────────────────────
export const UpdateUserStatusSchema = z.object({
    status: z.enum(['active', 'inactive']),
})
export type UpdateUserStatusInput = z.infer<typeof UpdateUserStatusSchema>

// ── Update Profile ────────────────────────────────────────────────────────────
export const UpdateProfileSchema = z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    avatarUrl: z.string().url().optional().nullable(),
})
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
