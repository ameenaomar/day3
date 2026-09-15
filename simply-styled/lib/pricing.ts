/**
 * Rate lookup and money formatting. Pure — no React, no side effects.
 */

import { FILS_PER_DINAR, rates, type ServiceMode } from "@/lib/site.config";
import { type Locale } from "@/lib/i18n";

export type Quote = {
  readonly outfits: number;
  readonly filsPerOutfit: number;
  readonly totalFils: number;
};

/**
 * The rate for an order of `outfits`, taking the best band the order qualifies
 * for. Bands are read highest-threshold-first so band order in the config does
 * not have to be trusted.
 */
export function quoteFor(mode: ServiceMode, outfits: number): Quote {
  if (!Number.isInteger(outfits) || outfits < 1) {
    throw new RangeError(`outfits must be a positive integer, got ${outfits}`);
  }

  const bands = [...rates[mode]].sort((a, b) => b.minOutfits - a.minOutfits);
  const band = bands.find((b) => outfits >= b.minOutfits) ?? bands[bands.length - 1];

  // rates[mode] is non-empty by construction, but the config is hand-edited.
  if (band === undefined) {
    throw new Error(`No rate bands configured for "${mode}".`);
  }

  return {
    outfits,
    filsPerOutfit: band.filsPerOutfit,
    totalFils: band.filsPerOutfit * outfits,
  };
}

/**
 * Formats fils as a bare dinar amount — "5.000", or "\u0665\u066b\u0660\u0660\u0660" in Arabic.
 *
 * The unit is deliberately not included. Intl only ever renders KWD as the ISO
 * code ("KWD 5.000"), where Kuwait writes "5.000 KD"; and the unit is a word
 * shown to users, so it belongs in lib/translations.ts like all other copy.
 * Always shown to three decimals, because the dinar divides into 1000 fils.
 */
/** A plain integer in the locale's numerals — "7", or "٧" in Arabic. */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-KW" : "en-KW").format(value);
}

export function formatAmount(fils: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-KW" : "en-KW", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(fils / FILS_PER_DINAR);
}
