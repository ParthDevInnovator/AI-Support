# Phase 1 — Task Breakdown (Weeks 1–8)

**Stack:** Next.js 14 · Node.js + Express · Prisma · Supabase · BullMQ · Upstash Redis · Gemini API

---

## Sprint 1 — Project Setup & Infrastructure (Days 1–4)

### T1.1 – Monorepo Scaffold
- [ ] Init monorepo with `pnpm workspaces` (frontend, backend, shared)
- [ ] Setup `tsconfig.json` for each workspace with path aliases
- [x] Add `docker-compose.yml` (local Postgres + Redis for dev)
- [x] Setup `.env.example` with all required env vars documented
- [x] Add `shared/` package with shared Zod schemas

### T1.2 – Backend Bootstrap
- [x] Init Express app with TypeScript (`ts-node-dev`, `nodemon`)
- [x] Setup folder structure: `routes/`, `middleware/`, `services/`, `ai/`, `jobs/`, `integrations/`, `utils/`
- [x] Configure CORS, helmet, morgan, express-json middleware
- [x] Setup global error handler middleware
- [x] Add health-check route `GET /health`
- [x] Connect Prisma to Supabase PostgreSQL (`.env` DATABASE_URL)

### T1.3 – Frontend Bootstrap
- [x] Init Next.js 14 App Router project
- [x] Install & configure shadcn/ui + Tailwind CSS
- [x] Setup folder structure: `app/(auth)/`, `app/dashboard/`, `app/tickets/`, `components/`, `lib/`, `hooks/`
- [x] Configure TanStack Query (`QueryClientProvider`)
- [x] Configure Zustand global store
- [x] Setup Axios instance with base URL + auth interceptor (attach JWT)

### T1.4 – CI/CD
- [x] Setup GitHub repository
- [x] Add GitHub Actions workflow: lint + typecheck on every PR
- [x] Add separate deploy workflows for Vercel (frontend) and Render (backend)

---

## Sprint 2 — Database Schema (Days 5–7)

### T2.1 – Prisma Schema Design
- [ ] Define `Organization` model (id, name, slug, plan, settings, createdAt)
- [ ] Define `User` model (id, orgId, email, passwordHash, role, status, googleId)
- [ ] Define `Invitation` model (id, orgId, email, token, role, expiresAt)
- [ ] Define `Ticket` model (id, orgId, assignedTo, subject, status, priority, source, customerEmail, createdAt)
- [ ] Define `TicketMessage` model (id, ticketId, body, isInternal, isAiGenerated, senderType)
- [ ] Define `TicketAiAnalysis` model (ticketId, category, subcategory, priority, sentiment, intent, urgency, language, confidenceScore, summary, escalationFlag, escalationReason)
- [ ] Define `AuditLog` model (id, orgId, userId, action, metadata, createdAt)
- [ ] Run `prisma migrate dev --name init` to create tables in Supabase

### T2.2 – pgvector Setup (for Phase 2 readiness)
- [ ] Enable pgvector extension in Supabase (`CREATE EXTENSION vector`)
- [ ] Add `DocumentChunk` model with `embedding vector(768)` column
- [ ] Add ivfflat index for cosine similarity searches
- [ ] Run migration

---

## Sprint 3 — Authentication (Days 8–13)

### T3.1 – Backend Auth
- [ ] `POST /api/auth/register` — create org + admin user, hash password (bcrypt)
- [ ] `POST /api/auth/login` — validate credentials, return JWT access token + refresh token
- [ ] `POST /api/auth/refresh` — validate refresh token, return new access token
- [ ] `POST /api/auth/logout` — invalidate refresh token
- [ ] `POST /api/auth/forgot-password` — generate reset token, send email (Nodemailer + Gmail SMTP)
- [ ] `POST /api/auth/reset-password` — validate token, update password
- [ ] `GET /api/auth/google` — Google OAuth initiation (Passport.js)
- [ ] `GET /api/auth/google/callback` — OAuth callback, create/login user, return JWT
- [ ] Create `authMiddleware` — verify JWT, attach `req.user` (userId, orgId, role)
- [ ] Create `roleGuard(roles[])` middleware — RBAC enforcement

### T3.2 – Frontend Auth
- [ ] `/register` page — org name + email + password form
- [ ] `/login` page — email + password + Google OAuth button
- [ ] `/forgot-password` page — email form
- [ ] `/reset-password/[token]` page — new password form
- [ ] Store JWT in memory (access token) + httpOnly cookie (refresh token)
- [ ] Auth context / Zustand slice: `user`, `org`, `isAuthenticated`, `login()`, `logout()`
- [ ] Protected route wrapper — redirect to `/login` if not authenticated
- [ ] Role-based layout rendering (admin nav vs agent nav)

### T3.3 – Organization Setup Flow
- [ ] After first login: if no org → redirect to `/onboarding`
- [ ] `/onboarding` page — enter org name, timezone, create workspace
- [ ] `POST /api/org/setup` — create organization, assign creator as admin

---

## Sprint 4 — Ticket Management (Days 14–22)

### T4.1 – Ticket Backend APIs
- [ ] `POST /api/tickets` — create ticket (manual)
- [ ] `GET /api/tickets` — list tickets with filters (status, priority, assignee, dateRange, search) + pagination
- [ ] `GET /api/tickets/:id` — get ticket detail with messages + AI analysis
- [ ] `PATCH /api/tickets/:id` — update ticket (status, priority, assignee)
- [ ] `POST /api/tickets/:id/messages` — add reply or internal note
- [ ] `PATCH /api/tickets/bulk` — bulk update (close, assign)
- [ ] `POST /api/tickets/:id/escalate` — manually escalate ticket
- [ ] All routes filtered by `orgId` from JWT — tenant isolation enforced

### T4.2 – Ticket Inbox UI
- [ ] `/tickets` page — ticket list with columns: Subject, Customer, Status, Priority, Assignee, Sentiment, Created
- [ ] Left filter panel: Status tabs, Priority, Category, Assignee, Date Range
- [ ] Search bar (debounced, calls API)
- [ ] Pagination controls
- [ ] Click row → navigate to `/tickets/:id`
- [ ] Bulk selection checkboxes + bulk action toolbar (assign, close, mark resolved)
- [ ] Status badge chips with color coding
- [ ] Priority indicator (colored dot)

### T4.3 – Ticket Detail UI
- [ ] `/tickets/:id` page — 3-column layout:
  - Left: ticket list (mini inbox, keep context)
  - Center: message thread (customer + agent messages, internal notes)
  - Right sidebar: customer info + AI analysis panel
- [ ] Message composer (TipTap editor) — reply or internal note toggle
- [ ] Send reply button
- [ ] Ticket header: Subject, Status dropdown, Priority dropdown, Assignee dropdown
- [ ] Action buttons: Resolve, Escalate, Close

---

## Sprint 5 — AI Ticket Analysis (Days 23–30)

### T5.1 – Gemini Integration (Backend)
- [ ] Install `@google/generative-ai` SDK
- [ ] Create `ai/gemini.ts` — init Gemini client with API key
- [ ] Create `ai/ticketAnalyzer.ts`:
  - Build analysis prompt with ticket subject + body
  - Call Gemini, parse structured JSON response
  - Return: `{ category, subcategory, priority, sentiment, intent, urgency, language, confidenceScore, summary }`
- [ ] Wrap in try/catch with fallback defaults if AI fails

### T5.2 – BullMQ Job Setup
- [ ] Install BullMQ + connect to Upstash Redis (`ioredis` with TLS URL)
- [ ] Create `jobs/queues.ts` — define `ticketAnalysisQueue`
- [ ] Create `jobs/workers/ticketAnalysisWorker.ts`:
  - Receive `ticketId`
  - Fetch ticket from DB
  - Call `ticketAnalyzer()`
  - Store result in `TicketAiAnalysis` table
  - Set `escalationFlag = true` if `confidenceScore < org.confidenceThreshold`
  - Emit Socket.io event `ticket:analysis:done` to org room
- [ ] After `POST /api/tickets` → add job to queue immediately

### T5.3 – AI Analysis UI (Right Sidebar)
- [ ] Poll or listen via Socket.io for `ticket:analysis:done` event
- [ ] Show loading skeleton on sidebar while analysis is pending
- [ ] Display AI Analysis card:
  - Category + Subcategory badge
  - Priority chip
  - Sentiment chip (with emoji: 😤 Frustrated, 😊 Happy, 😐 Neutral)
  - Confidence score progress bar
  - Summary paragraph
  - Urgency indicator
  - Language detected
- [ ] If escalation flagged → show red "Escalation Required" banner at top of ticket

---

## Sprint 6 — AI Reply Generation (Days 31–38)

### T6.1 – Reply Generation Backend
- [ ] Create `ai/replyGenerator.ts`:
  - Build prompt: system prompt + ticket details + AI analysis + conversation history + tone instruction
  - Call Gemini, return draft reply text
- [ ] `POST /api/tickets/:id/ai/generate-reply` — generate reply draft
  - Accept `{ tone: 'professional' | 'empathetic' | 'concise' }`
  - Return `{ draft, tokensUsed }`
- [ ] `POST /api/tickets/:id/ai/regenerate-reply` — same as above (new call)

### T6.2 – Reply Generation UI
- [ ] "✨ Generate AI Reply" button in message composer
- [ ] Tone selector dropdown: Professional · Empathetic · Concise (before generating)
- [ ] Loading state while generating (spinner on button)
- [ ] Generated draft appears in TipTap editor (fully editable)
- [ ] "Regenerate" button (refresh icon) — calls regenerate endpoint
- [ ] "Copy" button — copies draft to clipboard
- [ ] "Send Reply" button — submits the (edited) draft as a ticket message
- [ ] AI-generated messages tagged with "✨ AI Suggested" label in thread

---

## Sprint 7 — Team Management + Super Admin (Days 39–46)

### T7.1 – Team Management Backend
- [ ] `GET /api/team` — list org members (name, email, role, status, ticketsAssigned)
- [ ] `POST /api/team/invite` — send invitation email, store `Invitation` record
- [ ] `GET /api/team/accept-invite/:token` — validate token, redirect to register with prefilled email
- [ ] `PATCH /api/team/:userId/role` — change user role (admin only)
- [ ] `PATCH /api/team/:userId/status` — activate/deactivate user (admin only)
- [ ] `DELETE /api/team/:userId` — remove user from org (admin only)

### T7.2 – Team Management UI
- [ ] `/settings/team` page — members table (Avatar, Name, Email, Role badge, Status, Tickets, Actions)
- [ ] "Invite Member" button → modal with email + role select → calls invite API
- [ ] Role change dropdown inline in table
- [ ] Deactivate / Remove buttons with confirmation dialog
- [ ] Pending invitations section — list of sent invites + revoke option

### T7.3 – Super Admin Panel (Basic)
- [ ] Separate layout at `/admin` — only accessible to `super_admin` role
- [ ] `GET /api/admin/orgs` — list all organizations (name, plan, userCount, ticketCount, createdAt, status)
- [ ] `PATCH /api/admin/orgs/:id/suspend` — suspend org
- [ ] `PATCH /api/admin/orgs/:id/reactivate` — reactivate org
- [ ] `/admin` dashboard page:
  - Stats cards: Total Orgs, Active Orgs, Total Users, Total Tickets
  - Orgs table with status badge + Suspend/Reactivate action

### T7.4 – Phase 1 QA & Cleanup
- [ ] Test full user journey: Register → Create org → Create ticket → AI analysis → Generate reply → Send
- [ ] Test invitation flow: Invite member → Accept invite → Login as agent → View assigned tickets
- [ ] Test Super Admin: Suspend org → Login attempt blocked
- [ ] Test RBAC: Agent cannot access `/settings`, `/admin`
- [ ] Fix all TypeScript errors, remove all `console.log` debug statements
- [ ] Deploy frontend to Vercel, backend to Render
- [ ] Smoke test on production URL

---

## Phase 1 Task Summary

| Sprint | Days | Focus Area | Key Output |
|---|---|---|---|
| Sprint 1 | 1–4 | Project setup | Monorepo + CI/CD running |
| Sprint 2 | 5–7 | Database | Prisma schema + Supabase connected |
| Sprint 3 | 8–13 | Auth | Login, Register, Google OAuth, RBAC |
| Sprint 4 | 14–22 | Tickets | Inbox + detail page fully working |
| Sprint 5 | 23–30 | AI Analysis | Gemini analysis on every ticket |
| Sprint 6 | 31–38 | AI Reply | Draft generation + edit + send flow |
| Sprint 7 | 39–46 | Team + Admin | Invites, roles, Super Admin panel |

> **Total: ~46 working days (≈ 8 weeks)**
