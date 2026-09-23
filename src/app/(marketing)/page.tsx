import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { CallButton } from "@/components/marketing/CallButton";
import { CtaSection } from "@/components/marketing/CtaSection";

export default function HomePage() {
  const t = getTenant();
  const city = t.serviceArea[0];

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-800">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-brand">
              {city}, {t.address.state} · Licensed & insured
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Electrical work done right, by someone who picks up the phone.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-100">
              Panel upgrades, EV chargers, rewiring and troubleshooting for homes
              and small businesses across south Lane County. Clear pricing, real
              answers, no runaround.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CallButton
                phone={t.contact.phone}
                phoneDisplay={t.contact.phoneDisplay}
                className="justify-center text-base"
              />
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-navy-200/40 px-5 py-3 font-semibold text-white transition-colors hover:bg-navy-700"
              >
                Request an estimate
              </Link>
            </div>

            <p className="mt-5 text-sm text-navy-200">{t.hours.emergencyNote}</p>
          </div>

          {/* Trust panel */}
          <div className="rounded-2xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="text-lg font-bold text-navy-900">
              What you can count on
            </h2>
            <ul className="mt-5 space-y-4">
              {[
                {
                  title: "A licensed Oregon contractor",
                  body: "CCB licensed, bonded and insured. Permits pulled and inspections handled.",
                },
                {
                  title: "You hear back the same day",
                  body: "Call, text or send the form — you get a real response, not silence.",
                },
                {
                  title: "The price you're quoted",
                  body: "Written estimates before work starts. Surprises get discussed, not invoiced.",
                },
                {
                  title: "Local, not a franchise",
                  body: `Based in ${city} and working the same roads you do.`,
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <CheckMark />
                  <div>
                    <p className="font-semibold text-navy-900">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-navy-700">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">
            What we do
          </h2>
          <p className="mt-3 text-navy-700">
            Residential and light commercial electrical work — from a single
            outlet to a full service upgrade.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.map((s) => (
            <Link
              key={s.slug}
              href={`/services#${s.slug}`}
              className="group rounded-xl border border-navy-100 bg-white p-6 shadow-card transition-colors hover:border-amber-brand"
            >
              <h3 className="font-bold text-navy-900 group-hover:text-amber-brand-dark">
                {s.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-700">
                {s.summary}
              </p>
              {s.emergency && (
                <span className="mt-4 inline-block rounded-full bg-amber-brand/15 px-2.5 py-1 text-xs font-semibold text-navy-800">
                  Same-day when it&rsquo;s urgent
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-navy-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">
            How it works
          </h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Tell us what's going on",
                body: "Call, text, or fill out the estimate form. Photos help — send them if you have them.",
              },
              {
                step: "2",
                title: "Get a written estimate",
                body: "We scope the job and put the price in writing before anyone picks up a tool.",
              },
              {
                step: "3",
                title: "We do the work",
                body: "Scheduled, permitted, inspected where required, and cleaned up after.",
              },
            ].map((s) => (
              <li key={s.step}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 font-bold text-amber-brand">
                  {s.step}
                </span>
                <h3 className="mt-4 font-bold text-navy-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-700">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Service area */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">
              Where we work
            </h2>
            <p className="mt-3 text-navy-700">
              Based in {city}, covering south Lane County and north Douglas
              County. Not sure if you&rsquo;re in range? Call and ask — if we can&rsquo;t
              help, we&rsquo;ll tell you who can.
            </p>
            <Link
              href="/service-area"
              className="mt-5 inline-block font-semibold text-navy-800 underline decoration-amber-brand decoration-2 underline-offset-4"
            >
              See the full service area
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {t.serviceArea.map((c) => (
              <li
                key={c}
                className="rounded-lg border border-navy-100 bg-white px-4 py-3 text-sm font-medium text-navy-800 shadow-card"
              >
                {c}, {t.address.state}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaSection />
    </>
  );
}

function CheckMark() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-brand">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
        <path
          d="M5 13l4 4L19 7"
          stroke="#07182e"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
}
