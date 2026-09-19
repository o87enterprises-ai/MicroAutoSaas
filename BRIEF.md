# Project Brief: South Valley Electric — Digital Foundation & Lead-to-Cash Automation

**Client:** South Valley Electric LLC — Electrical Contractor, Cottage Grove, OR
**Status:** Pre-discovery. Everything in §2 is a hypothesis to validate.
**Engagement type:** First client of a productized local-business offer (this repo, `MicroAutoSaas`).

> Editing rule: this file is the *client-facing plan as originally written*. Engineering
> pushback, corrections and the plan we are actually building to live in
> [`docs/REVIEW.md`](docs/REVIEW.md). Where the two disagree, REVIEW.md wins for
> implementation and BRIEF.md wins for describing intent to the client.

---

## 1. One-line summary

Build a complete digital foundation and automated lead-to-cash pipeline for a Cottage
Grove electrical contractor that currently has no website and minimal digital presence —
turning inbound demand into booked, paid jobs without the owner touching a phone.

## 2. Discovery findings (unvalidated)

| Finding | Detail | Confidence |
| --- | --- | --- |
| No website | No site found in directory listings or search | High |
| Minimal digital presence | Weak or absent Google Business Profile | High |
| Business category | Electrical contractor — residential / light commercial service | Medium |
| Location | Cottage Grove, OR (Lane County) | Confirmed |
| Owner / contact | UNKNOWN — to be identified | — |
| Phone number | UNKNOWN — to be captured | — |
| CCB license # | UNKNOWN — required for site footer | — |
| Team size | UNKNOWN — assume owner + 0–2 helpers | Low |
| Existing tools | UNKNOWN — assume none | Low |

The gap is the opportunity: Lane County competitors with websites, reviews and online
booking are capturing jobs this business loses to missed calls.

## 3. Strategic thesis

Greenfield build, not an integration:

- Higher setup fee is justified ($3,000–$5,000 vs $2,000).
- No integration debt — we choose the tools.
- Total dependency risk once live → strong retention (and an obligation to be careful).
- Faster build — no legacy systems to reverse-engineer.

Pitch: *"You're losing jobs to competitors who show up online. I'll build the whole
system — website, 24/7 answering, booking, estimates, invoicing, reviews — and it runs
itself."*

**Critical risk to test first:** no digital presence may mean the owner is already fully
booked, or is tech-averse and won't buy. Discovery must resolve this before any build.

## 4. Scope of work — phased

**Phase 0 — Foundation (wk 1–2):** Google Business Profile claim + optimization; domain +
DNS; Twilio number provisioning and A2P 10DLC registration; call routing.

**Phase 1 — Website (wk 2–3):** 5–7 static pages (Home, Services, Service Area, About,
Reviews, Contact, Estimate Request); mobile-first, <1.5s LCP; `LocalBusiness` +
`Electrician` schema; click-to-call and SMS CTAs above the fold; CCB # and insurance
statement in footer. No site chatbot initially.

**Phase 2 — Lead capture (wk 3–4):** missed-call text-back within 30s; web form → SMS +
email alert; AI SMS qualification agent (job type, address, urgency, photos); lead record
with full transcript.

**Phase 3 — Booking & estimates (wk 4–6):** Google Calendar integration; AI proposes and
books slots; estimate generated from the owner's pricing template; e-signature + Stripe
deposit.

**Phase 4 — Invoicing & reviews (wk 6–7):** auto-invoice on completion with Stripe payment
link; reminders at 3/7/14 days; post-payment Google review request; monthly owner
dashboard.

## 5. Technical architecture

Guiding principle: boring, cheap, reliable. See [`ARCHITECTURE.md`](ARCHITECTURE.md) for
the implemented design.

| Layer | Choice |
| --- | --- |
| Hosting | Vercel |
| Framework | Next.js 15 (App Router) |
| Database | Supabase Postgres |
| SMS / voice | Twilio |
| AI | Claude API |
| Payments | Stripe |
| Email | Resend |
| File storage | Supabase Storage |
| Monitoring | Vercel logs + Sentry |

## 6. Data model

Conceptual tables: `leads`, `jobs`, `documents` (estimates + invoices), `review_requests`,
`settings`. The authoritative schema — including the tables this list is missing — is in
[`ARCHITECTURE.md`](ARCHITECTURE.md) §Data model.

## 7. Compliance & risk — read before building

1. **TCPA / SMS consent.** Automated texts need prior express consent. Missed-call
   text-back is defensible (caller initiated), but must carry opt-out language. The web
   form needs an explicit consent checkbox and a consent log (timestamp + IP). Budget
   $300–$800 for a lawyer to review the SMS flow before launch.
2. **A2P 10DLC.** Brand + campaign registration is required before sending at volume.
   1–3 weeks, can be rejected. Start week 1. Do not promise a launch date before it clears.
3. **Oregon CCB.** The site must display the contractor's CCB license number.
4. **Estimate / contract language.** Oregon has specific written-estimate and lien-notice
   requirements. Claude does not generate legal language; automation fills variables into
   the owner's existing template.
5. **AI disclosure.** The SMS agent identifies itself as an assistant. Never impersonate
   the owner.
6. **Data minimization.** Store only what's needed, encrypt at rest, provide a deletion path.

## 8. Environment variables

See [`.env.example`](.env.example).

## 9. Build order

Original sprint plan was ~5 weeks (sprints 0–8) plus 1–3 weeks of 10DLC buffer. The
revised, dependency-ordered plan we are building to is in
[`docs/REVIEW.md`](docs/REVIEW.md) §3.

## 10. Deliverables checklist

- [ ] Live website with local SEO
- [ ] Claimed + optimized Google Business Profile
- [ ] Twilio number with missed-call text-back
- [ ] AI SMS qualification agent
- [ ] Calendar booking integration
- [ ] Estimate generation + e-signature + deposit
- [ ] Auto-invoicing + payment reminders
- [ ] Review request automation
- [ ] Owner dashboard
- [ ] Written runbook (pricing, hours, service area)
- [ ] 30-day post-launch support window

## 11. Pricing & packaging

| Item | Price |
| --- | --- |
| Digital Foundation setup (site + GBP + Twilio) | $2,500 |
| Automation build (lead-to-cash pipeline) | $2,000 |
| **Total setup** | **$4,500** |
| Monthly retainer | $850/mo |
| SMS / API pass-through | at cost + 15% |

ROI framing for the owner: one recovered panel upgrade (~$3,500) or two recovered service
calls per month pays the retainer. Frame in jobs, not software.

Terms: 12-month retainer minimum; setup 50% upfront, 50% at launch. We own the code; the
client owns the domain, Twilio number, Google account and Stripe account. Never hold
client assets hostage, and never let them be held hostage.

## 12. Assumptions to validate in discovery

1. Does the owner want more work, or are they capacity-constrained?
2. Average job value? (ROI framing)
3. How many calls per week go unanswered?
4. CCB license and insurance certificate — current?
5. Current scheduling/invoicing tools?
6. Who is the decision-maker?
7. Current monthly marketing spend? (pricing anchor)
8. Existing phone number they want to keep?
9. Comfortable with AI handling first contact?
10. Target live date?

## 13. Immediate next actions

1. Identify the owner and phone number; book an honest discovery call (see REVIEW.md §5 —
   do **not** place a fake service call).
2. Check Oregon CCB license status.
3. Survey "electrician Cottage Grove" on Google Maps for competitive landscape and GBP status.
4. Start 10DLC / toll-free verification as soon as a Twilio account exists — it is the long pole.
5. Answer §12 before building anything client-specific.
