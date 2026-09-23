import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import { isPlaceholder } from "@/config/types";
import { CtaSection } from "@/components/marketing/CtaSection";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Reviews from homeowners and businesses across Cottage Grove and south Lane County.",
};

/**
 * Renders only real, attributable reviews. When there are none, it says so
 * honestly rather than shipping invented testimonials — fabricated reviews are
 * an FTC problem and they read as fake to customers anyway.
 */
export default function ReviewsPage() {
  const t = getTenant();
  const hasReviews = t.testimonials.length > 0;

  return (
    <>
      <section className="bg-navy-800">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Reviews</h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-100">
            What customers in {t.serviceArea[0]} and the surrounding area have to
            say.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        {hasReviews ? (
          <ul className="space-y-6">
            {t.testimonials
              .filter((r) => r.verified)
              .map((r) => (
                <li
                  key={r.quote}
                  className="rounded-xl border border-navy-100 bg-white p-6 shadow-card"
                >
                  <blockquote className="leading-relaxed text-navy-800">
                    &ldquo;{r.quote}&rdquo;
                  </blockquote>
                  <p className="mt-4 text-sm font-semibold text-navy-900">
                    {r.author}
                    <span className="font-normal text-navy-600">
                      {" "}
                      · {r.location}
                    </span>
                  </p>
                </li>
              ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-navy-100 bg-navy-50 p-8 text-center">
            <h2 className="text-lg font-bold text-navy-900">
              We&rsquo;re just getting our reviews online
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-navy-700">
              Word of mouth has carried this business so far. If we&rsquo;ve done
              work for you, a short review helps the next neighbor decide who to
              call — and we&rsquo;d be grateful for it.
            </p>
            {!isPlaceholder(t.googleReviewUrl ?? "") && t.googleReviewUrl && (
              <a
                href={t.googleReviewUrl}
                className="mt-6 inline-flex rounded-lg bg-amber-brand px-5 py-3 font-semibold text-navy-900 hover:bg-amber-brand-dark"
              >
                Leave a Google review
              </a>
            )}
          </div>
        )}
      </div>

      <CtaSection />
    </>
  );
}
