import { PLACEHOLDER, type TenantConfig } from "@/config/types";

/**
 * South Valley Electric LLC — Cottage Grove, OR.
 *
 * PLACEHOLDER values are the open items from the discovery call
 * (docs/REVIEW.md §5). The production build refuses to ship with any of
 * them unresolved.
 */
export const southValleyElectric: TenantConfig = {
  slug: "south-valley-electric",
  businessName: "South Valley Electric LLC",
  shortName: "South Valley Electric",
  tagline: "Licensed electricians serving Cottage Grove and south Lane County",
  description:
    "Panel upgrades, EV charger installation, rewiring and electrical troubleshooting for homes and small businesses in Cottage Grove, Creswell and the surrounding area.",

  ccbNumber: PLACEHOLDER,
  insuranceStatement: "Licensed, bonded and insured in the State of Oregon.",

  contact: {
    phone: PLACEHOLDER,
    phoneDisplay: PLACEHOLDER,
    email: PLACEHOLDER,
    smsPhone: PLACEHOLDER,
  },

  address: {
    city: "Cottage Grove",
    state: "OR",
    postalCode: "97424",
    latitude: 43.7979,
    longitude: -123.0595,
  },

  serviceArea: [
    "Cottage Grove",
    "Creswell",
    "Eugene",
    "Springfield",
    "Drain",
    "Yoncalla",
  ],

  hours: {
    weekdays: "7:00 AM – 5:00 PM",
    saturday: "By appointment",
    sunday: "Closed",
    emergencyNote:
      "Electrical emergency? Call anytime — burning smells, sparking outlets and dead panels don't wait for business hours.",
  },

  services: [
    {
      slug: "panel-upgrades",
      name: "Panel Upgrades & Service Changes",
      summary:
        "Replace an undersized or unsafe panel with a modern 200-amp service.",
      detail:
        "Older Cottage Grove homes often run on 60- or 100-amp panels that can't keep up with today's appliances, heat pumps and EV chargers. We handle the full upgrade — permit, utility coordination, new panel and breakers, and inspection sign-off.",
      jobType: "panel_upgrade",
    },
    {
      slug: "ev-charger-installation",
      name: "EV Charger Installation",
      summary: "Level 2 home charging installed to code, inspected and ready.",
      detail:
        "We size the circuit, run the wiring, install your charger and pull the permit. If your panel can't support the load, we'll tell you before you buy anything — and quote the upgrade honestly.",
      jobType: "ev_charger",
    },
    {
      slug: "troubleshooting-repair",
      name: "Troubleshooting & Repair",
      summary:
        "Breakers that trip, outlets that don't work, lights that flicker.",
      detail:
        "Intermittent electrical faults are diagnostic work, not guesswork. We trace the actual cause — loose neutrals, failing breakers, rodent damage, overloaded circuits — and fix it, rather than replacing parts until the symptom stops.",
      jobType: "troubleshoot",
      emergency: true,
    },
    {
      slug: "rewiring",
      name: "Rewiring & Knob-and-Tube Replacement",
      summary:
        "Replace aging or ungrounded wiring, whole-house or room by room.",
      detail:
        "Cloth-insulated and knob-and-tube wiring is a fire and insurance problem. We can phase the work room by room to spread the cost, and we'll prioritize the circuits that actually matter first.",
      jobType: "rewire",
    },
    {
      slug: "lighting-outlets",
      name: "Lighting, Outlets & Switches",
      summary:
        "New circuits, recessed lighting, GFCI protection, outdoor outlets.",
      detail:
        "The small jobs that make a house work: adding outlets where you actually need them, GFCI protection in kitchens and baths, exterior and shop lighting, ceiling fans and dimmers.",
      jobType: "other",
    },
    {
      slug: "generators",
      name: "Generator & Transfer Switch Installation",
      summary: "Stay powered through Lane County storm outages.",
      detail:
        "Portable or standby, the safe part is the transfer switch. We install it properly so you're never backfeeding the grid or running cords through a window.",
      jobType: "other",
    },
  ],

  // Intentionally empty. We do not ship invented testimonials — the Reviews
  // page renders an honest pre-launch state until real reviews exist.
  testimonials: [],

  googleReviewUrl: PLACEHOLDER,
  domain: PLACEHOLDER,

  brand: {
    primary: "#0b2545",
    accent: "#f5a524",
  },
};
