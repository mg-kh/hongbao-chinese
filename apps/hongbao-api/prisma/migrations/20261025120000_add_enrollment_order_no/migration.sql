-- AlterTable: add nullable first so existing rows can be backfilled
ALTER TABLE "Enrollment" ADD COLUMN "orderNo" TEXT;

-- Backfill from the latest purchase of the same product, preferring PAID ones
UPDATE "Enrollment" e
SET "orderNo" = (
  SELECT p."orderNo"
  FROM "PurchaseItem" pi
  JOIN "Purchase" p ON p."id" = pi."purchaseId"
  WHERE p."userId" = e."userId"
    AND (pi."courseId" = e."courseId" OR pi."levelTestId" = e."levelTestId")
  ORDER BY (p."status" = 'PAID') DESC, p."createdAt" DESC
  LIMIT 1
);

-- Enrollments with no matching purchase (e.g. granted manually)
UPDATE "Enrollment" SET "orderNo" = 'LEGACY' WHERE "orderNo" IS NULL;

ALTER TABLE "Enrollment" ALTER COLUMN "orderNo" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Enrollment_orderNo_idx" ON "Enrollment"("orderNo");
