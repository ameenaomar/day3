/**
 * Kuwait-only delivery, validated server-side. The client-side checks are a
 * convenience; these are the defence.
 */

/** The six governorates. Anything else is not a Kuwaiti address. */
export const GOVERNORATES = [
  "al_asimah",
  "hawalli",
  "farwaniya",
  "mubarak_al_kabeer",
  "ahmadi",
  "jahra",
] as const;

export type Governorate = (typeof GOVERNORATES)[number];

export function isGovernorate(value: string): value is Governorate {
  return (GOVERNORATES as readonly string[]).includes(value);
}

const ARABIC_INDIC_RANGE = /[٠-٩]/g;

function toWesternDigits(value: string): string {
  return value.replace(ARABIC_INDIC_RANGE, (d) => String(d.charCodeAt(0) - 0x0660));
}

/**
 * Kuwaiti mobile numbers are 8 digits starting 5, 6 or 9. Accepts what people
 * actually type — spaces, dashes, +965, 00965, Arabic-Indic digits — and
 * returns E.164, or null.
 *
 * Returning null rather than a best guess matters: this number is the only way
 * the stylist reaches the customer to approve the look.
 */
export function normaliseKuwaitiPhone(input: string): string | null {
  let digits = toWesternDigits(input).replace(/[\s\-()./]/g, "");

  if (digits.startsWith("+965")) digits = digits.slice(4);
  else if (digits.startsWith("00965")) digits = digits.slice(5);
  else if (digits.startsWith("965") && digits.length === 11) digits = digits.slice(3);

  if (!/^[569]\d{7}$/.test(digits)) return null;
  return `+965${digits}`;
}

export function isKuwaitiPhone(input: string): boolean {
  return normaliseKuwaitiPhone(input) !== null;
}

/** Display as `5XXX XXXX`, the way Kuwaiti numbers are written. */
export function formatKuwaitiPhone(e164: string): string {
  const local = e164.replace(/^\+965/, "");
  if (!/^\d{8}$/.test(local)) return e164;
  return `${local.slice(0, 4)} ${local.slice(4)}`;
}
