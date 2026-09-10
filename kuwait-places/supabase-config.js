/* Supabase connection for Yalla, where to?
 *
 * Both values below are meant to be public. The publishable key identifies the
 * project and nothing more — it grants exactly what the database's row-level
 * security policies allow an anonymous or authenticated caller to do, which is
 * why every table here has RLS enabled and policies scoped to auth.uid().
 *
 * What must NEVER appear in this file, or anywhere else the browser can read:
 * the service_role key. It bypasses RLS entirely.
 *
 * Passwords are not stored by this app at all. Supabase Auth owns them in
 * auth.users, hashed with bcrypt; the public.profiles table holds only a
 * display name.
 */

window.SUPABASE_CONFIG = {
  url: "https://bhouvmrsbtlwmraiyyim.supabase.co",
  publishableKey: "sb_publishable_MGRNhNKaQYjwFH09PwrsCg_j7IeivNq",
};
