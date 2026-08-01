import { z } from 'zod'
import { UserRole } from '../types/enums'

// ── Register ──────────────────────────────────────────────────────────────────
export const RegisterSchema = z.object({
    orgName: z
        .string()
        .min(2, 'Organization name must be at least 2 characters')
        .max(100),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
})
export type RegisterInput = z.infer<typeof RegisterSchema>

// ── Login ─────────────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})
export type LoginInput = z.infer<typeof LoginSchema>

// ── Forgot Password ───────────────────────────────────────────────────────────
export const ForgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
})
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>

// ── Reset Password ────────────────────────────────────────────────────────────
export const ResetPasswordSchema = z
    .object({
        token: z.string().min(1),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        confirmPassword: z.string().min(1),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>

// ── Invite Accept (member joining via invite link) ────────────────────────────
export const AcceptInviteSchema = z
    .object({
        token: z.string().min(1),
        firstName: z.string().min(1).max(50),
        lastName: z.string().min(1).max(50),
        password: z.string().min(8),
        confirmPassword: z.string().min(1),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
export type AcceptInviteInput = z.infer<typeof AcceptInviteSchema>

// ── Onboarding ────────────────────────────────────────────────────────────────
export const OnboardingSchema = z.object({
    orgName: z.string().min(2).max(100),
    timezone: z.string().min(1, 'Please select a timezone'),
})
export type OnboardingInput = z.infer<typeof OnboardingSchema>
