import { southValleyElectric } from "@/config/tenants/south-valley-electric";
import { isPlaceholder, type TenantConfig } from "@/config/types";

const TENANTS: Record<string, TenantConfig> = {
  "south-valley-electric": southValleyElectric,
};

const DEFAULT_SLUG = "south-valley-electric";

/**
 * Config values that may never be placeholders on a public production site.
 * The CCB number is a legal requirement (BRIEF §7.3); without a phone number
 * the site cannot convert, which is the entire point of it.
 */
function missingRequiredFacts(t: TenantConfig): string[] {
  const missing: string[] = [];
  if (isPlaceholder(t.ccbNumber)) missing.push("ccbNumber (legally required)");
  if (isPlaceholder(t.contact.phone)) missing.push("contact.phone");
  if (isPlaceholder(t.contact.phoneDisplay)) missing.push("contact.phoneDisplay");
  if (isPlaceholder(t.domain)) missing.push("domain");
  return missing;
}

/** True when the site is being served as the real, public production site. */
function isPublicProduction(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV === "production"
  );
}

/**
 * The active tenant. Selected by TENANT_SLUG so one codebase can serve any
 * client (one deployment per client — see DECISIONS.md D-002).
 */
export function getTenant(): TenantConfig {
  const slug = process.env.TENANT_SLUG ?? DEFAULT_SLUG;
  const tenant = TENANTS[slug];

  if (!tenant) {
    throw new Error(
      `Unknown TENANT_SLUG "${slug}". Known: ${Object.keys(TENANTS).join(", ")}`,
    );
  }

  if (isPublicProduction()) {
    const missing = missingRequiredFacts(tenant);
    if (missing.length > 0) {
      throw new Error(
        `Refusing to serve "${slug}" publicly with unresolved facts:\n` +
          missing.map((m) => `  - ${m}`).join("\n") +
          `\nResolve these on the discovery call (docs/REVIEW.md §5) before going live.`,
      );
    }
  }

  return tenant;
}

/**
 * Whether to show the in-page "unresolved facts" banner. Demo and preview
 * builds show it so nothing placeholder-shaped is mistaken for finished work.
 */
export function pendingFacts(): string[] {
  return isPublicProduction() ? [] : missingRequiredFacts(getTenant());
}
