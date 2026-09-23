import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import { CtaSection } from "@/components/marketing/CtaSection";

export const metadata: Metadata = {
  title: "Service Area",
  description:
    "Electrical service for Cottage Grove, Creswell, Eugene, Springfield, Drain and Yoncalla, Oregon.",
};

export default function ServiceAreaPage() {
  const t = getTenant();

  return (
    <>
      <section className="bg-navy-800">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Service area
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-100">
            Based in {t.address.city}, {t.address.state} — working south Lane
            County and north Douglas County.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-2">
          {t.serviceArea.map((city, i) => (
            <li
              key={city}
              className="rounded-xl border border-navy-100 bg-white p-5 shadow-card"
            >
              <h2 className="font-bold text-navy-900">
                {city}, {t.address.state}
              </h2>
              <p className="mt-1 text-sm text-navy-700">
                {i === 0
                  ? "Home base — fastest response times."
                  : "Regular service area, scheduled routes."}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-xl bg-navy-50 p-6">
          <h2 className="font-bold text-navy-900">Outside the list?</h2>
          <p className="mt-2 leading-relaxed text-navy-700">
            Call anyway. Larger jobs are often worth the drive, and if it isn&rsquo;t a
            fit we&rsquo;d rather point you to someone who can help than leave you
            guessing.
          </p>
        </div>
      </div>

      <CtaSection />
    </>
  );
}
