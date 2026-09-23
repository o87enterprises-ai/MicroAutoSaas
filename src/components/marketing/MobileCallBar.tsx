import Link from "next/link";
import { getTenant } from "@/lib/tenant";
import { isPlaceholder } from "@/config/types";
import { PhoneIcon } from "./CallButton";

/**
 * Fixed bottom bar on mobile. Most service-trade traffic is a phone in a
 * hallway next to a dead outlet — the two actions that matter are always
 * one thumb-reach away.
 */
export function MobileCallBar() {
  const t = getTenant();
  const phone = t.contact.phone;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-navy-100 bg-white p-2.5 md:hidden">
      {isPlaceholder(phone) ? (
        <span className="flex items-center justify-center gap-2 rounded-lg bg-navy-100 py-3 font-semibold text-navy-600">
          <PhoneIcon />
          Phone TBD
        </span>
      ) : (
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-2 rounded-lg bg-amber-brand py-3 font-semibold text-navy-900"
        >
          <PhoneIcon />
          Call
        </a>
      )}
      <Link
        href="/contact"
        className="flex items-center justify-center gap-2 rounded-lg bg-navy-800 py-3 font-semibold text-white"
      >
        Get an estimate
      </Link>
    </div>
  );
}
