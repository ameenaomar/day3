-- Delivery is no longer part of the business. This removes it from the data
-- model: the saved-address book, the address snapshot an order carried, the
-- delivery fee, and the two shipping states in the order lifecycle.
--
-- Safe as a plain drop because no row anywhere has ever been written: the
-- order tables have never had a writer in the application.

-- The address book, its foreign keys, its index and its RLS grant all go with
-- the table.
ALTER TABLE "Order" DROP CONSTRAINT "Order_addressId_fkey";
DROP TABLE "Address";

-- The snapshot the order kept of where it was going.
ALTER TABLE "Order"
  DROP COLUMN "addressId",
  DROP COLUMN "addressGovernorate",
  DROP COLUMN "addressArea",
  DROP COLUMN "addressBlock",
  DROP COLUMN "addressStreet",
  DROP COLUMN "addressBuilding",
  DROP COLUMN "addressFloor",
  DROP COLUMN "addressFlat",
  DROP COLUMN "addressNotes",
  DROP COLUMN "deliveryFeeFils";

-- `shipped` and `delivered` are replaced by a single `completed`, so an order
-- still has a terminal success state that does not describe a courier.
ALTER TABLE "Order" DROP COLUMN "shippedAt";
ALTER TABLE "Order" DROP COLUMN "deliveredAt";
ALTER TABLE "Order" ADD COLUMN "completedAt" TIMESTAMP(3);

-- Postgres cannot drop a value from an enum in place, so the type is rebuilt
-- and every column using it is moved across.
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";

CREATE TYPE "OrderStatus" AS ENUM (
  'created',
  'awaiting_clothing_payment',
  'paid',
  'styling',
  'awaiting_approval',
  'approved',
  'shopping',
  'completed',
  'returned',
  'refunded',
  'cancelled'
);

ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order"
  ALTER COLUMN "status" TYPE "OrderStatus" USING ("status"::text::"OrderStatus");
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'created';

ALTER TABLE "OrderStatusEvent"
  ALTER COLUMN "fromStatus" TYPE "OrderStatus" USING ("fromStatus"::text::"OrderStatus");
ALTER TABLE "OrderStatusEvent"
  ALTER COLUMN "toStatus" TYPE "OrderStatus" USING ("toStatus"::text::"OrderStatus");

DROP TYPE "OrderStatus_old";
