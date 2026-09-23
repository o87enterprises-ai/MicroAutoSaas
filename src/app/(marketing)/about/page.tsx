import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import { orTBD } from "@/config/types";
import { CtaSection } from "@/components/marketing/CtaSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "A licensed, insured Oregon electrical contractor serving Cottage Grove and south Lane County.",
};

/**
 * NOTE: the owner's actual story — years in the trade, how the business
 * started, who's on the crew — is a discovery-call item. The copy below is
 * deliberately limited to things we can state truthfully about a licensed
 * Oregon contractor. Do not invent biography.
 */
export default function AboutPage() {
  const t = getTenant();

  return (
    <>
      <section className="bg-navy-800">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            About {t.shortName}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-100">{t.tagline}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="space-y-6 leading-relaxed text-navy-700">
          <p>
            {t.businessName} is a licensed electrical contractor based in{" "}
            {t.address.city}, Oregon, serving homeowners and small businesses
            across south Lane County.
          </p>
          <p>
            The work is straightforward: show up when we say we will, explain
            what&rsquo;s actually wrong, put the price in writing, and do the job to
            code. Permits get pulled. Inspections get passed. The job site gets
            cleaned up.
          </p>
          <p>
            Every job is covered by Oregon CCB licensing and liability
            insurance, and we&rsquo;re happy to provide both on request before work
            begins.
          </p>
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Oregon CCB", value: `#${orTBD(t.ccbNumber, "pending")}` },
            { label: "Based in", value: `${t.address.city}, ${t.address.state}` },
            { label: "Insured", value: "Liability + bonded" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-navy-100 bg-white p-5 shadow-card"
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-navy-600">
                {item.label}
              </dt>
              <dd className="mt-1 font-bold text-navy-900">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <CtaSection />
    </>
  );
}
