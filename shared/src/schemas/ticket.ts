import { z } from 'zod'
import { TicketStatus, TicketPriority, ReplyTone } from '../types/enums'

// ── Create Ticket ─────────────────────────────────────────────────────────────
export const CreateTicketSchema = z.object({
    subject: z.string().min(1, 'Subject is required').max(255),
    body: z.string().min(1, 'Message body is required'),
    customerEmail: z.string().email('Invalid customer email'),
    customerName: z.string().max(100).optional(),
    priority: z.nativeEnum(TicketPriority).default(TicketPriority.MEDIUM),
})
export type CreateTicketInput = z.infer<typeof CreateTicketSchema>

// ── Update Ticket ─────────────────────────────────────────────────────────────
export const UpdateTicketSchema = z.object({
    status: z.nativeEnum(TicketStatus).optional(),
    priority: z.nativeEnum(TicketPriority).optional(),
    assignedTo: z.string().uuid().nullable().optional(),
})
export type UpdateTicketInput = z.infer<typeof UpdateTicketSchema>

// ── Ticket Filters (query params) ─────────────────────────────────────────────
export const TicketFiltersSchema = z.object({
    status: z.nativeEnum(TicketStatus).optional(),
    priority: z.nativeEnum(TicketPriority).optional(),
    assignedTo: z.string().uuid().optional(),
    search: z.string().max(200).optional(),
    dateFrom: z.string().datetime().optional(),
    dateTo: z.string().datetime().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['createdAt', 'updatedAt', 'priority']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
})
export type TicketFiltersInput = z.infer<typeof TicketFiltersSchema>

// ── Add Message / Reply ───────────────────────────────────────────────────────
export const AddMessageSchema = z.object({
    body: z.string().min(1, 'Message cannot be empty'),
    isInternal: z.boolean().default(false),
})
export type AddMessageInput = z.infer<typeof AddMessageSchema>

// ── Bulk Action ───────────────────────────────────────────────────────────────
export const BulkTicketActionSchema = z.object({
    ticketIds: z.array(z.string().uuid()).min(1, 'Select at least one ticket'),
    action: z.enum(['close', 'resolve', 'assign']),
    assignTo: z.string().uuid().optional(), // required when action = 'assign'
})
export type BulkTicketActionInput = z.infer<typeof BulkTicketActionSchema>

// ── Generate AI Reply ─────────────────────────────────────────────────────────
export const GenerateReplySchema = z.object({
    tone: z.nativeEnum(ReplyTone).default(ReplyTone.PROFESSIONAL),
})
export type GenerateReplyInput = z.infer<typeof GenerateReplySchema>

// ── Escalate Ticket ───────────────────────────────────────────────────────────
export const EscalateTicketSchema = z.object({
    reason: z.string().min(1, 'Please provide an escalation reason').max(500),
})
export type EscalateTicketInput = z.infer<typeof EscalateTicketSchema>
