/*
  Warnings:

  - You are about to drop the `GrammarCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VocabularyCard` table. If the table is not empty, all the data it contains will be lost.
  - The values [VOCABULARY_CARD,GRAMMAR_CARD] on the enum `ProgressEntityType` will be removed. If these variants are still used in the database, this will fail.
  - The values [VOCABULARY_CARD,GRAMMAR_CARD] on the enum `ReviewEntityType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProgressEntityType_new" AS ENUM ('COURSE', 'LESSON', 'SUB_LESSON', 'VIDEO', 'QUIZ', 'QUESTION', 'FLASHCARD');
ALTER TABLE "UserProgress" ALTER COLUMN "entityType" TYPE "ProgressEntityType_new" USING ("entityType"::text::"ProgressEntityType_new");
ALTER TYPE "ProgressEntityType" RENAME TO "ProgressEntityType_old";
ALTER TYPE "ProgressEntityType_new" RENAME TO "ProgressEntityType";
DROP TYPE "public"."ProgressEntityType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ReviewEntityType_new" AS ENUM ('QUESTION', 'FLASHCARD');
ALTER TABLE "AttemptLog" ALTER COLUMN "entityType" TYPE "ReviewEntityType_new" USING ("entityType"::text::"ReviewEntityType_new");
ALTER TABLE "ReviewItem" ALTER COLUMN "entityType" TYPE "ReviewEntityType_new" USING ("entityType"::text::"ReviewEntityType_new");
ALTER TYPE "ReviewEntityType" RENAME TO "ReviewEntityType_old";
ALTER TYPE "ReviewEntityType_new" RENAME TO "ReviewEntityType";
DROP TYPE "public"."ReviewEntityType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "GrammarCard" DROP CONSTRAINT "GrammarCard_subLessonId_fkey";

-- DropForeignKey
ALTER TABLE "GrammarCard" DROP CONSTRAINT "GrammarCard_userId_fkey";

-- DropForeignKey
ALTER TABLE "VocabularyCard" DROP CONSTRAINT "VocabularyCard_subLessonId_fkey";

-- DropForeignKey
ALTER TABLE "VocabularyCard" DROP CONSTRAINT "VocabularyCard_userId_fkey";

-- DropTable
DROP TABLE "GrammarCard";

-- DropTable
DROP TABLE "VocabularyCard";
