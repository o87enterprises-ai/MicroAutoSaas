# Engineering Review of BRIEF.md

Date: 2026-09-19. Author: Claude Code. Status: pre-build.

This is the adversarial read of the brief requested in §13. Nothing here is a reason not
to do the project — it's the list of things that would have bitten us in week 3.

---

## 1. Contradictions in the brief

### 1.1 The sprint plan is not dependency-ordered — 10DLC blocks the core demo

Sprint 2 (days 5–7) is "Twilio missed-call webhook → auto-SMS working end-to-end", but
§7.2 says A2P 10DLC takes 1–3 weeks and can be rejected. The single most important
feature in the pitch is gated behind the single slowest external dependency, and it is
scheduled for week 1. As written the plan cannot be executed.

**Fix (two parts, both in the revised plan):**
- Submit registration on **day 0**, before any code.
- Register a **toll-free number with toll-free verification** as the primary path
  instead of a 10DLC local number. Toll-free verification is typically days rather than
  weeks, has higher throughput, and is well suited to a single-business notification +
  conversational use case. Keep a local number for *voice* (locals trust a 541 number),
  and send SMS from the verified toll-free number. This is the single highest-leverage
  change to the schedule.

### 1.2 "Do not build the site until you have the CCB number" over-blocks

§7.3 forbids building the site pre-CCB; sprint 1 builds it on days 2–4. Both can be true:
the CCB number is a *publication* gate, not a *build* gate. Build the site with the number
as a required config value that throws at build time if unset for a production deploy.
Nothing ships to a public domain without it.

### 1.3 The pricing alternative is not "the same total"

§11 says $1,500 setup + $1,200/mo for 12 months is the "same total" as $4,500 + $850/mo.
It isn't: **$15,900 vs $14,700** — the fallback is $1,200 *more expensive* over the term
and it's the one offered to a price-resistant buyer. Either restate it honestly as a
financing structure ("lower upfront, costs a bit more overall") or reprice the fallback to
$1,500 + $1,100/mo ($14,700). Do not present an arithmetic error to a client who will
multiply it out.

### 1.4 "Free tier covers this" is wrong for a paid client project

- **Vercel Hobby is not licensed for commercial use**, and Hobby cron jobs are limited to
  once per day. Phase 4 needs 3/7/14-day reminder sweeps — daily is arguably enough, but
  the commercial-use term is not negotiable. Budget **Vercel Pro, $20/mo**.
- **Supabase free projects pause after ~1 week of inactivity.** A contractor's lead
  pipeline going to sleep is a catastrophic failure mode. Budget **Supabase Pro, $25/mo**.
- Realistic monthly COGS: Vercel $20 + Supabase $25 + Twilio ~$15–40 + Claude ~$5–20 +
  Resend $0–20 + Sentry $0 + domain ~$2 ≈ **$70–125/mo** against an $850/mo retainer.
  Healthy, but it is not zero, and §11's "pass-through at cost + 15%" needs to state
  exactly which of these are passed through vs absorbed.

### 1.5 §14.1 "call as a prospective customer" is a bad idea

Placing a fake service call to a one-or-two-person contractor means taking up a working
electrician's time under false pretenses, and possibly pulling them off a job site. If
they ever find out — and in a town of ~10,000 they might — the relationship is dead
before it starts, and it's exactly the sort of thing that gets repeated locally. The
information gained (how fast do they answer) is obtainable honestly: call and say who you
are and why. Whether they answer at all *is* the datapoint.

### 1.6 AI disclosure should be proactive, not reactive

§7.5 says the agent identifies itself "if asked directly." Put the disclosure in the
**first** outbound message ("This is South Valley Electric's automated assistant"). It
costs one line, it removes the entire class of "your robot pretended to be a person"
complaints, and disclosure requirements are tightening in several states.

---

## 2. Gaps — things the brief does not mention that will block the build

### 2.1 This repo is `MicroAutoSaas`, but the brief describes one client

The stated intent is an offer sold to many local businesses, with South Valley Electric as
client #1. The brief has no tenancy model at all. Decision (see `DECISIONS.md` D-002):
**tenant-aware schema from day one, one deployment per client at launch.** Every table
carries `tenant_id` and every query is scoped, but each client gets their own Vercel
project and their own env vars — because §11 promises the *client* owns their Twilio,
Stripe and Google accounts, which means per-client credentials that cannot live in one
shared runtime. Shared-infrastructure consolidation is cheap later if the schema is right
now, and impossible later if it isn't.

### 2.2 The data model is missing five tables it needs

- **`consent_events`** — §7.1 *requires* a consent log with timestamp and IP; the schema
  has nowhere to put one. This is the single most expensive omission in the brief: TCPA
  statutory damages are $500–$1,500 *per message*.
- **`messages`** — `leads.transcript jsonb` cannot be appended to concurrently. Two SMS
  arriving at once will lose one via read-modify-write. Messages are rows.
- **`webhook_events`** — Twilio and Stripe both retry. Without a table keyed on the
  provider's event ID, a retried delivery re-sends texts and re-charges cards.
- **`tenants`** and **`owner_users`** — no tenancy, no dashboard auth in the schema.
- Plus: `leads` has no `consent_status`, no `opted_out_at`, and no dedupe key on phone.

### 2.3 No security requirements anywhere

The brief has a compliance section but no security section. Minimum bar before any
webhook goes live: Twilio request-signature validation, Stripe webhook-signature
validation, `CRON_SECRET` on cron routes, Supabase RLS on every table with the service
role confined to server code, and rate limiting on the public form. Right now the brief
would let anyone POST fake leads, or worse, fake "job complete" events that fire invoices.

### 2.4 No cost controls on the AI agent

An SMS qualification agent with no per-conversation message cap and no per-tenant daily
token budget is an open invoice. One confused or hostile texter can loop it indefinitely.
Need: max turns per lead, daily spend ceiling, and a hard "hand off to owner" exit.

### 2.5 Operational gaps

- **Emergencies.** An electrical emergency at 2am is the highest-value call there is. The
  brief never defines what the system does with `urgency = 'emergency'`. It must escalate
  to a real phone call to the owner, not sit in a queue.
- **Spam and wrong numbers.** Every published phone number gets them; every one currently
  becomes a `lead` row and burns Claude tokens.
- **Failure alerting.** "Sentry free tier" is listed as monitoring, but nobody defined who
  gets paged when the missed-call webhook is down. If that breaks silently, the client is
  paying $850/mo to lose leads faster.
- **E-signature audit trail.** Phase 3 treats e-signature as a checkbox. To be worth
  anything under ESIGN/UETA it needs intent-to-sign, the signed document hash, IP,
  timestamp, and a copy delivered to the signer. Either use a provider or build those five
  things deliberately.

### 2.6 Two hard external dependencies on the owner

Neither can be worked around, both should be asked for on the discovery call, and both
block Phase 3:
1. Their existing **written estimate template** (§7.4 forbids generating the language).
2. Their **pricing** — hourly rate, trip charge, common flat-rate items.

Add to §12: *does anyone else need to see leads (spouse, office manager)?* and *what
happens today when they're on a ladder and the phone rings?*

---

## 3. Revised sprint plan

Reordered so that external approvals run in parallel with build, and so that each sprint
ends with something demonstrable to the client.

| Sprint | Days | Deliverable | Gated by |
| --- | --- | --- | --- |
| **−1** | — | **Discovery call.** BRIEF §12 answered, CCB # and insurance verified, pricing + estimate template obtained, deposit signed. | — |
| **0** | 1 | Twilio account, toll-free verification **and** 10DLC submitted (day 0, before code). Domain registered. Supabase + Vercel projects. Sentry. | — |
| **1** | 2–3 | Schema + migrations + RLS, tenant config, typed env loader. Tests for the lead state machine. | — |
| **2** | 4–6 | Marketing site on a preview URL. Not published. | — |
| **3** | 7–8 | Web form → lead row → owner SMS/email alert, with consent capture. Works without carrier approval (alerts go to the owner, who consented). | — |
| **4** | 9–11 | Voice routing + missed-call text-back + Twilio signature validation. | TF verification |
| **5** | 12–15 | Claude SMS qualification agent: turn caps, budget ceiling, emergency escalation, owner handoff. | Sprint 4 |
| **6** | 16–18 | Google Calendar + booking. | — |
| **7** | 19–22 | Estimates from the owner's template + e-sign audit trail + Stripe deposit. | Owner's template |
| **8** | 23–25 | Invoicing, reminders, review requests (cron). | — |
| **9** | 26–28 | Owner dashboard, runbook, load test at 50 and 500 leads/week, handoff. | — |
| **Launch** | — | Publish site, point DNS, GBP live, lawyer sign-off on SMS flow. | CCB #, legal review, carrier approval |

Net: the same ~5–6 weeks, but nothing is scheduled behind an approval it can't have yet,
and the client sees a working demo on day 8 instead of day 7-that-slips-to-day-25.

---

## 4. Risks ranked by what they cost

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Owner doesn't want more work / won't buy | Project dies after build | Discovery call **before** any client-specific build. Non-negotiable. |
| TCPA violation | $500–$1,500 per message | `consent_events` table, opt-out on every campaign message, STOP honored, lawyer review pre-launch |
| Carrier registration rejected | Launch slips weeks | Toll-free path + 10DLC in parallel from day 0 |
| Missed-call webhook fails silently | Client pays to lose leads | Sentry alerts + a daily synthetic test call + dashboard "last lead received" timestamp |
| Webhook replay | Duplicate texts / double charges | `webhook_events` idempotency table |
| AI agent runs up cost or goes off-script | Money + reputation | Turn caps, spend ceiling, disclosure, owner handoff |
| Client owns accounts but we hold keys | Handoff dispute | Document every account owner in the runbook at creation time, not at handoff |
| Single client = 100% revenue concentration | Business risk | This repo is the productization; keep it tenant-aware |

---

## 5. What I recommend you do before writing feature code

1. Book the discovery call. Honestly, as yourself — not as a fake customer (§1.5).
2. Come back from it with: CCB #, insurance cert, existing phone number, estimate
   template, pricing sheet, and a yes/no on AI first contact.
3. Open the Twilio account and submit toll-free verification the same day.

Everything in §3 sprint 1 onward is buildable the moment those three are done.
