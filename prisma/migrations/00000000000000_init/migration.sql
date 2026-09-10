-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('en', 'ar');

-- CreateEnum
CREATE TYPE "StylistRole" AS ENUM ('stylist', 'admin');

-- CreateEnum
CREATE TYPE "StylingFor" AS ENUM ('women', 'men');

-- CreateEnum
CREATE TYPE "FitAccuracy" AS ENUM ('estimated', 'better', 'good', 'tailor');

-- CreateEnum
CREATE TYPE "PaymentModel" AS ENUM ('prepaid_full', 'fee_first');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('created', 'awaiting_clothing_payment', 'paid', 'styling', 'awaiting_approval', 'approved', 'shopping', 'shipped', 'delivered', 'returned', 'refunded', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentKind" AS ENUM ('styling_fee', 'clothing_budget', 'balance');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'authorised', 'captured', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('requested', 'sent', 'settled', 'failed');

-- CreateEnum
CREATE TYPE "ItemOutcome" AS ENUM ('pending', 'kept', 'returned');

-- CreateEnum
CREATE TYPE "ApprovalResponse" AS ENUM ('pending', 'approved', 'changes_requested');

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneE164" TEXT,
    "locale" "Locale" NOT NULL DEFAULT 'en',
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "marketingOptInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MagicLinkToken" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "redirectTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MagicLinkToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StylistUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "StylistRole" NOT NULL DEFAULT 'stylist',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StylistUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StylistSession" (
    "id" TEXT NOT NULL,
    "stylistId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StylistSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StylistMagicLinkToken" (
    "id" TEXT NOT NULL,
    "stylistId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StylistMagicLinkToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurement" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "heightMm" INTEGER,
    "bustMm" INTEGER,
    "chestMm" INTEGER,
    "waistMm" INTEGER,
    "hipMm" INTEGER,
    "shoulderMm" INTEGER,
    "armMm" INTEGER,
    "inseamMm" INTEGER,
    "noTape" BOOLEAN NOT NULL DEFAULT false,
    "filledCount" INTEGER NOT NULL DEFAULT 0,
    "accuracy" "FitAccuracy" NOT NULL DEFAULT 'estimated',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleProfile" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "answersSchemaVersion" INTEGER NOT NULL DEFAULT 2,
    "measurementId" TEXT,
    "stylingFor" "StylingFor" NOT NULL,
    "occasion" TEXT NOT NULL,
    "sizeTop" TEXT,
    "sizeBottom" TEXT,
    "sizeShoe" TEXT,
    "budgetTierFils" INTEGER,
    "answers" JSONB NOT NULL,
    "generated" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StyleProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "label" TEXT,
    "governorate" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "floor" TEXT,
    "flat" TEXT,
    "notes" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "styleProfileId" TEXT NOT NULL,
    "paymentModel" "PaymentModel" NOT NULL DEFAULT 'fee_first',
    "status" "OrderStatus" NOT NULL DEFAULT 'created',
    "lookCount" INTEGER NOT NULL,
    "budgetTierFils" INTEGER NOT NULL,
    "stylingFeeFils" INTEGER NOT NULL,
    "clothingBudgetFils" INTEGER NOT NULL,
    "deliveryFeeFils" INTEGER NOT NULL,
    "totalFils" INTEGER NOT NULL,
    "dueNowFils" INTEGER NOT NULL,
    "dueOnApprovalFils" INTEGER NOT NULL,
    "spentFils" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'KWD',
    "whatsappE164" TEXT NOT NULL,
    "addressId" TEXT,
    "addressGovernorate" TEXT NOT NULL,
    "addressArea" TEXT NOT NULL,
    "addressBlock" TEXT NOT NULL,
    "addressStreet" TEXT NOT NULL,
    "addressBuilding" TEXT NOT NULL,
    "addressFloor" TEXT,
    "addressFlat" TEXT,
    "addressNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "dueBy" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "kind" "PaymentKind" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "amountFils" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "providerRef" TEXT,
    "method" TEXT,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentId" TEXT,
    "amountFils" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'requested',
    "provider" TEXT NOT NULL,
    "providerRef" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "settledAt" TIMESTAMP(3),
    "failureNote" TEXT,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "sizePrimary" TEXT NOT NULL,
    "sizeAlternate" TEXT,
    "sentTwoSizes" BOOLEAN NOT NULL DEFAULT false,
    "costFils" INTEGER NOT NULL,
    "keptSize" TEXT,
    "outcome" "ItemOutcome" NOT NULL DEFAULT 'pending',
    "boughtByStylistId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP(3),

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LookApproval" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channel" TEXT NOT NULL DEFAULT 'whatsapp',
    "response" "ApprovalResponse" NOT NULL DEFAULT 'pending',
    "respondedAt" TIMESTAMP(3),
    "note" TEXT,

    CONSTRAINT "LookApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderStatusEvent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "fromStatus" "OrderStatus",
    "toStatus" "OrderStatus" NOT NULL,
    "actorId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderStatusEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_createdAt_idx" ON "Customer"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MagicLinkToken_tokenHash_key" ON "MagicLinkToken"("tokenHash");

-- CreateIndex
CREATE INDEX "MagicLinkToken_customerId_idx" ON "MagicLinkToken"("customerId");

-- CreateIndex
CREATE INDEX "MagicLinkToken_expiresAt_idx" ON "MagicLinkToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_customerId_idx" ON "Session"("customerId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "StylistUser_email_key" ON "StylistUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StylistSession_tokenHash_key" ON "StylistSession"("tokenHash");

-- CreateIndex
CREATE INDEX "StylistSession_stylistId_idx" ON "StylistSession"("stylistId");

-- CreateIndex
CREATE UNIQUE INDEX "StylistMagicLinkToken_tokenHash_key" ON "StylistMagicLinkToken"("tokenHash");

-- CreateIndex
CREATE INDEX "StylistMagicLinkToken_stylistId_idx" ON "StylistMagicLinkToken"("stylistId");

-- CreateIndex
CREATE INDEX "Measurement_customerId_isCurrent_idx" ON "Measurement"("customerId", "isCurrent");

-- CreateIndex
CREATE UNIQUE INDEX "Measurement_customerId_version_key" ON "Measurement"("customerId", "version");

-- CreateIndex
CREATE INDEX "StyleProfile_customerId_isCurrent_idx" ON "StyleProfile"("customerId", "isCurrent");

-- CreateIndex
CREATE INDEX "StyleProfile_occasion_idx" ON "StyleProfile"("occasion");

-- CreateIndex
CREATE INDEX "StyleProfile_stylingFor_idx" ON "StyleProfile"("stylingFor");

-- CreateIndex
CREATE UNIQUE INDEX "StyleProfile_customerId_version_key" ON "StyleProfile"("customerId", "version");

-- CreateIndex
CREATE INDEX "Address_customerId_isDefault_idx" ON "Address"("customerId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "Order_reference_key" ON "Order"("reference");

-- CreateIndex
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Order_customerId_createdAt_idx" ON "Order"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_provider_providerRef_key" ON "Payment"("provider", "providerRef");

-- CreateIndex
CREATE INDEX "Refund_orderId_idx" ON "Refund"("orderId");

-- CreateIndex
CREATE INDEX "Refund_status_idx" ON "Refund"("status");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_outcome_idx" ON "OrderItem"("outcome");

-- CreateIndex
CREATE INDEX "LookApproval_orderId_idx" ON "LookApproval"("orderId");

-- CreateIndex
CREATE INDEX "OrderStatusEvent_orderId_createdAt_idx" ON "OrderStatusEvent"("orderId", "createdAt");

-- AddForeignKey
ALTER TABLE "MagicLinkToken" ADD CONSTRAINT "MagicLinkToken_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StylistSession" ADD CONSTRAINT "StylistSession_stylistId_fkey" FOREIGN KEY ("stylistId") REFERENCES "StylistUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StylistMagicLinkToken" ADD CONSTRAINT "StylistMagicLinkToken_stylistId_fkey" FOREIGN KEY ("stylistId") REFERENCES "StylistUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleProfile" ADD CONSTRAINT "StyleProfile_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleProfile" ADD CONSTRAINT "StyleProfile_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_styleProfileId_fkey" FOREIGN KEY ("styleProfileId") REFERENCES "StyleProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_boughtByStylistId_fkey" FOREIGN KEY ("boughtByStylistId") REFERENCES "StylistUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LookApproval" ADD CONSTRAINT "LookApproval_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatusEvent" ADD CONSTRAINT "OrderStatusEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatusEvent" ADD CONSTRAINT "OrderStatusEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "StylistUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

