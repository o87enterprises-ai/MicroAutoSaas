import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import { CtaSection } from "@/components/marketing/CtaSection";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/cinematic/Reveal";

export const metadata: Metadata = {
  title: "Electrical Services",
  description:
    "Panel upgrades, EV charger installation, rewiring, troubleshooting, lighting and generator installation for homes and small businesses in south Lane County.",
};

export default function ServicesPage() {
  const t = getTenant();

  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Electrical services"
        lede={`Residential and light commercial work across ${t.serviceArea[0]} and the surrounding area. If you don't see your job listed, call and ask — the list isn't exhaustive.`}
      />

      <div className="bg-ink-850">
        <ul className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
          {t.services.map((s, i) => (
            <li
              key={s.slug}
              id={s.slug}
              className="scroll-mt-28 border-b border-white/[0.08] py-12 last:border-0"
            >
              <Reveal>
                <span className="eyebrow text-chalk-dim/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="display mt-3 text-3xl text-chalk sm:text-4xl">
                  {s.name}
                </h2>
                <p className="mt-4 text-lg text-amber-brand/90">{s.summary}</p>
                <p className="mt-4 max-w-2xl leading-relaxed text-chalk-dim">
                  {s.detail}
                </p>
                {s.emergency && (
                  <p className="mt-6 max-w-2xl border-l-2 border-amber-brand bg-amber-brand/[0.07] px-5 py-4 text-sm leading-relaxed text-chalk-dim">
                    <strong className="text-chalk">Urgent?</strong> Burning
                    smells, scorched outlets, sparking or a dead panel are
                    same-day calls. Don&rsquo;t wait on a form — pick up the
                    phone.
                  </p>
                )}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <CtaSection
        heading="Not sure which one you need?"
        body="Describe the symptom and we'll tell you what's actually involved — including when the honest answer is that it's a small fix."
      />
    </>
  );
}
