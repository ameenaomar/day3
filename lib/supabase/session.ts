import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "./config";

/**
 * Refreshes the Supabase session on the way through the proxy, and returns the
 * response to send.
 *
 * Access tokens are short-lived. This is the only place that can hand a rotated
 * token back to the browser, because a Server Component renders with a
 * read-only cookie store — without it a signed-in customer is dropped onto the
 * sign-in screen an hour after signing in.
 *
 * `makeResponse` is a factory, called again after a refresh, and it is handed
 * the `cookie` header to forward. Both details matter. The request headers
 * `NextResponse.next({ request })` forwards are a snapshot taken when the
 * response is created, so a response built before the refresh would forward the
 * old access token; and mutating `request.cookies` does not show up in
 * `request.headers`, so the new token has to be written into the header
 * explicitly. Get either wrong and the route refreshes a second time with a
 * refresh token this call has already spent — which works only for as long as
 * the auth server's reuse grace allows, and signs the customer out when it
 * does not.
 */
export async function withRefreshedSession(
  request: NextRequest,
  makeResponse: (forwardedCookieHeader: string) => NextResponse,
): Promise<NextResponse> {
  let response = makeResponse(request.cookies.toString());
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(toSet, headers) {
        for (const { name, value } of toSet) {
          request.cookies.set(name, value);
        }
        // Rebuilt with the rotated token in the forwarded cookie header, so
        // whatever renders next is already holding the current session.
        response = makeResponse(request.cookies.toString());

        for (const { name, value, options } of toSet) {
          // httpOnly is forced: nothing in the browser reads these, and a token
          // a script can read is a token an injected script can steal.
          response.cookies.set(name, value, { ...options, httpOnly: true });
        }
        // The library hands back the cache headers a response carrying auth
        // cookies must have. Without them a CDN or reverse proxy is free to
        // cache this response — and serve one customer's session to the next
        // person through.
        for (const [key, value] of Object.entries(headers ?? {})) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // The call itself is the point: it is what rotates an expired token. A
  // failure here means "not signed in", which is not an error worth surfacing.
  await supabase.auth.getUser();

  return response;
}
