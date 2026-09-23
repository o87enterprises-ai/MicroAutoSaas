import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { isPlaceholder, orTBD } from "@/config/types";
import { NAV_LINKS } from "./nav";

export function Footer() {
  const t = getTenant();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.07] bg-ink-850">
      <div className="rule absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <h2 className="display text-xl uppercase tracking-[0.1em] text-chalk">
              South Valley<span className="text-amber-brand"> Electric</span>
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-chalk-dim">
              {t.tagline}
            </p>
          </div>

          <FooterCol title="Contact">
            {isPlaceholder(t.contact.phone) ? (
              <li className="text-chalk-dim">Phone: TBD</li>
            ) : (
              <li>
                <a href={`tel:${t.contact.phone}`} className="hover:text-amber-brand">
                  {orTBD(t.contact.phoneDisplay)}
                </a>
              </li>
            )}
            {isPlaceholder(t.contact.email) ? (
              <li className="text-chalk-dim">Email: TBD</li>
            ) : (
              <li>
                <a href={`mailto:${t.contact.email}`} className="hover:text-amber-brand">
                  {orTBD(t.contact.email)}
                </a>
              </li>
            )}
            <li className="text-chalk-dim">
              {t.address.city}, {t.address.state}{" "}
              {orTBD(t.address.postalCode, "")}
            </li>
          </FooterCol>

          <FooterCol title="Hours">
            <li className="text-chalk-dim">Mon–Fri · {t.hours.weekdays}</li>
            <li className="text-chalk-dim">Saturday · {t.hours.saturday}</li>
            <li className="text-chalk-dim">Sunday · {t.hours.sunday}</li>
          </FooterCol>

          <FooterCol title="Site">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-chalk-dim hover:text-amber-brand">
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterCol>
        </div>

        {/* Oregon CCB disclosure — legally required. BRIEF §7.3. */}
        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.07] pt-6 text-xs text-chalk-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-semibold text-chalk">
              Oregon CCB #{orTBD(t.ccbNumber, "pending")}
            </span>
            {" · "}
            {t.insuranceStatement}
          </p>
          <p>
            © {year} {t.businessName}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="eyebrow text-amber-brand">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}
