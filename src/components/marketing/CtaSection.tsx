import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { CallButton } from "./CallButton";

export function CtaSection({
  heading = "Need an electrician this week?",
  body,
}: {
  heading?: string;
  body?: string;
}) {
  const t = getTenant();

  return (
    <section className="bg-navy-800">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{heading}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-navy-100">
          {body ??
            `Call and talk to a licensed electrician, or send a few details and we'll come back to you with a straight answer on scope and cost.`}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CallButton
            phone={t.contact.phone}
            phoneDisplay={t.contact.phoneDisplay}
          />
          <Link
            href="/contact"
            className="inline-flex items-center rounded-lg border border-navy-200/40 px-5 py-3 font-semibold text-white transition-colors hover:bg-navy-700"
          >
            Request an estimate
          </Link>
        </div>
      </div>
    </section>
  );
}
