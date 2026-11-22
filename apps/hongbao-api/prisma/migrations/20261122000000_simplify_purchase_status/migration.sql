-- AlterEnum
-- PurchaseStatus becomes PENDING / APPROVED / CANCELLED.
--   * PAID     -> APPROVED (renamed in place, keeps existing rows)
--   * FAILED   -> CANCELLED
--   * REFUNDED -> CANCELLED
-- Postgres can't drop enum values, so the type is recreated.
ALTER TYPE "PurchaseStatus" RENAME VALUE 'PAID' TO 'APPROVED';

UPDATE "Purchase" SET "status" = 'CANCELLED' WHERE "status" IN ('FAILED', 'REFUNDED');

ALTER TYPE "PurchaseStatus" RENAME TO "PurchaseStatus_old";
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'APPROVED', 'CANCELLED');
ALTER TABLE "Purchase" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Purchase" ALTER COLUMN "status" TYPE "PurchaseStatus" USING ("status"::text::"PurchaseStatus");
ALTER TABLE "Purchase" ALTER COLUMN "status" SET DEFAULT 'PENDING';
DROP TYPE "PurchaseStatus_old";
