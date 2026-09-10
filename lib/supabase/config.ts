/**
 * Supabase connection details.
 *
 * Both values are public by design — the publishable key ships inside the
 * browser bundle and inside public/whatcaniwear.html. What keeps the database
 * safe is row level security: the `anon` role is granted nothing at all, and a
 * signed-in customer can only reach their own row. See
 * supabase/migrations/20260910135127_customer_linked_to_supabase_auth.sql.
 *
 * The reads below are written as direct `process.env.NEXT_PUBLIC_…` property
 * accesses on purpose: that is the form Next inlines at build time. Pulling
 * them out of a destructured object, or through a helper that takes the name as
 * an argument, leaves them undefined in the browser.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/**
 * `sb_publishable_…` is the current key format. The legacy JWT `anon` key is
 * accepted too, because a project created before the change still issues one
 * and there is no reason to make that a deployment error.
 */
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export const supabaseUrl = url;
export const supabasePublishableKey = publishableKey;

/**
 * Nothing here throws on import. A build with no Supabase environment must
 * still succeed — the sign-in and sign-up screens say the machine is not
 * configured rather than returning a 500.
 */
export function isSupabaseConfigured(): boolean {
  return url.length > 0 && publishableKey.length > 0;
}
