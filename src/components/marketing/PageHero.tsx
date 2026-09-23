import { RevealWords } from "@/components/cinematic/Reveal";

/** Shared interior-page header: eyebrow, kinetic headline, lede. */
export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-900 pb-16 pt-36 sm:pb-20 sm:pt-44">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[52rem] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(closest-side, rgba(245,165,36,0.13), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <p className="eyebrow text-amber-brand">{eyebrow}</p>
        <h1 className="display mt-5 text-[clamp(2.25rem,6vw,4.5rem)] text-chalk">
          <RevealWords text={title} />
        </h1>
        {lede && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-chalk-dim">
            {lede}
          </p>
        )}
      </div>
      <div className="rule absolute inset-x-0 bottom-0" />
    </section>
  );
}
