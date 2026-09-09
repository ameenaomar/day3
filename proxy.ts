import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n/config";

/**
 * Both locales live at real, indexable routes (/en/..., /ar/...). Anything
 * without a locale prefix — apart from `/`, which serves the prototype — is
 * redirected to the viewer's: cookie first, so the choice persists across the
 * session, then Accept-Language.
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

  // The prototype is the site: `/` is rewritten to public/simply-styled.html by
  // next.config.ts, and it carries its own language switch, so it must not be
  // redirected into a locale prefix.
  if (pathname === "/") return NextResponse.next();

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
  // Skip the API, the stylist's tool, Next's internals, and anything with a
  // file extension. Matching on the extension rather than an explicit list of
  // filenames matters: the list version silently missed /icon.svg, which was
  // redirected to /en/icon.svg and 404ed, and it would have missed every
  // static asset added later too.
  matcher: ["/((?!api|admin|_next|.*\\.[a-zA-Z0-9]+$).*)"],
};
