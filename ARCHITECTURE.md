# Architecture

Repo: `MicroAutoSaas` — a productized lead-to-cash system for local service businesses.
First tenant: South Valley Electric LLC (Cottage Grove, OR).

Guiding principle from the brief, kept: **boring, cheap, reliable.** No Kubernetes, no
microservices, no queue broker. Next.js API routes, Postgres, and cron.

---

## 1. Tenancy model

One codebase. **Tenant-aware schema from day one, one Vercel deployment per client.**

Why both: §11 of the brief promises each client owns their own Twilio number, Stripe
account and Google account. Per-client third-party credentials cannot share a single
runtime without a secret-per-request indirection we do not need at n=1. So each client
gets their own Vercel project and env vars, while every table carries `tenant_id` and
every query is scoped through the tenant context. If we later consolidate to shared
infrastructure, the data layer already supports it; if we didn't do this now, it would be
a rewrite. See `DECISIONS.md` D-002.

A tenant's non-secret configuration (business name, service area, CCB number, service
list, hours, brand colors) lives in `src/config/tenants/<slug>.ts`, typed and validated.
Secrets live only in env.

---

## 2. Layers

```
┌───────────────────────────────────────────────┐
│ PUBLIC       Next.js 15 App Router on Vercel  │
│   (marketing)  static/ISR marketing site      │
│   /api/*       webhooks, form intake, cron    │
│   /dashboard   owner view (Supabase Auth)     │
└───────────────┬───────────────────────────────┘
                │
┌───────────────▼───────────────────────────────┐
│ COMMUNICATION  Twilio                         │
│   voice: local 541 number → owner, missed →   │
│          text-back                            │
│   sms:   verified toll-free number (primary)  │
│   every inbound request signature-validated   │
└───────────────┬───────────────────────────────┘
                │
┌───────────────▼───────────────────────────────┐
│ LOGIC          src/lib/*                      │
│   lead state machine (pure, unit-tested)      │
│   Claude qualification agent (turn + $ caps)  │
│   Vercel Cron → reminders, review requests    │
│   idempotency via webhook_events              │
└───────────────┬───────────────────────────────┘
                │
┌───────────────▼───────────────────────────────┐
│ DATA           Supabase Postgres + Storage    │
│   RLS on every table; service role server-only│
│ INTEGRATIONS   Google Calendar · Stripe ·     │
│                Resend · Google Business       │
└───────────────────────────────────────────────┘
```

## 3. Folder structure

```
src/
  app/
    (marketing)/        public site — static/ISR, no client JS beyond CTAs
    api/                webhooks (twilio, stripe), forms, cron
    dashboard/          owner-only, Supabase Auth
  components/
    marketing/          page sections
    ui/                 primitives
  config/
    tenants/            <slug>.ts — non-secret per-client config, typed
  lib/
    tenant/             tenant resolution + typed env loader
    supabase/           browser + server clients, typed DB
    twilio/             signature validation, send, voice TwiML
    anthropic/          qualification agent, prompts, budget guard
    stripe/             checkout, invoices, webhook handling
    google/             calendar
    email/              Resend templates
    leads/              lead state machine (pure functions, tested first)
  types/
supabase/migrations/    SQL migrations, source of truth for schema
tests/{unit,integration}/
docs/                   REVIEW.md, runbook, discovery notes
```

## 4. Data model

Corrections to BRIEF §6 are marked **NEW**. Rationale in `docs/REVIEW.md` §2.2.

```sql
-- NEW: every row in the system is scoped to a tenant
tenants (
  id uuid pk, slug text unique, business_name text,
  ccb_number text, timezone text, created_at timestamptz
)

-- NEW: dashboard auth
owner_users (
  id uuid pk, tenant_id uuid fk, auth_user_id uuid, email text, role text
)

leads (
  id uuid pk, tenant_id uuid fk,                       -- NEW tenant_id
  created_at timestamptz,
  source text,            -- missed_call | web_form | sms | manual
  name text, phone text, email text, address text,
  job_type text,          -- panel_upgrade | ev_charger | rewire | troubleshoot | other
  urgency text,           -- emergency | this_week | flexible
  description text,
  status text,            -- new | qualifying | qualified | quoted | booked | won | lost
  photos text[], estimated_value numeric,
  consent_status text,    -- NEW: none | initiated_contact | express_written
  opted_out_at timestamptz,                             -- NEW: STOP honored
  agent_turns int default 0,                            -- NEW: AI turn cap
  owner_notified_at timestamptz,
  unique (tenant_id, phone, created_at::date)           -- NEW: dedupe intent
)

-- NEW: replaces leads.transcript jsonb. Concurrent inbound SMS cannot
-- safely read-modify-write a single JSON column.
messages (
  id uuid pk, tenant_id uuid fk, lead_id uuid fk,
  direction text,         -- inbound | outbound
  channel text,           -- sms | voice | email
  body text, provider_sid text, status text, created_at timestamptz
)

-- NEW: TCPA evidence. BRIEF §7.1 requires this and had nowhere to store it.
consent_events (
  id uuid pk, tenant_id uuid fk, lead_id uuid fk,
  phone text, kind text,  -- form_checkbox | inbound_call | inbound_sms | opt_out
  disclosure_text text,   -- exact language shown, versioned
  ip inet, user_agent text, created_at timestamptz
)

-- NEW: Twilio and Stripe both retry. Without this, retries re-send texts
-- and re-charge cards.
webhook_events (
  id uuid pk, provider text, provider_event_id text,
  received_at timestamptz, processed_at timestamptz, payload jsonb,
  unique (provider, provider_event_id)
)

jobs (
  id uuid pk, tenant_id uuid fk, lead_id uuid fk,
  scheduled_start timestamptz, scheduled_end timestamptz,
  calendar_event_id text,
  status text,            -- scheduled | in_progress | complete | cancelled
  actual_completion timestamptz, notes text
)

documents (
  id uuid pk, tenant_id uuid fk, job_id uuid fk,
  type text,              -- estimate | invoice
  line_items jsonb, total numeric, stripe_id text,
  status text,            -- draft | sent | viewed | signed | paid | overdue
  template_version text,                                -- NEW: which owner template
  signed_name text, signed_ip inet, signed_at timestamptz,
  document_hash text,                                   -- NEW: ESIGN audit trail
  sent_at timestamptz, paid_at timestamptz
)

review_requests (
  id uuid pk, tenant_id uuid fk, job_id uuid fk,
  sent_at timestamptz, clicked_at timestamptz, reviewed boolean default false
)

settings (
  id uuid pk, tenant_id uuid fk, key text, value jsonb,
  unique (tenant_id, key)                               -- NEW: was global unique
)
```

RLS: enabled on every table. Owner users read only their own `tenant_id`. The service
role key is used exclusively in server-side code (webhooks, cron) and is never exposed to
the browser.

## 5. Key flows

**Missed call → lead.** Inbound call → TwiML dials the owner → no answer within N rings →
`/api/twilio/voice/status` (signature-validated, idempotent on `CallSid`) → create
`lead(source='missed_call', consent_status='initiated_contact')` → SMS from the verified
toll-free number, self-identifying as an assistant, with STOP language → owner alerted.

**Qualification.** Inbound SMS → `messages` row → agent loads lead + history → Claude
extracts structured fields → updates lead → replies. Bounded by max turns, a per-tenant
daily token budget, and an explicit handoff-to-owner exit. `urgency='emergency'`
short-circuits everything and places a call to the owner.

**Job → cash.** Booked job → calendar event → completion → estimate/invoice from the
owner's template (variables only, never generated legal language) → Stripe link →
reminders at 3/7/14 days via cron → review request after payment clears.

## 6. Non-negotiable security bar

Nothing goes live without all six:

1. Twilio request-signature validation on every Twilio webhook.
2. Stripe webhook-signature validation.
3. `CRON_SECRET` bearer check on every cron route.
4. RLS on every table; service role server-only.
5. Rate limiting + spam heuristics on the public form and inbound SMS.
6. Sentry alerting on webhook failure, plus a daily synthetic lead check.

## 7. Cost baseline

Vercel Pro $20 (Hobby is not licensed for commercial use) + Supabase Pro $25 (free
projects pause on inactivity) + Twilio ~$15–40 + Claude ~$5–20 + Resend $0–20 + domain ~$2
≈ **$70–125/mo** per tenant against an $850/mo retainer.
