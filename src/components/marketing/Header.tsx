import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { NAV_LINKS } from "./nav";
import { CallButton } from "./CallButton";
import { PendingFactsBanner } from "./PendingFactsBanner";

export function Header() {
  const t = getTenant();

  return (
    <>
      <PendingFactsBanner />
      <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <BoltMark />
            <span className="text-base font-bold leading-tight text-navy-800 sm:text-lg">
              {t.shortName}
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-navy-700 transition-colors hover:text-amber-brand-dark"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <CallButton
            phone={t.contact.phone}
            phoneDisplay={t.contact.phoneDisplay}
            className="hidden text-sm md:inline-flex"
          />
        </div>
      </header>
    </>
  );
}

function BoltMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800">
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path d="M13 2 4.5 13.5H10l-1 8.5L19.5 10H14l-1-8Z" fill="#f5a524" />
      </svg>
    </span>
  );
}
