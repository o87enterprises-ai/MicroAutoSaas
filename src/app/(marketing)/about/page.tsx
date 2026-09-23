import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import { orTBD } from "@/config/types";
import { CtaSection } from "@/components/marketing/CtaSection";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/cinematic/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "A licensed, insured Oregon electrical contractor serving Cottage Grove and south Lane County.",
};

/**
 * NOTE: the owner's actual story — years in the trade, how the business
 * started, who's on the crew — is a discovery-call item. The copy below is
 * limited to what we can state truthfully about a licensed Oregon contractor.
 * Do not invent biography.
 */
export default function AboutPage() {
  const t = getTenant();

  return (
    <>
      <PageHero eyebrow="Who we are" title="About the shop" lede={t.tagline} />

      <div className="bg-ink-850 py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <div className="space-y-6 text-lg leading-relaxed text-chalk-dim">
              <p>
                {t.businessName} is a licensed electrical contractor based in{" "}
                {t.address.city}, Oregon, serving homeowners and small
                businesses across south Lane County.
              </p>
              <p>
                The work is straightforward: show up when we say we will,
                explain what&rsquo;s actually wrong, put the price in writing,
                and do the job to code. Permits get pulled. Inspections get
                passed. The job site gets cleaned up.
              </p>
              <p>
                Every job is covered by Oregon CCB licensing and liability
                insurance, and we&rsquo;re happy to provide both on request
                before work begins.
              </p>
            </div>
          </Reveal>

          <dl className="mt-14 grid gap-px overflow-hidden rounded-xl bg-white/[0.07] sm:grid-cols-3">
            {[
              { label: "Oregon CCB", value: `#${orTBD(t.ccbNumber, "pending")}` },
              {
                label: "Based in",
                value: `${t.address.city}, ${t.address.state}`,
              },
              { label: "Insured", value: "Liability + bonded" },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 90}>
                <div className="h-full bg-ink-900 p-7">
                  <dt className="eyebrow text-amber-brand">{item.label}</dt>
                  <dd className="display mt-3 text-xl text-chalk">
                    {item.value}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>

      <CtaSection />
    </>
  );
}
