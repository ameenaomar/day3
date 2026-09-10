-- The Supabase Auth user a customer signs in as.
--
-- Only the column lives here, because it is the only part that is portable.
-- The trigger that fills it, and the row-level-security policies that use it,
-- reference `auth.users` and `auth.uid()` — Supabase's own schema — so they
-- live in supabase/migrations/ and are applied to the Supabase project.
ALTER TABLE "Customer" ADD COLUMN "authUserId" UUID;

CREATE UNIQUE INDEX "Customer_authUserId_key" ON "Customer"("authUserId");
