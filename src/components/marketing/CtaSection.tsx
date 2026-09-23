import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { CallButton } from "./CallButton";
import { Reveal, RevealWords } from "@/components/cinematic/Reveal";

export function CtaSection({
  heading = "Let's get your power sorted.",
  body,
}: {
  heading?: string;
  body?: string;
}) {
  const t = getTenant();

  return (
    <section className="relative overflow-hidden border-t border-white/[0.07] bg-ink-850 py-28">
      {/* Amber bloom behind the copy — the only light in the room. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, rgba(245,165,36,0.16), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2 className="display text-4xl text-chalk sm:text-5xl">
          <RevealWords text={heading} />
        </h2>
        <Reveal delay={180}>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-chalk-dim">
            {body ??
              "Call and talk to a licensed electrician, or send a few details and get a straight answer on scope and cost."}
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
        </Reveal>
      </div>
    </section>
  );
}
