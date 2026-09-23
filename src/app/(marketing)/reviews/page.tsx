import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import { isPlaceholder } from "@/config/types";
import { CtaSection } from "@/components/marketing/CtaSection";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/cinematic/Reveal";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Reviews from homeowners and businesses across Cottage Grove and south Lane County.",
};

/**
 * Renders only real, attributable reviews. With none yet, it says so honestly
 * rather than shipping invented testimonials.
 */
export default function ReviewsPage() {
  const t = getTenant();
  const reviews = t.testimonials.filter((r) => r.verified);

  return (
    <>
      <PageHero
        eyebrow="Reviews"
        title="What customers say"
        lede={`From homeowners and businesses across ${t.serviceArea[0]} and the surrounding area.`}
      />

      <div className="bg-ink-850 py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {reviews.length > 0 ? (
            <ul className="space-y-5">
              {reviews.map((r, i) => (
                <Reveal key={r.quote} delay={i * 90}>
                  <li className="rounded-xl border border-white/[0.08] p-8">
                    <blockquote className="text-lg leading-relaxed text-chalk">
                      &ldquo;{r.quote}&rdquo;
                    </blockquote>
                    <p className="mt-5 text-sm font-semibold text-amber-brand">
                      {r.author}
                      <span className="font-normal text-chalk-dim">
                        {" · "}
                        {r.location}
                      </span>
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal>
              <div className="rounded-xl border border-white/[0.08] p-10 text-center">
                <h2 className="display text-2xl text-chalk sm:text-3xl">
                  We&rsquo;re just getting our reviews online
                </h2>
                <p className="mx-auto mt-5 max-w-xl leading-relaxed text-chalk-dim">
                  Word of mouth has carried this business so far. If we&rsquo;ve
                  done work for you, a short review helps the next neighbor
                  decide who to call — and we&rsquo;d be grateful for it.
                </p>
                {t.googleReviewUrl && !isPlaceholder(t.googleReviewUrl) && (
                  <a
                    href={t.googleReviewUrl}
                    className="mt-8 inline-flex rounded-full bg-amber-brand px-7 py-3.5 text-sm font-semibold text-ink-900 hover:bg-amber-bright"
                  >
                    Leave a Google review
                  </a>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </div>

      <CtaSection />
    </>
  );
}
