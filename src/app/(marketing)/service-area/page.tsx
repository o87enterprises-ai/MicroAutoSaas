import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import { CtaSection } from "@/components/marketing/CtaSection";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/cinematic/Reveal";

export const metadata: Metadata = {
  title: "Service Area",
  description:
    "Electrical service for Cottage Grove, Creswell, Eugene, Springfield, Drain and Yoncalla, Oregon.",
};

export default function ServiceAreaPage() {
  const t = getTenant();

  return (
    <>
      <PageHero
        eyebrow="Where we work"
        title="South Lane County"
        lede={`Based in ${t.address.city}, ${t.address.state} — covering the valley floor from Eugene down to Yoncalla.`}
      />

      <div className="bg-ink-850 py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <ul className="grid gap-px overflow-hidden rounded-xl bg-white/[0.07] sm:grid-cols-2">
            {t.serviceArea.map((city, i) => (
              <Reveal key={city} delay={i * 70}>
                <li className="h-full bg-ink-900 p-7">
                  <span className="eyebrow text-chalk-dim/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="display mt-3 text-2xl text-chalk">
                    {city}, {t.address.state}
                  </h2>
                  <p className="mt-2 text-sm text-chalk-dim">
                    {i === 0
                      ? "Home base — fastest response times."
                      : "Regular service area, scheduled routes."}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <div className="mt-12 rounded-xl border border-white/[0.08] p-8">
              <h2 className="display text-2xl text-chalk">Outside the list?</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-chalk-dim">
                Call anyway. Larger jobs are often worth the drive, and if it
                isn&rsquo;t a fit we&rsquo;d rather point you to someone who can
                help than leave you guessing.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <CtaSection />
    </>
  );
}
