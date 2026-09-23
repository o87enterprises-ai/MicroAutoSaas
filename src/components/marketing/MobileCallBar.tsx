import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { isPlaceholder } from "@/config/types";
import { PhoneIcon } from "./CallButton";

/**
 * Most service-trade traffic is a phone held in a hallway next to a dead
 * outlet. The two actions that matter stay one thumb-reach away.
 */
export function MobileCallBar() {
  const t = getTenant();
  const phone = t.contact.phone;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-white/[0.07] bg-ink-900/95 p-2.5 backdrop-blur-xl md:hidden">
      {isPlaceholder(phone) ? (
        <span className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-sm font-medium text-chalk-dim">
          <PhoneIcon />
          Phone TBD
        </span>
      ) : (
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-2 rounded-full bg-amber-brand py-3 text-sm font-semibold text-ink-900"
        >
          <PhoneIcon />
          Call
        </a>
      )}
      <Link
        href="/contact"
        className="flex items-center justify-center rounded-full border border-white/15 py-3 text-sm font-semibold text-chalk"
      >
        Get an estimate
      </Link>
    </div>
  );
}
