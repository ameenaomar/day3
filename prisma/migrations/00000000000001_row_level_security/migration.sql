-- Supabase exposes the public schema through PostgREST, so anything reachable
-- with the anon or authenticated key is reachable by anyone who reads the
-- page source. Customer measurements, phone numbers and payment references
-- must never be among them.
--
-- RLS is enabled on every table and NO policies are created: that denies the
-- anon and authenticated roles outright. The app reaches the database as the
-- Postgres owner through Prisma, which bypasses RLS, so the server keeps full
-- access while the public API keys get nothing.
--
-- If a table is ever meant to be read straight from the browser, it needs an
-- explicit policy added deliberately — never a blanket "enable read".
--
-- Harmless on a plain Postgres host: the roles simply do not exist there, so
-- the DO block skips the grants and the ALTER TABLEs stand on their own.

ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MagicLinkToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StylistUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StylistSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StylistMagicLinkToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Measurement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StyleProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Address" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Refund" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LookApproval" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderStatusEvent" ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon')
     AND EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON ALL TABLES IN SCHEMA "public" FROM anon, authenticated;
    REVOKE ALL ON ALL SEQUENCES IN SCHEMA "public" FROM anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA "public" REVOKE ALL ON TABLES FROM anon, authenticated;
    ALTER DEFAULT PRIVILEGES IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM anon, authenticated;
  END IF;
END $$;
