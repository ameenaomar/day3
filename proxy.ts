import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { withRefreshedSession } from "@/lib/supabase/session";

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The prototype is the site: `/` is rewritten to public/simply-styled.html by
  // next.config.ts, and it carries its own language switch, so it must not be
  // redirected into a locale prefix.
  if (pathname === "/") return NextResponse.next();

  const alreadyLocalised = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (alreadyLocalised) {
    // Rebuilt on demand rather than once: refreshing the Supabase session can
    // rotate the access token, and the response has to be recreated afterwards
    // for the route to see the new one. Server components have no access to the
    // pathname either; the language switch needs it to send the viewer to the
    // same screen in the other locale.
    const makeResponse = (cookieHeader: string) => {
      const headers = new Headers(request.headers);
      headers.set("x-ss-pathname", pathname);
      // Written explicitly because a refresh replaces the session cookie and
      // that change does not reach `request.headers` on its own.
      headers.set("cookie", cookieHeader);
      return NextResponse.next({ request: { headers } });
    };

    return await withRefreshedSession(request, makeResponse);
  }

  const locale = preferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip the API, the stylist's tool, the auth callbacks, Next's internals, and
  // anything with a file extension. Matching on the extension rather than an
  // explicit list of filenames matters: the list version silently missed
  // /icon.svg, which was redirected to /en/icon.svg and 404ed, and it would
  // have missed every static asset added later too.
  //
  // `/auth/*` is excluded because those URLs are baked into confirmation
  // emails: a link opened weeks later must not be redirected through whatever
  // locale the reader's cookie happens to say.
  matcher: ["/((?!api|admin|auth|_next|.*\\.[a-zA-Z0-9]+$).*)"],
};
