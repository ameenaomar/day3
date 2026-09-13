/**
 * Language primitives. Kept dependency-free so both server and client code,
 * and the config files, can import it without pulling React in.
 */

export const LOCALES = ["en", "ar"] as const;

export type Locale = (typeof LOCALES)[number];

/** English is the default: the online, worldwide side of the business. */
export const DEFAULT_LOCALE: Locale = "en";

/** Where the visitor's choice is persisted, so it survives a refresh. */
export const LOCALE_STORAGE_KEY = "simply-styled:locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function dirFor(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** The locale the toggle switches to. */
export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}
