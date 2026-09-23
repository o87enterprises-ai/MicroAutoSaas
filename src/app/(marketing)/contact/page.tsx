import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import { isPlaceholder, orTBD } from "@/config/types";
import { consentDisclosure } from "@/lib/leads/consent";
import { CallButton } from "@/components/marketing/CallButton";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Request an Estimate",
  description:
    "Call, text or request a written estimate for electrical work in Cottage Grove, Creswell, Eugene and south Lane County.",
};

export default function ContactPage() {
  const t = getTenant();
  // Intake is wired in the next sprint; until then the form is presentational
  // rather than silently dropping a real customer's request.
  const formLive = false;

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Request an estimate"
        lede="Tell us what's going on and we'll come back with a straight answer on scope and cost. Urgent? Call instead."
      />

      <div className="bg-ink-850 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-ink-900 p-7 sm:p-10">
            <form className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Your name" name="name" required />
                <Field label="Phone" name="phone" type="tel" required />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Email" name="email" type="email" />
                <Field label="Service address" name="address" />
              </div>

              <div>
                <Label htmlFor="jobType">What do you need?</Label>
                <select
                  id="jobType"
                  name="jobType"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select a service…
                  </option>
                  {t.services.map((s) => (
                    <option key={s.slug} value={s.jobType}>
                      {s.name}
                    </option>
                  ))}
                  <option value="other">Something else</option>
                </select>
              </div>

              <div>
                <Label htmlFor="urgency">How soon?</Label>
                <select
                  id="urgency"
                  name="urgency"
                  defaultValue="flexible"
                  className={selectClass}
                >
                  <option value="emergency">Emergency — today</option>
                  <option value="this_week">This week</option>
                  <option value="flexible">Flexible / planning ahead</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Describe the job</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="What's happening, what you've already tried, anything an electrician would want to know."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* TCPA consent — required, logged with timestamp and IP. */}
              <label className="flex gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-xs leading-relaxed text-chalk-dim">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#f5a524]"
                />
                <span>{consentDisclosure(t.businessName)}</span>
              </label>

              <button
                type="submit"
                disabled={!formLive}
                className="w-full rounded-full bg-amber-brand px-7 py-4 text-sm font-semibold text-ink-900 transition-colors hover:bg-amber-bright disabled:cursor-not-allowed disabled:border disabled:border-white/15 disabled:bg-transparent disabled:text-chalk-dim"
              >
                {formLive ? "Send request" : "Form activates at launch"}
              </button>
              {!formLive && (
                <p className="text-center text-xs text-chalk-dim/70">
                  Submissions go live with the booking system. Call or text in
                  the meantime.
                </p>
              )}
            </form>
          </div>

          <aside className="space-y-5">
            <div className="relative overflow-hidden rounded-2xl border border-amber-brand/20 bg-ink-900 p-7">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-52 w-52"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(245,165,36,0.18), transparent 70%)",
                }}
              />
              <h2 className="display relative text-xl text-chalk">
                Faster: just call
              </h2>
              <p className="relative mt-3 text-sm leading-relaxed text-chalk-dim">
                {t.hours.emergencyNote}
              </p>
              <CallButton
                phone={t.contact.phone}
                phoneDisplay={t.contact.phoneDisplay}
                className="relative mt-6 w-full"
              />
              {t.contact.smsPhone && !isPlaceholder(t.contact.smsPhone) && (
                <a
                  href={`sms:${t.contact.smsPhone}`}
                  className="relative mt-3 flex w-full items-center justify-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-chalk hover:border-amber-brand hover:text-amber-brand"
                >
                  Send a text
                </a>
              )}
            </div>

            <div className="rounded-2xl border border-white/[0.08] p-7">
              <h2 className="eyebrow text-amber-brand">Hours</h2>
              <ul className="mt-4 space-y-2 text-sm text-chalk-dim">
                <li>Mon–Fri · {t.hours.weekdays}</li>
                <li>Saturday · {t.hours.saturday}</li>
                <li>Sunday · {t.hours.sunday}</li>
              </ul>
              <p className="mt-6 border-t border-white/[0.08] pt-5 text-sm text-chalk-dim">
                {t.address.city}, {t.address.state}{" "}
                {orTBD(t.address.postalCode, "")}
                <br />
                Oregon CCB #{orTBD(t.ccbNumber, "pending")}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

const inputClass =
  "mt-2 w-full rounded-lg border border-white/[0.12] bg-white/[0.03] px-4 py-3 text-sm text-chalk placeholder:text-chalk-dim/40 transition-colors focus:border-amber-brand focus:outline-none";

const selectClass = `${inputClass} [&>option]:bg-ink-800`;

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[11px] font-semibold uppercase tracking-[0.18em] text-chalk-dim"
    >
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-amber-brand"> *</span>}
      </Label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className={inputClass}
      />
    </div>
  );
}
