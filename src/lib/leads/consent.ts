/**
 * TCPA consent disclosure.
 *
 * The exact text shown to the user is recorded in `consent_events.disclosure_text`
 * alongside its version, so we can prove *what* someone agreed to and *when*
 * (BRIEF §7.1, DECISIONS.md D-007). Never edit a version in place — add a new one.
 */
export const CONSENT_VERSION = "2026-09-v1";

export function consentDisclosure(businessName: string): string {
  return (
    `By checking this box, I agree that ${businessName} may contact me by phone, ` +
    `text message and email about my request, including with automated messages. ` +
    `Consent is not a condition of purchase. Message and data rates may apply. ` +
    `Reply STOP to opt out at any time.`
  );
}
