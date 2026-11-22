-- AlterTable
-- Reason an admin gave when rejecting a PENDING order (status -> CANCELLED).
ALTER TABLE "Purchase" ADD COLUMN "rejectReason" TEXT;
