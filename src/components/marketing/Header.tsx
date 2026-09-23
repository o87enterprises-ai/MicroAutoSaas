"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "./nav";

/**
 * Sits transparent over the hero and solidifies once the stage is behind you.
 */
export function Header({ phone }: { phone: string | null }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "border-b border-white/[0.07] bg-ink-900/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <BoltMark />
          <span className="display text-[15px] uppercase tracking-[0.12em] text-chalk">
            South Valley
            <span className="text-amber-brand"> Electric</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-[13px] font-medium tracking-wide text-chalk-dim transition-colors hover:text-chalk after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-amber-brand after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="hidden rounded-full bg-amber-brand px-5 py-2.5 text-[13px] font-semibold text-ink-900 transition-colors hover:bg-amber-bright lg:inline-flex"
            >
              Call now
            </a>
          ) : (
            <span className="hidden rounded-full border border-white/15 px-5 py-2.5 text-[13px] font-medium text-chalk-dim lg:inline-flex">
              Phone TBD
            </span>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-px w-4 bg-chalk transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-px w-4 bg-chalk transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`overflow-hidden border-t border-white/[0.07] bg-ink-900/95 backdrop-blur-xl transition-all duration-400 lg:hidden ${
          open ? "max-h-80" : "max-h-0 border-t-transparent"
        }`}
      >
        <nav className="flex flex-col px-5 py-2" aria-label="Mobile">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/[0.06] py-3.5 text-sm font-medium text-chalk-dim last:border-0"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function BoltMark() {
  return (
    <span className="relative flex h-8 w-8 items-center justify-center">
      <span className="absolute inset-0 rounded-lg bg-amber-brand/15 blur-[6px]" />
      <svg viewBox="0 0 24 24" className="relative h-5 w-5" aria-hidden="true">
        <path d="M13 2 4.5 13.5H10l-1 8.5L19.5 10H14l-1-8Z" fill="#f5a524" />
      </svg>
    </span>
  );
}
