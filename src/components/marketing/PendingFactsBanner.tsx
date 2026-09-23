import { pendingFacts } from "@/lib/tenant";

/**
 * Visible only in preview and development. Makes it obvious at a glance which
 * facts are still missing, so a demo is never mistaken for a launch-ready site.
 */
export function PendingFactsBanner() {
  const facts = pendingFacts();
  if (facts.length === 0) return null;

  return (
    <div className="border-b border-amber-brand/40 bg-amber-brand/15 px-4 py-2.5 text-center text-xs text-navy-800 sm:text-sm">
      <span className="font-semibold">Preview build.</span> Pending from
      discovery: {facts.map((f) => f.replace(/ \(.*\)$/, "")).join(", ")}.
    </div>
  );
}
