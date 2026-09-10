/**
 * Supabase connection details.
 *
 * Both values are public by design — the publishable key is meant to be seen.
 * What keeps the database safe is row level security: the `anon` role is
 * granted nothing at all, and a signed-in customer can only reach their own
 * row. See supabase/migrations/*_customer_linked_to_supabase_auth.sql.
 *
 * Read from the *unprefixed* names first, and that is deliberate. Nothing in
 * the browser creates a Supabase client here — sign-up, sign-in and the
 * session all run in Server Actions — so these never need to be inlined into a
 * bundle. A `NEXT_PUBLIC_` variable is baked in at build time, which means a
 * deployment built before the variable existed keeps saying "not configured"
 * however many times you set it afterwards. An unprefixed one is read at
 * runtime and simply starts working.
 *
 * The `NEXT_PUBLIC_` spellings are still accepted, so a deployment already
 * configured that way does not break.
 */
const url =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "";

/**
 * `sb_publishable_…` is the current key format. The legacy JWT `anon` key is
 * accepted too, because a project created before the change still issues one
 * and there is no reason to make that a deployment error.
 */
const publishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_ANON_KEY ??
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
