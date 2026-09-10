-- Supabase's security advisor flagged both trigger functions as reachable over
-- the REST API (/rest/v1/rpc/...). handle_new_user() is SECURITY DEFINER, so
-- it runs with the owner's rights and has no business being callable by a
-- signed-in user, let alone an anonymous one.
--
-- Postgres grants EXECUTE to PUBLIC by default (the `=X/postgres` entry in
-- proacl) and anon/authenticated inherit it, so revoking from those roles
-- individually does nothing — the PUBLIC grant is the one that matters.
--
-- Triggers check EXECUTE when the trigger is created rather than each time it
-- fires, so this leaves the signup trigger working. Verified by inserting an
-- auth.users row and seeing the profile appear, inside a rolled-back
-- transaction, after the revoke.

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.touch_updated_at() from public;
