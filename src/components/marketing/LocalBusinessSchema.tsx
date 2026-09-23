import { getTenant } from "@/lib/tenant";
import { isPlaceholder } from "@/config/types";

/**
 * Schema.org Electrician (a LocalBusiness subtype) — the structured data
 * Google uses for local packs. Placeholder values are omitted rather than
 * emitted as "TBD", because bad structured data is worse than none.
 */
export function LocalBusinessSchema() {
  const t = getTenant();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (isPlaceholder(t.domain) ? undefined : `https://${t.domain}`);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Electrician",
    name: t.businessName,
    description: t.description,
    areaServed: t.serviceArea.map((city) => ({
      "@type": "City",
      name: `${city}, ${t.address.state}`,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: t.address.city,
      addressRegion: t.address.state,
      addressCountry: "US",
      ...(isPlaceholder(t.address.postalCode)
        ? {}
        : { postalCode: t.address.postalCode }),
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: t.address.latitude,
      longitude: t.address.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "17:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Electrical services",
      itemListElement: t.services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.summary },
      })),
    },
  };

  if (!isPlaceholder(t.contact.phone)) schema.telephone = t.contact.phone;
  if (!isPlaceholder(t.contact.email)) schema.email = t.contact.email;
  if (siteUrl) schema.url = siteUrl;

  return (
    <script
      type="application/ld+json"
      // Values come from our own typed config, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
