import { pendingFacts } from "@/lib/tenant";

/**
 * Preview and development only. Makes the missing discovery facts obvious so a
 * demo is never mistaken for a launch-ready site.
 */
export function PendingFactsBanner() {
  const facts = pendingFacts();
  if (facts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 z-[60] w-[min(92vw,44rem)] -translate-x-1/2 rounded-full border border-amber-brand/30 bg-ink-800/90 px-5 py-2 text-center text-[11px] text-chalk-dim backdrop-blur md:bottom-5">
      <span className="font-semibold text-amber-brand">Preview</span> · pending
      from discovery:{" "}
      {facts.map((f) => f.replace(/ \(.*\)$/, "")).join(", ")}
    </div>
  );
}
