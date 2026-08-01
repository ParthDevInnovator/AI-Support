# 🤖 AI Support Triage Platform

> An AI-powered customer support triage SaaS that automatically analyses incoming tickets, generates smart reply drafts, flags escalations, and helps support teams move faster.

[![CI](https://github.com/ParthDevInnovator/AI-Support/actions/workflows/ci.yml/badge.svg)](https://github.com/ParthDevInnovator/AI-Support/actions/workflows/ci.yml)

---

## ✨ Features (Phase 1 Scope)

- 🧠 **AI Ticket Analysis** — Gemini classifies every new ticket by category, sentiment, priority, urgency, and language
- ✍️ **AI Reply Generation** — One-click draft replies with Professional / Empathetic / Concise tone selectors
- 🚨 **Auto-Escalation Flagging** — Low-confidence tickets are automatically surfaced for human review
- 🎫 **Ticket Inbox UI** — Full filter/search/bulk-action inbox with real-time Socket.io updates
- 🔐 **Multi-tenant Auth** — JWT + Google OAuth, RBAC (Admin / Agent / Super-Admin)
- 👥 **Team Management** — Invite members via email, manage roles, deactivate users
- 🏢 **Super Admin Panel** — Org-level oversight, suspend/reactivate tenants

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Axios |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM |
| **Database** | Supabase (PostgreSQL + pgvector) |
| **Queue / Jobs** | BullMQ + Upstash Redis |
| **AI** | Google Gemini API (`@google/generative-ai`) |
| **Auth** | JWT (access + refresh tokens), Passport.js (Google OAuth) |
| **Email** | Nodemailer + Gmail SMTP |
| **Monorepo** | pnpm workspaces |
| **CI/CD** | GitHub Actions → Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
ai-support-triage/
├── frontend/               # Next.js 14 App Router
│   └── src/
│       ├── app/
│       │   ├── (auth)/     # Login, Register, OAuth pages
│       │   ├── dashboard/  # Main dashboard
│       │   └── tickets/    # Ticket inbox & detail
│       ├── components/     # Reusable UI components
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # axios, query-provider
│       └── store/          # Zustand global state
├── backend/                # Express API server
│   ├── prisma/             # Prisma schema & migrations
│   └── src/
│       ├── routes/         # API route handlers
│       ├── middleware/      # Auth, error handling, RBAC
│       ├── services/       # Business logic
│       ├── ai/             # Gemini integration
│       ├── jobs/           # BullMQ queues & workers
│       ├── integrations/   # Third-party integrations
│       └── utils/          # Helpers & utilities
├── shared/                 # Shared TypeScript types & Zod schemas
│   └── src/
│       ├── schemas/        # auth, ticket, user, organization schemas
│       └── types/          # Shared enums & type definitions
├── .github/workflows/      # CI/CD GitHub Actions
├── docker-compose.yml      # Local Postgres + Redis
└── .env.example            # Environment variable template
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v11+ (`npm install -g pnpm`)
- [Docker](https://www.docker.com/) (for local Postgres + Redis)

### 1. Clone the repo

```bash
git clone https://github.com/ParthDevInnovator/AI-Support.git
cd AI-Support
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in the values in `.env`. Key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_ACCESS_SECRET` | Random 64-char secret |
| `JWT_REFRESH_SECRET` | Random 64-char secret |
| `GEMINI_API_KEY` | From [Google AI Studio](https://aistudio.google.com) |
| `GOOGLE_CLIENT_ID` | Google OAuth credentials |
| `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Gmail SMTP for emails |

### 4. Start local infrastructure

```bash
docker-compose up -d
```

This boots PostgreSQL (port `5432`) and Redis (port `6379`) locally.

### 5. Run database migrations

```bash
pnpm --filter backend db:push
```

### 6. Start the development servers

```bash
pnpm run dev
```

This concurrently starts:
- **Backend API** → `http://localhost:4000`
- **Frontend UI** → `http://localhost:3000`

---

## 🔑 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | API health check |
| `POST` | `/api/auth/register` | Create org + admin user |
| `POST` | `/api/auth/login` | Login, receive JWT |
| `POST` | `/api/tickets` | Create ticket |
| `GET` | `/api/tickets` | List tickets with filters |
| `POST` | `/api/tickets/:id/ai/generate-reply` | Generate AI reply draft |

---

## 🤝 CI / CD

| Workflow | Trigger | Action |
|---|---|---|
| `ci.yml` | Pull Request → `main` | Lint + Typecheck |
| `deploy-frontend.yml` | Push → `main` (frontend changes) | Deploy to **Vercel** |
| `deploy-backend.yml` | Push → `main` (backend changes) | Deploy to **Render** |

### Required GitHub Secrets

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
RENDER_DEPLOY_HOOK_URL
```

---

## 🗺️ Development Roadmap

| Sprint | Days | Focus | Status |
|---|---|---|---|
| Sprint 1 | 1–4 | Monorepo, backend & frontend bootstrap, CI/CD | ✅ Done |
| Sprint 2 | 5–7 | Prisma schema design + DB migrations | 🔄 In Progress |
| Sprint 3 | 8–13 | Authentication (JWT, Google OAuth, RBAC) | 🔜 Upcoming |
| Sprint 4 | 14–22 | Ticket management APIs + Inbox UI | 🔜 Upcoming |
| Sprint 5 | 23–30 | AI ticket analysis via Gemini + BullMQ | 🔜 Upcoming |
| Sprint 6 | 31–38 | AI reply generation + editor flow | 🔜 Upcoming |
| Sprint 7 | 39–46 | Team management + Super Admin panel | 🔜 Upcoming |

---

## 📄 License

Private — All rights reserved.
