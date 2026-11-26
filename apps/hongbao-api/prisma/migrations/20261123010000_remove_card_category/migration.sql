-- Cards no longer belong to a category directly; they get it via their
-- flashcard (Category -> Flashcard -> Card). Existing card categories are dropped.

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_categoryId_fkey";

-- DropIndex
DROP INDEX "Card_categoryId_idx";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "categoryId";
