import { isPlaceholder, type Placeholder } from "@/config/types";

type Props = {
  phone: Placeholder<string>;
  phoneDisplay: Placeholder<string>;
  className?: string;
  variant?: "solid" | "outline";
};

/**
 * Click-to-call. Renders inert when the number is unknown, so a placeholder
 * can never masquerade as a working CTA.
 */
export function CallButton({
  phone,
  phoneDisplay,
  className = "",
  variant = "solid",
}: Props) {
  const base =
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300";
  const skin =
    variant === "solid"
      ? "bg-amber-brand text-ink-900 hover:bg-amber-bright hover:shadow-[0_0_40px_-8px_rgba(245,165,36,0.7)]"
      : "border border-white/20 text-chalk hover:border-amber-brand hover:text-amber-brand";

  if (isPlaceholder(phone)) {
    return (
      <span
        className={`${base} cursor-not-allowed border border-white/15 text-chalk-dim ${className}`}
        title="Phone number pending discovery call"
      >
        <PhoneIcon />
        Phone number TBD
      </span>
    );
  }

  return (
    <a href={`tel:${phone}`} className={`${base} ${skin} ${className}`}>
      <PhoneIcon />
      {isPlaceholder(phoneDisplay) ? "Call now" : phoneDisplay}
    </a>
  );
}

export function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M2.5 4.5A2 2 0 0 1 4.5 2.5h1.7a2 2 0 0 1 2 1.7l.4 2.6a2 2 0 0 1-.9 2L6.5 10a12.5 12.5 0 0 0 7.5 7.5l1.2-1.2a2 2 0 0 1 2-.5l2.6.4a2 2 0 0 1 1.7 2v1.7a2 2 0 0 1-2 2A19.5 19.5 0 0 1 2.5 4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
