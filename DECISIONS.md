# Decision Log

Append-only. Each entry records what we chose, what we rejected, and why — this is the
document that makes handoff defensible.

---

**D-001 — Next.js 15 (App Router) on Vercel, TypeScript, Tailwind.**
*Decided 2026-09-19.* One codebase serves the marketing site, the webhooks and the owner
dashboard. Rejected: separate static site + separate API service (two deploys, two sets of
secrets, no benefit at this size). **Vercel Pro, not Hobby** — Hobby is not licensed for
commercial use and caps cron at once per day.

**D-002 — Tenant-aware schema, one deployment per client.**
*Decided 2026-09-19.* Every table carries `tenant_id`; each client gets their own Vercel
project and env vars. Rejected: (a) single-tenant hardcoded — would be a rewrite at client
#2; (b) full shared multi-tenant runtime now — the brief promises clients own their own
Twilio/Stripe/Google accounts, so credentials are per-client and would need a
secret-per-request indirection we don't need at n=1. This keeps consolidation cheap later
without paying for it today.

**D-003 — Supabase Postgres (Pro tier).**
*Decided 2026-09-19.* Postgres + Auth + Storage + RLS in one product, and job photos need
storage anyway. Free tier rejected: projects pause after ~a week of inactivity, and a
sleeping lead pipeline is a total failure of the product's promise.

**D-004 — Verified toll-free number for SMS; local 541 number for voice.**
*Decided 2026-09-19.* Toll-free verification typically clears in days where A2P 10DLC
takes 1–3 weeks and can be rejected, and 10DLC was scheduled ahead of the core demo in the
original plan. Locals trust a 541 number for calling, so voice keeps one. Both
registrations are submitted on day 0; 10DLC remains the fallback/long-term path.

**D-005 — Messages are rows, not a JSON transcript column.**
*Decided 2026-09-19.* `leads.transcript jsonb` loses messages under concurrent inbound
SMS (read-modify-write). A `messages` table also gives per-message delivery status and
provider SIDs for debugging.

**D-006 — Idempotency table for all provider webhooks.**
*Decided 2026-09-19.* Twilio and Stripe both retry. `webhook_events` keyed on
`(provider, provider_event_id)` prevents duplicate texts and double charges.

**D-007 — Consent is a first-class table.**
*Decided 2026-09-19.* TCPA damages are $500–$1,500 per message; the defense is evidence.
`consent_events` stores the exact disclosure text shown, IP, user agent and timestamp.

**D-008 — The AI agent never writes legal or pricing language.**
*Decided 2026-09-19.* Estimates and invoices fill variables into the owner's existing
Oregon-compliant template, versioned via `documents.template_version`. Claude is used for
qualification (extracting structured fields from conversation) and for drafting the
*non-legal* job description only.

**D-009 — Proactive AI disclosure.**
*Decided 2026-09-19.* The first outbound message identifies the sender as an automated
assistant, rather than only disclosing when asked. Costs one line; removes an entire class
of complaint and gets ahead of tightening state rules.
