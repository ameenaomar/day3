"use server";

import { redirect } from "next/navigation";
import { LOCALE_COOKIE, defaultLocale, isLocale, locales } from "@/lib/i18n/config";
import { cookies } from "next/headers";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Switch locale and land on the same screen. A form rather than a link, so the
 * choice is persisted in a cookie — and so it still works with no JS.
 */
export async function switchLocale(formData: FormData): Promise<never> {
  const requested = String(formData.get("locale") ?? "");
  const locale = isLocale(requested) ? requested : defaultLocale;

  const rawPath = String(formData.get("path") ?? "/");
  // Only ever redirect within this site, and only to a locale-prefixed path.
  const path = rawPath.startsWith("/") && !rawPath.startsWith("//") ? rawPath : "/";
  const stripped = locales.reduce(
    (acc, l) => (acc === `/${l}` ? "" : acc.startsWith(`/${l}/`) ? acc.slice(l.length + 1) : acc),
    path,
  );

  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, { maxAge: ONE_YEAR, sameSite: "lax", path: "/" });

  redirect(`/${locale}${stripped}`);
}
