-- Purchase / PurchaseItem / Enrollment.
-- Hand-written so existing "CourseEnrollment" rows are preserved:
--   * every CourseEnrollment row becomes a Purchase + PurchaseItem (payment history)
--   * APPROVED / EXPIRED rows stay on as Enrollment rows (access)
--   * PENDING / REJECTED rows only live on as Purchases (PENDING / FAILED)

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderNo" TEXT NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'THB',
    "paymentType" TEXT,
    "transactionNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Purchase_totalAmount_check" CHECK ("totalAmount" >= 0)
);

-- CreateTable
CREATE TABLE "PurchaseItem" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "courseId" TEXT,
    "levelTestId" TEXT,
    "productName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "durationDays" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY ("id"),
    -- "at most one" because product FKs are SET NULL on product delete (history is kept
    -- via the snapshot columns); the application always sets exactly one.
    CONSTRAINT "PurchaseItem_single_product_check" CHECK (num_nonnulls("courseId", "levelTestId") <= 1),
    CONSTRAINT "PurchaseItem_price_check" CHECK ("price" >= 0),
    CONSTRAINT "PurchaseItem_quantity_check" CHECK ("quantity" >= 1),
    CONSTRAINT "PurchaseItem_durationDays_check" CHECK ("durationDays" IS NULL OR "durationDays" > 0)
);

-- Backfill Purchase from legacy CourseEnrollment rows.
-- Duplicate / blank transaction numbers can't satisfy the new unique index, so only the
-- earliest row keeps the value.
INSERT INTO "Purchase" ("id", "userId", "orderNo", "status", "totalAmount", "currency", "paymentType", "transactionNo", "createdAt", "paidAt", "updatedAt")
SELECT
    ce."id",
    ce."userId",
    'LEGACY-' || ce."id",
    (CASE ce."status"::text
        WHEN 'APPROVED' THEN 'PAID'
        WHEN 'EXPIRED' THEN 'PAID'
        WHEN 'REJECTED' THEN 'FAILED'
        ELSE 'PENDING'
    END)::"PurchaseStatus",
    COALESCE(c."price", 0),
    'THB',
    NULLIF(ce."paymentType", ''),
    CASE
        WHEN NULLIF(btrim(ce."transactionNo"), '') IS NULL THEN NULL
        WHEN row_number() OVER (PARTITION BY btrim(ce."transactionNo") ORDER BY ce."createdAt", ce."id") = 1 THEN btrim(ce."transactionNo")
        ELSE NULL
    END,
    ce."createdAt",
    CASE WHEN ce."status"::text IN ('APPROVED', 'EXPIRED') THEN ce."updatedAt" END,
    ce."updatedAt"
FROM "CourseEnrollment" ce
JOIN "Course" c ON c."id" = ce."courseId";

-- Legacy price/name/duration were never snapshotted; use the course's current values.
INSERT INTO "PurchaseItem" ("id", "purchaseId", "courseId", "productName", "price", "durationDays", "quantity", "createdAt")
SELECT
    ce."id",
    ce."id",
    ce."courseId",
    c."title",
    COALESCE(c."price", 0),
    CASE WHEN COALESCE(c."perTime", 0) > 0 THEN c."perTime" * 30 END,
    1,
    ce."createdAt"
FROM "CourseEnrollment" ce
JOIN "Course" c ON c."id" = ce."courseId";

-- Turn CourseEnrollment into Enrollment (rename keeps ids and data).
ALTER TABLE "CourseEnrollment" RENAME TO "Enrollment";
ALTER TABLE "Enrollment" RENAME CONSTRAINT "CourseEnrollment_pkey" TO "Enrollment_pkey";
ALTER TABLE "Enrollment" RENAME CONSTRAINT "CourseEnrollment_userId_fkey" TO "Enrollment_userId_fkey";
ALTER TABLE "Enrollment" RENAME CONSTRAINT "CourseEnrollment_courseId_fkey" TO "Enrollment_courseId_fkey";
ALTER INDEX "CourseEnrollment_userId_courseId_key" RENAME TO "Enrollment_userId_courseId_key";

-- Unpaid requests are no longer enrollments; they survive as Purchases above.
DELETE FROM "Enrollment" WHERE "status"::text IN ('PENDING', 'REJECTED');

-- AlterEnum
CREATE TYPE "EnrollmentStatus_new" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');
ALTER TABLE "Enrollment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Enrollment" ALTER COLUMN "status" TYPE "EnrollmentStatus_new"
    USING (CASE "status"::text WHEN 'APPROVED' THEN 'ACTIVE' ELSE 'EXPIRED' END)::"EnrollmentStatus_new";
ALTER TYPE "EnrollmentStatus" RENAME TO "EnrollmentStatus_old";
ALTER TYPE "EnrollmentStatus_new" RENAME TO "EnrollmentStatus";
DROP TYPE "EnrollmentStatus_old";
ALTER TABLE "Enrollment" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "paymentType",
DROP COLUMN "transactionNo",
ALTER COLUMN "courseId" DROP NOT NULL,
ADD COLUMN "levelTestId" TEXT,
ADD COLUMN "startedAt" TIMESTAMP(3);

-- Approval time is the closest thing legacy rows have to an access start.
UPDATE "Enrollment" SET "startedAt" = "updatedAt";
ALTER TABLE "Enrollment" ALTER COLUMN "startedAt" SET NOT NULL,
ALTER COLUMN "startedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- Exactly one product per enrollment (FKs cascade, so this always holds).
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_single_product_check" CHECK (num_nonnulls("courseId", "levelTestId") = 1);

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_orderNo_key" ON "Purchase"("orderNo");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_transactionNo_key" ON "Purchase"("transactionNo");

-- CreateIndex
CREATE INDEX "Purchase_userId_createdAt_idx" ON "Purchase"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Purchase_status_createdAt_idx" ON "Purchase"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PurchaseItem_purchaseId_idx" ON "PurchaseItem"("purchaseId");

-- CreateIndex
CREATE INDEX "PurchaseItem_courseId_idx" ON "PurchaseItem"("courseId");

-- CreateIndex
CREATE INDEX "PurchaseItem_levelTestId_idx" ON "PurchaseItem"("levelTestId");

-- CreateIndex
CREATE INDEX "Enrollment_courseId_idx" ON "Enrollment"("courseId");

-- CreateIndex
CREATE INDEX "Enrollment_levelTestId_idx" ON "Enrollment"("levelTestId");

-- CreateIndex
CREATE INDEX "Enrollment_status_expiredAt_idx" ON "Enrollment"("status", "expiredAt");

-- CreateIndex
-- Per-product composite uniques: rows where the product column is NULL never conflict,
-- and Enrollment_single_product_check guarantees each row sets exactly one of them.
CREATE UNIQUE INDEX "Enrollment_userId_levelTestId_key" ON "Enrollment"("userId", "levelTestId");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_levelTestId_fkey" FOREIGN KEY ("levelTestId") REFERENCES "LevelTest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_levelTestId_fkey" FOREIGN KEY ("levelTestId") REFERENCES "LevelTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
