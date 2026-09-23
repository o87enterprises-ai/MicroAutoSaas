"use client";

import { useEffect, useRef, useState } from "react";

/** Fades and lifts a block into view once, on first intersection. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`motion-safe:transition-all motion-safe:duration-[900ms] motion-safe:ease-[cubic-bezier(0.16,1,0.32,1)] ${
        shown
          ? "translate-y-0 opacity-100"
          : "motion-safe:translate-y-8 motion-safe:opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Headline treatment: words rise out of a mask, staggered. */
export function RevealWords({
  text,
  className = "",
  stagger = 55,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <span
            className="inline-block motion-safe:transition-transform motion-safe:duration-[800ms] motion-safe:ease-[cubic-bezier(0.16,1,0.32,1)]"
            style={{
              transform: shown ? "translateY(0)" : "translateY(105%)",
              transitionDelay: `${i * stagger}ms`,
            }}
          >
            {word}
          </span>
          {i < text.split(" ").length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
