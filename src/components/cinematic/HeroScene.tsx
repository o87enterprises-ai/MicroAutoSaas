"use client";

import { useEffect, useRef, useState } from "react";
import { ArcField } from "./ArcField";

/**
 * Scroll-driven hero. A tall section pins a full-viewport stage; scroll
 * progress through it drives arc intensity, the headline reveal and the
 * darkening exit, so the page reads as one continuous shot.
 */
export function HeroScene({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const intensityRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ticking = false;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const travel = section.offsetHeight - window.innerHeight;
      const p = travel > 0 ? Math.min(Math.max(-rect.top / travel, 0), 1) : 0;
      intensityRef.current = p;
      setProgress(p);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Copy leaves before the stage does, so the arc field gets a beat alone.
  const copyOpacity = 1 - Math.min(progress / 0.55, 1);
  const copyShift = progress * -80;

  return (
    <section ref={sectionRef} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink-900">
        <ArcField intensityRef={intensityRef} className="absolute inset-0" />

        {/* Vignette + floor gradient give the canvas depth. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 35%, transparent 20%, rgba(3,5,9,0.55) 60%, #03050a 100%)",
          }}
        />

        <div
          className="absolute inset-0 flex items-center justify-center px-5"
          style={{
            opacity: copyOpacity,
            transform: `translateY(${copyShift}px)`,
            willChange: "opacity, transform",
          }}
        >
          {children}
        </div>

        {/* Scroll affordance, retires once the user has moved. */}
        <div
          /* Hidden on mobile: the preview banner sits here, and touch users
             do not need a scroll affordance. */
          className="pointer-events-none absolute inset-x-0 bottom-7 hidden justify-center md:flex"
          style={{ opacity: 1 - Math.min(progress / 0.15, 1) }}
        >
          <span className="flex flex-col items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-white/40">
            Scroll
            <span className="h-9 w-px animate-pulse bg-gradient-to-b from-amber-brand to-transparent" />
          </span>
        </div>
      </div>
    </section>
  );
}
