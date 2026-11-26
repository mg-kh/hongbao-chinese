-- Flashcard decks become a purchasable shop product alongside courses and
-- mock tests (PurchaseItem / Enrollment gain a flashcardId product FK).

-- AlterTable
ALTER TABLE "PurchaseItem" ADD COLUMN "flashcardId" TEXT;

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN "flashcardId" TEXT;

-- Single-product checks now cover the flashcard FK too.
ALTER TABLE "PurchaseItem" DROP CONSTRAINT "PurchaseItem_single_product_check";
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_single_product_check" CHECK (num_nonnulls("courseId", "mockTestId", "flashcardId") <= 1);

ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_single_product_check";
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_single_product_check" CHECK (num_nonnulls("courseId", "mockTestId", "flashcardId") = 1);

-- CreateIndex
CREATE INDEX "PurchaseItem_flashcardId_idx" ON "PurchaseItem"("flashcardId");

-- CreateIndex
CREATE INDEX "Enrollment_flashcardId_idx" ON "Enrollment"("flashcardId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_flashcardId_key" ON "Enrollment"("userId", "flashcardId");

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
