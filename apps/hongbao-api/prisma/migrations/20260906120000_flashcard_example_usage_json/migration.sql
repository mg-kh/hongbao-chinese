/*
  Warnings:

  - The `exampleUsage` column on the `Flashcard` table would be changed from `TEXT[]` to `JSONB`.
    Existing values are dropped; `exampleUsage` now stores an array of
    `{ pinyin, chinese, meaningEn, meaningMm }` objects.

*/
-- AlterTable
ALTER TABLE "Flashcard" DROP COLUMN "exampleUsage",
ADD COLUMN     "exampleUsage" JSONB NOT NULL DEFAULT '[]';
