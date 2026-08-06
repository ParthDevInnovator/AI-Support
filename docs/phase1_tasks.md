# Phase 1 — Task Breakdown (Weeks 1–8)

**Stack:** Next.js 14 · Node.js + Express · Prisma · Supabase · BullMQ · Upstash Redis · Gemini API

---

## Sprint 1 — Project Setup & Infrastructure (Days 1–4)

### T1.1 – Monorepo Scaffold
- [x] Init monorepo with `pnpm workspaces` (frontend, backend, shared)
- [x] Setup `tsconfig.json` for each workspace with path aliases
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
- [x] Define `Organization` model (id, name, slug, plan, settings, createdAt)
- [x] Define `User` model (id, orgId, email, passwordHash, role, status, googleId)
- [x] Define `Invitation` model (id, orgId, email, token, role, expiresAt)
- [x] Define `Ticket` model (id, orgId, assignedTo, subject, status, priority, source, customerEmail, createdAt)
- [x] Define `TicketMessage` model (id, ticketId, body, isInternal, isAiGenerated, senderType)
- [x] Define `TicketAiAnalysis` model (ticketId, category, subcategory, priority, sentiment, intent, urgency, language, confidenceScore, summary, escalationFlag, escalationReason)
- [x] Define `AuditLog` model (id, orgId, userId, action, metadata, createdAt)
- [x] Run `prisma migrate dev --name init` to create tables in Supabase

### T2.2 – pgvector Setup (for Phase 2 readiness)
- [x] Enable pgvector extension in Supabase (`CREATE EXTENSION vector`)
- [x] Add `DocumentChunk` model with `embedding vector(768)` column
- [x] Add ivfflat index for cosine similarity searches
- [x] Run migration

---

## Sprint 3 — Authentication (Days 8–13)

### T3.1 – Backend Auth
- [x] `POST /api/auth/register` — create org + admin user, hash password (bcrypt)
- [x] `POST /api/auth/login` — validate credentials, return JWT access token + refresh token
- [x] `POST /api/auth/refresh` — validate refresh token, return new access token
- [x] `POST /api/auth/logout` — invalidate refresh token
- [x] `POST /api/auth/forgot-password` — generate reset token, send email (Nodemailer + Gmail SMTP)
- [x] `POST /api/auth/reset-password` — validate token, update password
- [x] `GET /api/auth/google` — Google OAuth initiation (Passport.js)
- [x] `GET /api/auth/google/callback` — OAuth callback, create/login user, return JWT
- [x] Create `authMiddleware` — verify JWT, attach `req.user` (userId, orgId, role)
- [x] Create `roleGuard(roles[])` middleware — RBAC enforcement

### T3.2 – Frontend Auth
- [x] `/register` page — org name + email + password form
- [x] `/login` page — email + password form + "Login with Google" button
- [x] `/forgot-password` and `/reset-password` UI
- [x] Layout definition (Auth layout with standard branding)
- [x] Protected route wrapper (`requireAuth` HOC or middleware) + httpOnly cookie (refresh token)
- [x] Auth context / Zustand slice: `user`, `org`, `isAuthenticated`, `login()`, `logout()`
- [x] Protected route wrapper — redirect to `/login` if not authenticated
- [x] Role-based layout rendering (admin nav vs agent nav)

### T3.3 – Organization Setup Flow
- [x] After first login: if no org → redirect to `/onboarding`
- [x] `/onboarding` page — enter org name, timezone, create workspace
- [x] `POST /api/org/setup` — create organization, assign creator as admin

---

## Sprint 4 — Ticket Management (Days 14–22)

### T4.1 – Ticket Backend APIs
- [x] Create `POST /api/tickets` (Creates a ticket + initial message, adds to queue).
- [x] Create `GET /api/tickets` (List with filters: status, priority, assignee, paginated).
- [x] Create `GET /api/tickets/:id` (Fetch details + messages).
- [x] Create `PATCH /api/tickets/:id` (Update status, priority, assignment).
- [x] Create `POST /api/tickets/:id/messages` (Add reply/internal note).
- [x] Create `PATCH /api/tickets/bulk` (Bulk resolve, block, assign).
- [x] `POST /api/tickets/:id/escalate` — manually escalate ticket
- [x] All routes filtered by `orgId` from JWT — tenant isolation enforced

### T4.2 – Ticket Inbox UI
- [x] `/tickets` page — ticket list with columns: Subject, Customer, Status, Priority, Assignee, Sentiment, Created
- [x] Left filter panel: Status tabs, Priority, Category, Assignee, Date Range
- [x] Search bar (debounced, calls API)
- [x] Pagination controls
- [x] Click row → navigate to `/tickets/:id`
- [x] Bulk selection checkboxes + bulk action toolbar (assign, close, mark resolved)
- [x] Status badge chips with color coding
- [x] Priority indicator (colored dot)

### T4.3 – Ticket Detail UI
- [x] `/tickets/:id` page — 3-column layout:
  - Left: ticket list (mini inbox, keep context)
  - Center: message thread (customer + agent messages, internal notes)
  - Right sidebar: customer info + AI analysis panel
- [x] Message composer (TipTap editor) — reply or internal note toggle
- [x] Send reply button
- [x] Ticket header: Subject, Status dropdown, Priority dropdown, Assignee dropdown
- [x] Action buttons: Resolve, Escalate, Close

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
