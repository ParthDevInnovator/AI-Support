# AI-Powered Customer Support Triage Platform — MVP Plan

A multi-tenant SaaS platform that acts as an AI Copilot for customer support teams — automatically triaging tickets, generating RAG-based reply drafts, and escalating complex cases to humans.

---

## Tech Stack

### Frontend
| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 14** (App Router) | SSR, file-based routing, strong ecosystem |
| UI Library | **shadcn/ui** + Tailwind CSS | Polished, accessible components fast |
| State | **Zustand** + React Query (TanStack) | Simple global state + server-state caching |
| Auth UI | **NextAuth.js** (client side) | Google OAuth + credentials built-in |
| Charts | **Recharts** | Lightweight, composable analytics |
| Editor | **TipTap** | Rich-text reply editor |
| Real-time | **Socket.io-client** | Live ticket updates, notifications |

### Backend
| Layer | Choice | Reason |
|---|---|---|
| Runtime | **Node.js 20 + Express.js** (TypeScript) | Same language as frontend, huge ecosystem |
| Auth | **JWT** (jsonwebtoken) + Passport.js | Google OAuth + credentials, stateless |
| ORM | **Prisma** + migrations | Type-safe, great DX, auto migrations |
| Task Queue | **BullMQ** + **Upstash Redis** (free tier) | Background AI jobs — 10k cmds/day free |
| Real-time | **Socket.io** | Push notifications to agents |
| File Storage | **Supabase Storage** (free 1GB) | KB document storage, no cost |
| Validation | **Zod** | Schema validation shared with frontend |

### AI Layer
| Component | Choice | Reason |
|---|---|---|
| LLM | **Google Gemini 1.5 Flash** | Free tier: 1500 req/day — plenty for a side project |
| Embeddings | **text-embedding-004** (Google) | Free with Gemini API key |
| Vector DB | **pgvector** (PostgreSQL extension) | 100% free — runs inside your existing Supabase DB |
| RAG Framework | **LangChain.js** + custom pipeline | JS-native, document chunking + retrieval |
| PDF Parsing | **pdf-parse** / **mammoth** (DOCX) | Extract text from uploaded docs |

### Database
| Purpose | Choice | Cost |
|---|---|---|
| Primary DB | **Supabase** (PostgreSQL 16) | Free — 500MB DB, 5GB bandwidth |
| Vector Store | **pgvector** extension on Supabase | Free — built into Supabase |
| Cache / Queue | **Upstash Redis** | Free — 10k commands/day |
| File Storage | **Supabase Storage** | Free — 1GB included |
| Search | **PostgreSQL Full-Text** + pgvector similarity | Free — no extra service needed |

### Infrastructure
| Component | Choice | Cost |
|---|---|---|
| Frontend Deploy | **Vercel** | Free — unlimited deploys |
| Backend Deploy | **Render** (free web service) | Free — 512MB RAM, spins down on idle |
| Dev Environment | **Docker Compose** (local) | Free |
| CI/CD | **GitHub Actions** | Free — 2000 min/month |
| Monitoring | **Sentry** (free tier — 5k errors/month) | Free |
| Email | **Nodemailer + Gmail SMTP** | Free — use your Gmail account |
| DNS | **Cloudflare** (free plan) | Free |

---

## Multi-Tenant Architecture

```
PostgreSQL (Supabase): Row-Level Security (RLS) by organization_id
Every table: organization_id (FK) — enforced at query level
pgvector: Filter by organization_id on every vector search
Supabase Storage: Folder prefix per organization (org-id/documents/)
Upstash Redis: Key prefix per organization
```

---

## Phase Roadmap

```
Phase 1 (Weeks 1–8)  → Core Foundation
Phase 2 (Weeks 9–14) → Knowledge Base, RAG & Integrations  
Phase 3 (Weeks 15–18) → Advanced AI, Notifications & Polish
```

---

## Phase 1 — Core Foundation (Weeks 1–8)

**Goal:** A working multi-tenant platform where agents can receive, manage, and reply to tickets with basic AI analysis.

### Modules Covered

#### ✅ Module 1 – Authentication & Workspace
- Email/password registration + login
- Google OAuth (NextAuth.js + FastAPI backend)
- JWT token management (access + refresh)
- Organization creation on first login
- Member invitation via email (token-based)
- Role-based access: `super_admin`, `admin`, `user`
- Multi-tenant isolation by `organization_id`
- Password reset flow (email link)

#### ✅ Module 2 – Ticket Management (Core)
- Manual ticket creation (title, message, customer email, priority)
- Unified ticket inbox with list + detail view
- Ticket statuses: `Open`, `In Progress`, `Waiting for Customer`, `Resolved`, `Closed`
- Filters: Status, Priority, Assignee, Date Range
- Search (PostgreSQL full-text)
- Pagination + sorting
- Assign/reassign tickets (Admin)
- Internal notes (agent-only, not visible to customer)
- Basic bulk actions (close, assign)

#### ✅ Module 3 – AI Ticket Analysis (Core)
- On ticket creation, trigger background BullMQ job
- Gemini analyzes ticket message and returns:
  - `category`, `subcategory`, `priority`, `sentiment`, `intent`, `urgency`, `language`, `confidence_score`, `summary`
- Results stored in `ticket_ai_analysis` table
- Displayed on ticket detail panel (right sidebar)
- Escalation flag if `confidence < threshold` (configurable)

#### ✅ Module 4 – AI Reply Generation (Basic)
- "Generate Reply" button on ticket detail page
- Calls Gemini with: ticket content + AI analysis + system prompt
- Returns draft reply in TipTap editor
- Agent can edit, regenerate, approve, copy, or send
- Tone selection: Professional, Empathetic, Concise
- No RAG in Phase 1 (pure LLM, no knowledge base yet)

#### ✅ Module 5 – Human Escalation (Basic)
- Rule: if `confidence_score < threshold` → flag for human review
- Escalation reason stored (`low_confidence`, `abusive_language`, etc.)
- Escalated tickets highlighted in inbox
- Manual escalation button for agents

#### ✅ Module 10 – Team Management (Core)
- Admin: Invite users by email
- Admin: Remove users
- Admin: Assign/change roles
- View team member list with status
- Super Admin: View all organizations, suspend/reactivate

#### ✅ Super Admin Panel (Basic)
- Platform-wide org list
- User count, ticket count per org
- Ability to create/suspend/delete organizations

### Deliverables (Phase 1)
- Working multi-tenant Next.js + Express app (fully TypeScript)
- Supabase PostgreSQL schema with org-level isolation
- Upstash Redis + BullMQ for async AI processing
- Basic ticket lifecycle end-to-end
- AI analysis visible on every ticket
- AI-generated reply drafts without RAG

---

## Phase 2 — Knowledge Base, RAG & Integrations (Weeks 9–14)

**Goal:** Upgrade AI replies to use company-specific knowledge. Add Gmail integration and analytics.

### Modules Covered

#### ✅ Module 6 – Knowledge Base
- Upload documents: PDF, DOCX, TXT, Markdown
- Website URL ingestion (crawl + extract)
- FAQ management (manual Q&A pairs)
- Document chunking + embedding (text-embedding-004)
- Store vectors in **pgvector** table (filtered by org_id)
- Document management UI: upload, delete, edit metadata
- Version history (keep old embeddings, mark superseded)
- Folder/category organization

#### ✅ Module 4 – AI Reply Generation (with RAG)
- On "Generate Reply": retrieve top-K relevant chunks from pgvector
- Construct prompt: ticket + retrieved context + conversation history
- Gemini generates grounded, knowledge-based reply
- "AI Explanation" panel: which documents were referenced
- Regenerate with different tone or different retrieved context
- Auto-Reply mode (optional, configurable per org): if confidence ≥ threshold → send automatically

#### ✅ Module 7 – Similar Ticket Search
- On ticket open: embed the ticket message
- Query pgvector for similar historical tickets (cosine similarity)
- Display top-3 similar tickets with resolution + similarity score
- Agent can copy resolutions from similar tickets

#### ✅ Module 8 – Internal AI Notes
- Auto-generated internal note per ticket
- Contains: customer contact history, customer tier, previous resolutions, detected flags
- Stored as internal note, not sent to customer

#### ✅ Module 11 – Integrations (Phase 1: Gmail)
- Gmail OAuth connection (per org)
- Ingest emails as tickets automatically
- Store `source: gmail`, `external_id: gmail_thread_id`
- Send replies back via Gmail API (on ticket reply)
- Webhook/polling for new emails → create tickets

#### ✅ Module 9 – Analytics Dashboard (Core)
- **Ticket Analytics:** Tickets today/week/month, avg resolution time, first response time
- **AI Analytics:** AI resolution rate, auto-reply rate, escalation rate, avg confidence
- **Category Analytics:** Top categories chart, most common issues
- **Agent Analytics:** Tickets closed per agent, handling time, AI acceptance rate
- Recharts-based dashboard, date range filter

### Deliverables (Phase 2)
- Full RAG pipeline operational
- Knowledge base UI + vector indexing
- Gmail → Ticket ingestion + reply sync
- Analytics dashboard with real data
- Similar tickets sidebar working

---

## Phase 3 — Advanced Features, Notifications & Polish (Weeks 15–18)

**Goal:** Production-ready: notifications, audit logs, security hardening, settings, and UX polish.

### Modules Covered

#### ✅ Module 12 – Notifications
- In-app notifications (Socket.io): new ticket, escalation, AI done, SLA breach
- Email notifications (Nodemailer + Gmail SMTP): configurable per user
- Notification center UI (bell icon, read/unread, mark all read)
- SLA breach alert (configurable SLA per workspace)

#### ✅ Module 13 – Settings
- **Workspace:** Company name, logo, branding, business hours
- **AI Settings:** Model selection (plan-dependent), response tone, confidence threshold, auto-reply toggle
- **Support Settings:** SLA rules (response time per priority), escalation rules, working hours
- **Integrations page:** Connect/disconnect Gmail, view API keys

#### ✅ Module 14 – Audit Logs
- Log all key actions: login, ticket update, AI action, KB change, user management
- Filterable audit log table (Admin only)
- Export to CSV

#### ✅ Module 15 – Security Hardening
- Rate limiting (Express middleware + Upstash Redis)
- HTTPS enforcement (handled by Vercel + Render automatically)
- Input sanitization (XSS prevention)
- CORS lockdown
- Secrets managed via `.env` files + Render/Vercel environment variables (free)
- GDPR-ready: data export + account deletion endpoint

#### ✅ Super Admin Panel (Complete)
- Full platform analytics: MRR proxy, total orgs, total users, AI requests
- Subscription plan management per org
- Feature flags per org
- Global AI settings (default prompts, model defaults)

### Deliverables (Phase 3)
- Fully production-ready application
- Notifications working (in-app + email)
- Audit logs viewable
- Security hardened
- Complete settings pages
- Super Admin panel complete
- Deploy to production (Vercel for frontend, Render for backend)

---

## Database Schema Overview

### Core Tables
```
organizations       – id, name, plan, settings, created_at
users               – id, org_id, email, role, status
tickets             – id, org_id, assigned_to, status, priority, source
ticket_ai_analysis  – ticket_id, category, sentiment, confidence, summary
ticket_messages     – id, ticket_id, body, is_internal, is_ai_generated
knowledge_documents – id, org_id, name, type, status, vector_ids
audit_logs          – id, org_id, user_id, action, metadata, created_at
notifications       – id, user_id, type, read, created_at
integrations        – id, org_id, type, credentials (encrypted), status
```

---

## MVP Scope Summary

| Module | Phase 1 | Phase 2 | Phase 3 |
|---|:---:|:---:|:---:|
| Auth & Workspace | ✅ | — | — |
| Ticket Management | ✅ | — | — |
| AI Analysis | ✅ | — | — |
| AI Reply (no RAG) | ✅ | — | — |
| Human Escalation | ✅ | — | — |
| Team Management | ✅ | — | — |
| Knowledge Base + RAG | — | ✅ | — |
| AI Reply (with RAG) | — | ✅ | — |
| Similar Tickets | — | ✅ | — |
| Internal AI Notes | — | ✅ | — |
| Gmail Integration | — | ✅ | — |
| Analytics Dashboard | — | ✅ | — |
| Notifications | — | — | ✅ |
| Settings (Full) | — | — | ✅ |
| Audit Logs | — | — | ✅ |
| Security Hardening | — | — | ✅ |
| Super Admin (Full) | Partial | — | ✅ |

**Total Estimated Timeline: 18 weeks (4.5 months)**

---

## Repository Structure (Monorepo)

```
/
├── frontend/              # Next.js 14 App Router
│   ├── app/
│   │   ├── (auth)/        # Login, Register, OAuth callback
│   │   ├── dashboard/     # Agent & Admin views
│   │   ├── tickets/       # Ticket inbox + detail
│   │   ├── knowledge/     # KB management
│   │   ├── analytics/     # Dashboards
│   │   ├── settings/      # Workspace, AI, integrations
│   │   └── admin/         # Super Admin panel
│   └── components/
│
├── backend/               # Node.js + Express (TypeScript)
│   ├── src/
│   │   ├── routes/        # Express route handlers
│   │   ├── middleware/    # Auth, RBAC, rate-limit
│   │   ├── services/      # Business logic
│   │   ├── ai/            # LLM, RAG, embeddings (LangChain.js)
│   │   ├── jobs/          # BullMQ background jobs
│   │   ├── integrations/  # Gmail adapter
│   │   └── utils/
│   └── prisma/            # Prisma schema + migrations
│
├── shared/                # Shared Zod schemas (frontend + backend)
├── docker-compose.yml
└── .github/workflows/     # CI/CD
```
