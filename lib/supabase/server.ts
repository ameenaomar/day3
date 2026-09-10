import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "./config";

/**
 * The server-side Supabase client, reading and writing the session through
 * Next's cookie store.
 *
 * Sign-in and sign-up run here rather than in the browser, so the password is
 * only ever in a POST body to our own origin, and the session cookies come back
 * `httpOnly` — a script on the page cannot read the access token.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see .env.example)",
    );
  }

  const store = await cookies();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(toSet) {
        try {
          for (const { name, value, options } of toSet) {
            // httpOnly is forced rather than left to the library's default: no
            // code in the browser needs to read these, and an access token a
            // script can read is an access token an injected script can steal.
            // Adding a browser Supabase client later would mean revisiting
            // this, and it should be a deliberate decision when it happens.
            store.set(name, value, { ...options, httpOnly: true });
          }
        } catch {
          // Server Components render with a read-only cookie store. A refresh
          // attempted during a render is dropped here and done properly by
          // proxy.ts on the next request, which is the documented arrangement.
        }
      },
    },
  });
}

/**
 * The signed-in customer, or null. `getUser()` rather than `getSession()`:
 * getSession trusts whatever is in the cookie, getUser verifies it against the
 * auth server, and an authorisation decision must not be made on an unverified
 * token.
 */
export async function currentUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
