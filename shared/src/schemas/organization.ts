import { z } from 'zod'

// ── Create / Update Organization ──────────────────────────────────────────────
export const UpdateOrganizationSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    logoUrl: z.string().url().optional().nullable(),
    timezone: z.string().optional(),
    businessHoursStart: z.string().regex(/^\d{2}:\d{2}$/).optional(), // "09:00"
    businessHoursEnd: z.string().regex(/^\d{2}:\d{2}$/).optional(),   // "18:00"
})
export type UpdateOrganizationInput = z.infer<typeof UpdateOrganizationSchema>

// ── AI Settings ───────────────────────────────────────────────────────────────
export const UpdateAiSettingsSchema = z.object({
    confidenceThreshold: z.number().int().min(0).max(100).optional(),
    defaultTone: z.enum(['professional', 'empathetic', 'concise']).optional(),
    autoReplyEnabled: z.boolean().optional(),
})
export type UpdateAiSettingsInput = z.infer<typeof UpdateAiSettingsSchema>
