import type { Locale } from "@/lib/i18n/config";

/**
 * Money is integer fils throughout. The Kuwaiti dinar has three decimal
 * places, so a float would round wrongly on amounts we actually charge
 * (0.005 KD is a real amount, not a rounding artefact). Nothing in this
 * codebase should hold a dinar amount as a number.
 */
export const FILS_PER_DINAR = 1000;

const ARABIC_INDIC = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"] as const;
const ARABIC_DECIMAL_SEPARATOR = "٫"; // ٫
const ARABIC_THOUSANDS_SEPARATOR = "٬"; // ٬

/** Convert a dinar literal to fils. For fixtures and constants, not user input. */
export function dinars(amount: number): number {
  const fils = Math.round(amount * FILS_PER_DINAR);
  if (!Number.isFinite(fils)) throw new RangeError(`not a dinar amount: ${amount}`);
  return fils;
}

function toArabicDigits(value: string): string {
  return value.replace(/[0-9]/g, (d) => ARABIC_INDIC[Number(d)]!);
}

function groupThousands(digits: string, separator: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

/**
 * `10.000 KD` in English, `١٠٫٠٠٠ د.ك` in Arabic — always three decimal
 * places, never two.
 *
 * Hand-rolled rather than Intl.NumberFormat: `ar-KW` output varies with the
 * ICU build shipped by the runtime (digit set, separator, symbol placement),
 * and "varies by runtime" is not acceptable for a price the customer is about
 * to agree to.
 */
export function formatKwd(amountFils: number, locale: Locale): string {
  if (!Number.isInteger(amountFils)) {
    throw new TypeError(`amountFils must be an integer number of fils, got ${amountFils}`);
  }

  const negative = amountFils < 0;
  const absolute = Math.abs(amountFils);
  const whole = String(Math.trunc(absolute / FILS_PER_DINAR));
  const fraction = String(absolute % FILS_PER_DINAR).padStart(3, "0");
  const sign = negative ? "-" : "";

  if (locale === "ar") {
    const body =
      toArabicDigits(groupThousands(whole, ARABIC_THOUSANDS_SEPARATOR)) +
      ARABIC_DECIMAL_SEPARATOR +
      toArabicDigits(fraction);
    return `${sign}${body} د.ك`;
  }

  return `${sign}${groupThousands(whole, ",")}.${fraction} KD`;
}

/**
 * Parse a dinar amount typed by a stylist (item cost) into fils, without ever
 * touching a float. Accepts `12`, `12.5`, `12.500`, `١٢٫٥٠٠`. Returns null on
 * anything else — callers must treat null as a validation failure.
 */
export function parseKwdToFils(input: string): number | null {
  let normalised = input.trim();
  if (normalised === "") return null;

  // Accept Arabic-Indic digits and separators from an Arabic-locale keyboard.
  normalised = normalised
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/٫/g, ".")
    .replace(/٬/g, ",");

  // Thousands separators must group correctly. Stripping them unconditionally
  // would read a mistyped "12,5.5" as 125.500 KD — a tenfold error in an
  // amount a stylist is recording against real money.
  const match = /^(-?)(\d{1,3}(?:,\d{3})*|\d+)(?:\.(\d{1,3}))?$/.exec(normalised);
  if (!match) return null;

  const sign = match[1] ?? "";
  const whole = match[2] ?? "0";
  const fraction = match[3] ?? "";
  const fils =
    Number(whole.replace(/,/g, "")) * FILS_PER_DINAR + Number(fraction.padEnd(3, "0"));
  return sign === "-" ? -fils : fils;
}
