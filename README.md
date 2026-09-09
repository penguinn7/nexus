# NEXUS

NEXUS is an AI-native knowledge management environment. You drop in your material —
documents, notes, webpages, YouTube videos — and it builds a living knowledge graph of
concepts and connections, then answers questions grounded in your own sources plus live
web research.

## Features

- **Spaces** — separate environments per subject, project or business, each with its own
  atmosphere (theme).
- **Universal "Add anything" widget** — a floating corner control and drag-and-drop anywhere
  to add PDF, TXT, MD, CSV files, webpages, or YouTube videos.
- **Ask NEXUS** — a persistent AI panel per Space that searches your sources in context and
  answers with citations. Two modes:
  - *Conversation* — chat with your material.
  - *Research* — reads your sources AND researches the live web with `[Web: …]` citations.
- **Knowledge Graph** — concepts and connections are extracted automatically from your
  material, visualized per Space and as an aggregate across all Spaces.
- **Notes & sources** — classic capture surface alongside the AI layer.
- **AI insights** — per-Space summaries of what you have and what is missing.
- **Feedback inbox** — an in-app "Send feedback" control on every screen feeds a
  Settings inbox so you always hear what users want.
- **Auth & email verification** — Supabase Auth with custom SMTP, plus a resend-verification
  endpoint and friendly account flow.
- **Rate limiting** — per-user, per-AI-feature budgets to keep costs sane.
- **Light & dark themes** plus per-Space custom color atmospheres.

## Tech stack

- Next.js 16 (App Router, React 19, TypeScript, Turbopack)
- Tailwind CSS v4
- Supabase (Postgres, Auth, storage) with the SSR client
- Google AI (Gemini) for reasoning and extraction
- Tavily for live web research
- Deployed on Vercel

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in the values (see table below).

4. Apply the database schema (a Supabase project with the SQL from
   `supabase/scripts/reset_schema.sql` applied):

   ```bash
   npx supabase db push   # or run the SQL via the Supabase dashboard SQL editor
   ```

5. Run locally:

   ```bash
   npm run dev
   ```

Open http://localhost:3000, create an account, make a Space, add a source, then "Ask
NEXUS".

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase publishable key (safe for the browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase secret key — server only |
| `GEMINI_API_KEY` | Yes | Google AI API key (server only) |
| `GEMINI_MODEL` | No | Model id, e.g. `gemini-3.5-flash` |
| `TAVILY_API_KEY` | No | Enables live web research in Research mode |
| `AI_RATE_LIMIT_PER_HOUR` | No | Default hourly AI budget per user (default 40) |

Prefix tells you where each value is read: `NEXT_PUBLIC_*` is exposed to the browser;
everything else is server-only. When deploying on Vercel, enter each variable once in the
project settings and redeploy.

## Deployment

This repo does not auto-deploy from Git; deploy with the CLI:

```bash
npx vercel@latest --prod
```

The app reads `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` at runtime, so
they must be present on the platform.

## Project structure

```
app/
  page.tsx                       # Landing page
  login/ signup/ auth/confirm/   # Auth flow
  workspace/                     # Workspace overview
  space/[spaceId]/               # One Space: tabs + intelligence panel
  api/
    ai/chat|note|insights|status # AI endpoints
    sources      [id]|add        # Resource ingestion
    auth/resend logout           # Auth helpers
    conversations/[id]
    feedback                     # Sends user feedback to the inbox
components/nexus/                # Shared UI (sidebar, overlays, theming)
lib/
  ai/                            # Provider resolution, search, rate limiting
  ingest/                        # PDF / text / webpage / YouTube processing
  supabase/                      # Server + browser clients
supabase/scripts/reset_schema.sql# Database schema
```

## Notes

- `GET /api/ai/status` returns which AI capabilities are configured on the server
  (boolean only — no secrets).
- `feedback` table: `id`, `user_id`, `user_email`, `content`, `page`, `created_at`.
  Create it with the SQL below, run in the Supabase dashboard SQL editor.
- Custom SMTP for auth emails is configured in Supabase (e.g. Gmail app password).
- AI rate limits are in-memory per instance; they reset on redeploy and scale per
  server instance.

```sql
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text,
  content text not null,
  page text,
  created_at timestamptz not null default now()
);
alter table public.feedback enable row level security;
```

## License

Private project. Do not distribute without permission.