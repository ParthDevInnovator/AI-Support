import { Request, Response } from 'express';
import prisma from '../utils/db';
import {
    CreateTicketSchema,
    UpdateTicketSchema,
    AddMessageSchema,
    BulkTicketActionSchema,
    EscalateTicketSchema,
    TicketFiltersSchema,
} from '@repo/shared';
import { JwtPayload } from '../utils/jwt';

// ── Helper: resolve orgId from JWT, return 401 if missing ─────────────────────
const getOrgId = (req: Request, res: Response): string | null => {
    const orgId = (req.user as JwtPayload)?.orgId;
    if (!orgId) {
        res.status(401).json({ error: 'Unauthorized: No organization context' });
        return null;
    }
    return orgId;
};

// ── POST /api/tickets ─────────────────────────────────────────────────────────
export const createTicket = async (req: Request, res: Response) => {
    const result = CreateTicketSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Validation failed', details: result.error.errors });
    }

    const orgId = getOrgId(req, res);
    if (!orgId) return;

    const userId = (req.user as JwtPayload).userId;
    const { subject, customerEmail, body, priority, source, assignedTo } = result.data;

    try {
        const ticket = await prisma.$transaction(async (tx) => {
            const newTicket = await tx.ticket.create({
                data: {
                    orgId,
                    subject,
                    customerEmail,
                    priority,
                    source,
                    assignedTo: assignedTo ?? null,
                },
            });

            // Create the first message (body of ticket creation)
            await tx.ticketMessage.create({
                data: {
                    ticketId: newTicket.id,
                    body,
                    senderType: 'customer',
                    isInternal: false,
                    isAiGenerated: false,
                },
            });

            return newTicket;
        });

        // TODO (T5.2): Enqueue ticket for AI analysis here
        // await ticketAnalysisQueue.add('analyze', { ticketId: ticket.id });

        res.status(201).json({ success: true, data: { ticket } });
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ error: 'Internal server error while creating ticket' });
    }
};

// ── GET /api/tickets ──────────────────────────────────────────────────────────
export const listTickets = async (req: Request, res: Response) => {
    const orgId = getOrgId(req, res);
    if (!orgId) return;

    const result = TicketFiltersSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json({ error: 'Invalid query parameters', details: result.error.errors });
    }

    const { status, priority, assignedTo, search, dateFrom, dateTo, page, limit, sortBy, sortOrder } = result.data;

    const skip = (page - 1) * limit;

    const where: any = {
        orgId, // tenant isolation
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assignedTo && { assignedTo }),
        ...(search && {
            OR: [
                { subject: { contains: search, mode: 'insensitive' } },
                { customerEmail: { contains: search, mode: 'insensitive' } },
            ],
        }),
        ...(dateFrom || dateTo
            ? {
                createdAt: {
                    ...(dateFrom && { gte: new Date(dateFrom) }),
                    ...(dateTo && { lte: new Date(dateTo) }),
                },
            }
            : {}),
    };

    try {
        const [tickets, total] = await Promise.all([
            prisma.ticket.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    assignee: {
                        select: { id: true, email: true, firstName: true, lastName: true },
                    },
                    aiAnalysis: {
                        select: { sentiment: true, priority: true, category: true, escalationFlag: true },
                    },
                    _count: { select: { messages: true } },
                },
            }),
            prisma.ticket.count({ where }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                tickets,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('Error listing tickets:', error);
        res.status(500).json({ error: 'Internal server error while fetching tickets' });
    }
};

// ── GET /api/tickets/:id ──────────────────────────────────────────────────────
export const getTicketById = async (req: Request, res: Response) => {
    const orgId = getOrgId(req, res);
    if (!orgId) return;

    const { id } = req.params;

    try {
        const ticket = await prisma.ticket.findFirst({
            where: { id, orgId }, // orgId ensures tenant isolation
            include: {
                assignee: {
                    select: { id: true, email: true, firstName: true, lastName: true, role: true },
                },
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
                aiAnalysis: true,
            },
        });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.status(200).json({ success: true, data: { ticket } });
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ error: 'Internal server error while fetching ticket' });
    }
};

// ── PATCH /api/tickets/:id ────────────────────────────────────────────────────
export const updateTicket = async (req: Request, res: Response) => {
    const orgId = getOrgId(req, res);
    if (!orgId) return;

    const { id } = req.params;

    const result = UpdateTicketSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Validation failed', details: result.error.errors });
    }

    try {
        // Verify ticket belongs to org
        const existing = await prisma.ticket.findFirst({ where: { id, orgId } });
        if (!existing) return res.status(404).json({ error: 'Ticket not found' });

        const updated = await prisma.ticket.update({
            where: { id },
            data: result.data,
            include: {
                assignee: { select: { id: true, email: true, firstName: true, lastName: true } },
                aiAnalysis: { select: { sentiment: true, category: true, escalationFlag: true } },
            },
        });

        res.status(200).json({ success: true, data: { ticket: updated } });
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ error: 'Internal server error while updating ticket' });
    }
};

// ── POST /api/tickets/:id/messages ────────────────────────────────────────────
export const addMessage = async (req: Request, res: Response) => {
    const orgId = getOrgId(req, res);
    if (!orgId) return;

    const { id } = req.params;

    const result = AddMessageSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Validation failed', details: result.error.errors });
    }

    const { body, isInternal } = result.data;

    try {
        // Verify ticket belongs to org
        const ticket = await prisma.ticket.findFirst({ where: { id, orgId } });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        const message = await prisma.ticketMessage.create({
            data: {
                ticketId: id,
                body,
                isInternal,
                senderType: 'agent',
                isAiGenerated: false,
            },
        });

        // Update ticket's updatedAt
        await prisma.ticket.update({ where: { id }, data: { updatedAt: new Date() } });

        res.status(201).json({ success: true, data: { message } });
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ error: 'Internal server error while adding message' });
    }
};

// ── PATCH /api/tickets/bulk ───────────────────────────────────────────────────
export const bulkUpdateTickets = async (req: Request, res: Response) => {
    const orgId = getOrgId(req, res);
    if (!orgId) return;

    const result = BulkTicketActionSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Validation failed', details: result.error.errors });
    }

    const { ticketIds, action, assignTo } = result.data;

    // Determine update payload based on action
    let updateData: Record<string, any> = {};
    if (action === 'close') updateData = { status: 'closed' };
    else if (action === 'resolve') updateData = { status: 'resolved' };
    else if (action === 'assign') updateData = { assignedTo: assignTo };

    try {
        const { count } = await prisma.ticket.updateMany({
            where: {
                id: { in: ticketIds },
                orgId, // tenant isolation
            },
            data: updateData,
        });

        res.status(200).json({ success: true, data: { updatedCount: count } });
    } catch (error) {
        console.error('Error bulk-updating tickets:', error);
        res.status(500).json({ error: 'Internal server error during bulk update' });
    }
};

// ── POST /api/tickets/:id/escalate ────────────────────────────────────────────
export const escalateTicket = async (req: Request, res: Response) => {
    const orgId = getOrgId(req, res);
    if (!orgId) return;

    const { id } = req.params;

    const result = EscalateTicketSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Validation failed', details: result.error.errors });
    }

    const { reason } = result.data;

    try {
        // Verify ticket belongs to org
        const ticket = await prisma.ticket.findFirst({ where: { id, orgId } });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        // Upsert AI analysis record with escalation flag
        const [updated, aiAnalysisRecord] = await Promise.all([
            prisma.ticket.update({
                where: { id },
                data: { priority: 'urgent', status: 'in_progress' },
            }),
            prisma.ticketAiAnalysis.upsert({
                where: { ticketId: id },
                update: { escalationFlag: true, escalationReason: reason },
                create: {
                    ticketId: id,
                    escalationFlag: true,
                    escalationReason: reason,
                },
            }),
        ]);

        res.status(200).json({
            success: true,
            data: { ticket: updated, escalation: aiAnalysisRecord },
        });
    } catch (error) {
        console.error('Error escalating ticket:', error);
        res.status(500).json({ error: 'Internal server error while escalating ticket' });
    }
};
