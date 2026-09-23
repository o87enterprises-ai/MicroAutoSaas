import type { Metadata } from "next";
import { getTenant } from "@/lib/tenant";
import { isPlaceholder, orTBD } from "@/config/types";
import { consentDisclosure } from "@/lib/leads/consent";
import { CallButton } from "@/components/marketing/CallButton";

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
      <section className="bg-navy-800">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Request an estimate
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-100">
            Tell us what&rsquo;s going on and we&rsquo;ll come back with a
            straight answer on scope and cost. Urgent? Call instead.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Form */}
        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
          <form className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name" name="name" required />
              <Field label="Phone" name="phone" type="tel" required />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" />
              <Field label="Service address" name="address" />
            </div>

            <div>
              <Label htmlFor="jobType">What do you need?</Label>
              <select
                id="jobType"
                name="jobType"
                className="mt-1.5 w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-navy-900"
                defaultValue=""
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
                className="mt-1.5 w-full rounded-lg border border-navy-200 bg-white px-3 py-2.5 text-navy-900"
                defaultValue="flexible"
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
                className="mt-1.5 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-navy-900 placeholder:text-navy-600/60"
              />
            </div>

            {/* TCPA consent — required, logged with timestamp and IP. */}
            <label className="flex gap-3 rounded-lg bg-navy-50 p-4 text-sm leading-relaxed text-navy-800">
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
              className="w-full rounded-lg bg-amber-brand px-5 py-3.5 font-semibold text-navy-900 transition-colors hover:bg-amber-brand-dark disabled:cursor-not-allowed disabled:bg-navy-100 disabled:text-navy-600"
            >
              {formLive ? "Send request" : "Form activates at launch"}
            </button>
            {!formLive && (
              <p className="text-center text-xs text-navy-600">
                Submissions go live with the booking system. Call or text in the
                meantime.
              </p>
            )}
          </form>
        </div>

        {/* Direct contact */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-navy-800 p-6 text-white">
            <h2 className="text-lg font-bold">Faster: just call</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-100">
              {t.hours.emergencyNote}
            </p>
            <CallButton
              phone={t.contact.phone}
              phoneDisplay={t.contact.phoneDisplay}
              className="mt-5 w-full justify-center"
            />
            {!isPlaceholder(t.contact.smsPhone ?? "") && t.contact.smsPhone && (
              <a
                href={`sms:${t.contact.smsPhone}`}
                className="mt-3 flex w-full items-center justify-center rounded-lg border border-navy-200/40 px-5 py-3 font-semibold text-white hover:bg-navy-700"
              >
                Send a text
              </a>
            )}
          </div>

          <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
            <h2 className="font-bold text-navy-900">Hours</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-navy-700">
              <li>Mon–Fri: {t.hours.weekdays}</li>
              <li>Saturday: {t.hours.saturday}</li>
              <li>Sunday: {t.hours.sunday}</li>
            </ul>
            <p className="mt-4 border-t border-navy-100 pt-4 text-sm text-navy-700">
              {t.address.city}, {t.address.state}{" "}
              {orTBD(t.address.postalCode, "")}
              <br />
              Oregon CCB #{orTBD(t.ccbNumber, "pending")}
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

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
      className="text-sm font-semibold text-navy-900"
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
        {required && <span className="text-amber-brand-dark"> *</span>}
      </Label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1.5 w-full rounded-lg border border-navy-200 px-3 py-2.5 text-navy-900"
      />
    </div>
  );
}
