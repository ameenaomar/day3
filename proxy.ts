import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n/config";

/**
 * Both locales live at real, indexable routes (/en/..., /ar/...). Anything
 * without a locale prefix is redirected to the viewer's — cookie first, so the
 * choice persists across the session, then Accept-Language.
 */
function preferredLocale(request: NextRequest): Locale {
  const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (fromCookie && isLocale(fromCookie)) return fromCookie;

  const header = request.headers.get("accept-language");
  if (header) {
    for (const part of header.split(",")) {
      const tag = part.split(";")[0]?.trim().toLowerCase() ?? "";
      const base = tag.split("-")[0] ?? "";
      if (isLocale(base)) return base;
    }
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const alreadyLocalised = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (alreadyLocalised) {
    // Server components have no access to the pathname; the language switch
    // needs it to send the viewer to the same screen in the other locale.
    const headers = new Headers(request.headers);
    headers.set("x-ss-pathname", pathname);
    return NextResponse.next({ request: { headers } });
  }

  const locale = preferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|admin|_next|fonts|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)"],
};
