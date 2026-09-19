# MicroAutoSaas

A productized digital-foundation and lead-to-cash system for local service businesses:
website, missed-call text-back, AI SMS qualification, booking, estimates, invoicing and
review requests — one codebase, one deployment per client.

**First tenant:** South Valley Electric LLC — electrical contractor, Cottage Grove, OR.

## Read these first

| Document | What it is |
| --- | --- |
| [`BRIEF.md`](BRIEF.md) | The client-facing plan, as written. Intent and pricing. |
| [`docs/REVIEW.md`](docs/REVIEW.md) | Engineering critique, gaps, and the **revised sprint plan we build to**. |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Tenancy model, folder structure, corrected schema, security bar. |
| [`DECISIONS.md`](DECISIONS.md) | Why each tool and design choice was made. Append-only. |
| [`.env.example`](.env.example) | Every variable the app reads. |

Where BRIEF.md and REVIEW.md disagree, REVIEW.md governs implementation.

## Status

Scaffolding only — **no feature code yet, by design.** The build is blocked on the
discovery call (see `docs/REVIEW.md` §5): CCB license number, insurance certificate,
existing phone number, the owner's estimate template and pricing sheet, and a yes/no on AI
first contact.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in
npm run dev
```

## Conventions

- One feature per session; describe the outcome, not the implementation.
- Tests before features where behavior matters — the lead state machine and SMS routing
  especially.
- Log every tool or design choice in `DECISIONS.md` when you make it, not at handoff.
- Nothing ships without the six items in `ARCHITECTURE.md` §6.
