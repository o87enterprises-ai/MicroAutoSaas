"use client";

import Link from "next/link";
import { useState } from "react";
import type { Service } from "@/config/types";

/**
 * Large index list. Hovering a row expands its detail and pulls the amber
 * rule across — an asset-free way to make a service list feel deliberate.
 */
export function ServiceIndex({ services }: { services: Service[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ul className="border-t border-white/[0.08]">
      {services.map((s, i) => {
        const open = active === s.slug;
        return (
          <li key={s.slug} className="border-b border-white/[0.08]">
            <Link
              href={`/services#${s.slug}`}
              onMouseEnter={() => setActive(s.slug)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(s.slug)}
              onBlur={() => setActive(null)}
              className="group relative block px-1 py-7 sm:py-9"
            >
              {/* Amber rule sweeps in on hover. */}
              <span
                className="absolute inset-x-0 bottom-0 h-px bg-amber-brand transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.32,1)]"
                style={{
                  transformOrigin: "left",
                  transform: open ? "scaleX(1)" : "scaleX(0)",
                }}
              />
              <div className="flex items-baseline gap-5 sm:gap-10">
                <span className="eyebrow w-8 shrink-0 text-chalk-dim/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3
                    className={`display text-2xl transition-colors duration-300 sm:text-4xl ${
                      open ? "text-amber-brand" : "text-chalk"
                    }`}
                  >
                    {s.name}
                  </h3>
                  <div
                    className="grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.32,1)]"
                    style={{
                      gridTemplateRows: open ? "1fr" : "0fr",
                      opacity: open ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-xl pt-3 text-sm leading-relaxed text-chalk-dim">
                        {s.detail}
                      </p>
                    </div>
                  </div>
                  {/* Always-visible one-liner so the list reads without hover. */}
                  <p
                    className="max-w-xl text-sm leading-relaxed text-chalk-dim transition-all duration-300"
                    style={{
                      opacity: open ? 0 : 1,
                      maxHeight: open ? 0 : "4rem",
                      marginTop: open ? 0 : "0.5rem",
                    }}
                  >
                    {s.summary}
                  </p>
                </div>
                <span
                  className={`hidden shrink-0 text-2xl transition-all duration-300 sm:block ${
                    open
                      ? "translate-x-0 text-amber-brand opacity-100"
                      : "-translate-x-3 opacity-0"
                  }`}
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
