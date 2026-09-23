import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { isPlaceholder, orTBD } from "@/config/types";
import { NAV_LINKS } from "./nav";

export function Footer() {
  const t = getTenant();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-navy-900 text-navy-100">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-base font-bold text-white">{t.businessName}</h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-200">
              {t.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-brand">
              Contact
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                {isPlaceholder(t.contact.phone) ? (
                  <span className="text-navy-200">Phone: TBD</span>
                ) : (
                  <a href={`tel:${t.contact.phone}`} className="hover:text-amber-brand">
                    {orTBD(t.contact.phoneDisplay)}
                  </a>
                )}
              </li>
              <li>
                {isPlaceholder(t.contact.email) ? (
                  <span className="text-navy-200">Email: TBD</span>
                ) : (
                  <a href={`mailto:${t.contact.email}`} className="hover:text-amber-brand">
                    {orTBD(t.contact.email)}
                  </a>
                )}
              </li>
              <li className="text-navy-200">
                {t.address.city}, {t.address.state} {orTBD(t.address.postalCode, "")}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-brand">
              Hours
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-navy-200">
              <li>Mon–Fri: {t.hours.weekdays}</li>
              <li>Saturday: {t.hours.saturday}</li>
              <li>Sunday: {t.hours.sunday}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-brand">
              Site
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-navy-200 hover:text-amber-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Oregon CCB license disclosure — legally required. BRIEF §7.3. */}
        <div className="mt-12 border-t border-navy-700 pt-6 text-xs leading-relaxed text-navy-200">
          <p>
            <span className="font-semibold text-white">
              Oregon CCB #{orTBD(t.ccbNumber, "pending")}
            </span>
            {" · "}
            {t.insuranceStatement}
          </p>
          <p className="mt-2">
            © {year} {t.businessName}. Serving {t.serviceArea.slice(0, 3).join(", ")} and
            surrounding communities.
          </p>
        </div>
      </div>
    </footer>
  );
}
