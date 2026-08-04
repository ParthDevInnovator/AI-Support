import { Router, IRouter } from 'express';
import {
    createTicket,
    listTickets,
    getTicketById,
    updateTicket,
    addMessage,
    bulkUpdateTickets,
    escalateTicket,
} from '../controllers/ticket.controller';
import { requireAuth } from '../middleware/auth';

const router: ReturnType<typeof Router> = Router();

// All ticket routes require authentication
router.use(requireAuth);

// ── Ticket CRUD ───────────────────────────────────────────────────────────────
router.post('/', createTicket);                         // POST   /api/tickets
router.get('/', listTickets);                           // GET    /api/tickets?filters
router.get('/:id', getTicketById);                      // GET    /api/tickets/:id

// ── Ticket Update ─────────────────────────────────────────────────────────────
router.patch('/bulk', bulkUpdateTickets);               // PATCH  /api/tickets/bulk  (must be before /:id)
router.patch('/:id', updateTicket);                     // PATCH  /api/tickets/:id

// ── Ticket Actions ────────────────────────────────────────────────────────────
router.post('/:id/messages', addMessage);               // POST   /api/tickets/:id/messages
router.post('/:id/escalate', escalateTicket);           // POST   /api/tickets/:id/escalate

export default router;
