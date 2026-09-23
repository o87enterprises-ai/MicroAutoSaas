import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import { CtaSection } from "@/components/marketing/CtaSection";

export const metadata: Metadata = {
  title: "Electrical Services",
  description:
    "Panel upgrades, EV charger installation, rewiring, troubleshooting, lighting and generator installation for homes and small businesses in south Lane County.",
};

export default function ServicesPage() {
  const t = getTenant();

  return (
    <>
      <section className="bg-navy-800">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Electrical services
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-100">
            Residential and light commercial work across {t.serviceArea[0]} and
            the surrounding area. If you don&rsquo;t see your job listed, call and ask
            — the list isn&rsquo;t exhaustive.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <ul className="space-y-12">
          {t.services.map((s) => (
            <li key={s.slug} id={s.slug} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">
                {s.name}
              </h2>
              <p className="mt-2 font-medium text-navy-700">{s.summary}</p>
              <p className="mt-3 leading-relaxed text-navy-700">{s.detail}</p>
              {s.emergency && (
                <p className="mt-4 rounded-lg border-l-4 border-amber-brand bg-amber-brand/10 px-4 py-3 text-sm text-navy-800">
                  <strong>Urgent?</strong> Burning smells, scorched outlets,
                  sparking or a dead panel are same-day calls. Don&rsquo;t wait on a
                  form — pick up the phone.
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      <CtaSection heading="Not sure which one you need?" body="Describe the symptom and we'll tell you what's actually involved — including when the honest answer is that it's a small fix." />
    </>
  );
}
