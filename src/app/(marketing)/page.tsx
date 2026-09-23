import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { CallButton } from "@/components/marketing/CallButton";
import { CtaSection } from "@/components/marketing/CtaSection";
import { HeroScene } from "@/components/cinematic/HeroScene";
import { Reveal, RevealWords } from "@/components/cinematic/Reveal";
import { ServiceIndex } from "@/components/cinematic/ServiceIndex";

export default function HomePage() {
  const t = getTenant();
  const city = t.serviceArea[0];

  return (
    <>
      <HeroScene>
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-amber-brand">
            {city}, {t.address.state} · Licensed &amp; insured
          </p>
          <h1 className="display mt-6 text-[clamp(2.75rem,9vw,6.5rem)] text-chalk">
            Power you can
            <br />
            <span className="text-amber-brand">count on.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-chalk-dim sm:text-lg">
            Panel upgrades, EV chargers, rewiring and troubleshooting for homes
            and businesses across south Lane County.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CallButton
              phone={t.contact.phone}
              phoneDisplay={t.contact.phoneDisplay}
            />
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-chalk transition-colors hover:border-amber-brand hover:text-amber-brand"
            >
              Request an estimate
            </Link>
          </div>
        </div>
      </HeroScene>

      {/* Statement */}
      <section className="relative border-t border-white/[0.07] bg-ink-900 py-28 sm:py-36">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="eyebrow mb-8 text-amber-brand">Why us</p>
          <h2 className="display text-[clamp(1.9rem,5vw,3.5rem)] text-chalk">
            <RevealWords text="The last electrician you'll have to chase for a callback." />
          </h2>
          <Reveal delay={250}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-chalk-dim">
              Most electrical jobs don&rsquo;t go wrong at the panel. They go
              wrong at the phone — the call that never gets returned, the
              estimate that never arrives, the day off work spent waiting. We
              built this business around fixing that part too.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-px overflow-hidden rounded-xl bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Licensed", v: "Oregon CCB", d: "Bonded and insured. Permits pulled, inspections handled." },
              { k: "Same day", v: "You hear back", d: "Call, text or form — a real response, not silence." },
              { k: "In writing", v: "Fixed pricing", d: "Written estimates before work starts. No surprise invoices." },
              { k: "Local", v: "Not a franchise", d: `Based in ${city}, working the same roads you do.` },
            ].map((item, i) => (
              <Reveal key={item.k} delay={i * 90}>
                <div className="h-full bg-ink-850 p-7">
                  <p className="eyebrow text-amber-brand">{item.k}</p>
                  <p className="display mt-3 text-xl text-chalk">{item.v}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-chalk-dim">
                    {item.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="relative bg-ink-850 py-28 sm:py-36">
        <div className="rule absolute inset-x-0 top-0" />
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-amber-brand">What we do</p>
              <h2 className="display mt-5 text-[clamp(2rem,5vw,3.5rem)] text-chalk">
                Residential &amp; light commercial
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-semibold text-chalk-dim transition-colors hover:text-amber-brand"
            >
              All services →
            </Link>
          </div>
          <ServiceIndex services={t.services} />
        </div>
      </section>

      {/* Process */}
      <section className="relative overflow-hidden bg-ink-900 py-28 sm:py-36">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="eyebrow text-amber-brand">How it works</p>
          <h2 className="display mt-5 text-[clamp(2rem,5vw,3.5rem)] text-chalk">
            <RevealWords text="Three steps. No mystery." />
          </h2>

          <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
            {[
              {
                n: "01",
                title: "Tell us what's going on",
                body: "Call, text, or send the estimate form. Photos help — send them if you have them.",
              },
              {
                n: "02",
                title: "Get it in writing",
                body: "We scope the job and put the price in writing before anyone picks up a tool.",
              },
              {
                n: "03",
                title: "We do the work",
                body: "Scheduled, permitted, inspected where required, and cleaned up after.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 140}>
                <li className="relative border-t border-white/[0.1] pt-7">
                  <span className="display absolute -top-3 right-0 text-5xl text-white/[0.06]">
                    {s.n}
                  </span>
                  <span className="eyebrow text-amber-brand">Step {s.n}</span>
                  <h3 className="display mt-4 text-2xl text-chalk">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-chalk-dim">
                    {s.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Service area */}
      <section className="relative border-t border-white/[0.07] bg-ink-850 py-28 sm:py-36">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <p className="eyebrow text-amber-brand">Where we work</p>
            <h2 className="display mt-5 text-[clamp(2rem,5vw,3.25rem)] text-chalk">
              South Lane County and the valley floor
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-chalk-dim">
              Based in {city}. Not sure if you&rsquo;re in range? Call and ask —
              if we can&rsquo;t help, we&rsquo;ll tell you who can.
            </p>
            <Link
              href="/service-area"
              className="mt-8 inline-block text-sm font-semibold text-amber-brand hover:text-amber-bright"
            >
              See the full service area →
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/[0.07] sm:grid-cols-3">
            {t.serviceArea.map((c, i) => (
              <Reveal key={c} delay={i * 60}>
                <li className="h-full bg-ink-900 px-5 py-7">
                  <span className="eyebrow text-chalk-dim/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="display mt-2 text-lg text-chalk">{c}</p>
                  <p className="text-xs text-chalk-dim">{t.address.state}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
