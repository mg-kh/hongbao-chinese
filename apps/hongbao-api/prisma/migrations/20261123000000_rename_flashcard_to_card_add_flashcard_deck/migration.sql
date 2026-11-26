-- The old "Flashcard" table (single word cards) becomes "Card", keeping all
-- existing rows. A new "Flashcard" table is a deck that groups cards
-- (Flashcard 1 -> N Card).

-- Rename Flashcard -> Card
ALTER TABLE "Flashcard" RENAME TO "Card";
ALTER TABLE "Card" RENAME CONSTRAINT "Flashcard_pkey" TO "Card_pkey";
ALTER TABLE "Card" RENAME CONSTRAINT "Flashcard_categoryId_fkey" TO "Card_categoryId_fkey";
ALTER INDEX "Flashcard_categoryId_idx" RENAME TO "Card_categoryId_idx";

-- AlterTable
ALTER TABLE "Card" ADD COLUMN "flashcardId" TEXT;

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Flashcard_categoryId_idx" ON "Flashcard"("categoryId");

-- CreateIndex
CREATE INDEX "Card_flashcardId_idx" ON "Card"("flashcardId");

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE SET NULL ON UPDATE CASCADE;
