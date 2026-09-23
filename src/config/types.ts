/**
 * Non-secret, per-client site configuration.
 *
 * Everything here is safe to commit and safe to ship to the browser.
 * Secrets live in env only — see .env.example.
 *
 * Fields typed `Placeholder<T>` are facts we do not have yet (see
 * docs/REVIEW.md §2.6). They render as visible TODOs in development and
 * fail the production build, so nothing half-known reaches a public site.
 */

export const PLACEHOLDER = "__PLACEHOLDER__" as const;
export type Placeholder<T> = T | typeof PLACEHOLDER;

export type Service = {
  slug: string;
  name: string;
  /** One line for cards and meta descriptions. */
  summary: string;
  /** Longer copy for the service detail section. */
  detail: string;
  /** Shown as "from $X" — omit when it genuinely varies too much. */
  startingAt?: number;
  /** Maps to leads.job_type. */
  jobType: string;
  emergency?: boolean;
};

export type Testimonial = {
  quote: string;
  author: string;
  location: string;
  /** False until we have a real, attributable review. Fakes never ship. */
  verified: boolean;
};

export type TenantConfig = {
  slug: string;
  businessName: string;
  shortName: string;
  tagline: string;
  /** Used in meta descriptions and the hero sub-headline. */
  description: string;

  /** Oregon CCB license number. Required in the footer by law. */
  ccbNumber: Placeholder<string>;
  insuranceStatement: string;

  contact: {
    /** E.164, e.g. +15415551234. */
    phone: Placeholder<string>;
    /** Pretty form for display, e.g. (541) 555-1234. */
    phoneDisplay: Placeholder<string>;
    email: Placeholder<string>;
    /** Toll-free number used for SMS; may differ from the voice line. */
    smsPhone?: Placeholder<string>;
  };

  address: {
    city: string;
    state: string;
    postalCode: Placeholder<string>;
    /** Omit street for a home-based business — service-area listings don't need it. */
    street?: string;
    latitude: number;
    longitude: number;
  };

  /** First entry is the primary city. Drives the service-area page and schema. */
  serviceArea: string[];
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    emergencyNote: string;
  };

  services: Service[];
  testimonials: Testimonial[];

  /** Direct "write a review" link for the Google Business Profile. */
  googleReviewUrl?: Placeholder<string>;
  domain: Placeholder<string>;

  brand: {
    /** Tailwind-compatible hex values, wired into globals.css via CSS vars. */
    primary: string;
    accent: string;
  };
};

/** True when a config value is still a placeholder. */
export function isPlaceholder<T>(v: Placeholder<T>): v is typeof PLACEHOLDER {
  return v === PLACEHOLDER;
}

/**
 * Returns the value, or `fallback` when it is still a placeholder.
 * Use for anything rendered to a page.
 */
export function orTBD<T extends string>(
  v: Placeholder<T>,
  fallback = "TBD",
): string {
  return isPlaceholder(v) ? fallback : v;
}
