import { isPlaceholder, type Placeholder } from "@/config/types";

type Props = {
  phone: Placeholder<string>;
  phoneDisplay: Placeholder<string>;
  className?: string;
  /** Short form for tight spaces. */
  compact?: boolean;
};

/**
 * Click-to-call. Renders as a disabled pill when the number is still
 * unknown, so a placeholder can never masquerade as a working CTA.
 */
export function CallButton({ phone, phoneDisplay, className = "", compact }: Props) {
  const label = compact ? "Call now" : `Call ${isPlaceholder(phoneDisplay) ? "" : phoneDisplay}`.trim();

  if (isPlaceholder(phone)) {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-lg bg-navy-100 px-5 py-3 font-semibold text-navy-600 ${className}`}
        title="Phone number pending discovery call"
      >
        <PhoneIcon />
        Phone number TBD
      </span>
    );
  }

  return (
    <a
      href={`tel:${phone}`}
      className={`inline-flex items-center gap-2 rounded-lg bg-amber-brand px-5 py-3 font-semibold text-navy-900 transition-colors hover:bg-amber-brand-dark ${className}`}
    >
      <PhoneIcon />
      {label}
    </a>
  );
}

export function PhoneIcon({ className = "h-5 w-5" }: { className?: string }) {
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
