-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "isLevelTest" BOOLEAN NOT NULL DEFAULT false;

-- Backfill quizzes already attached to a level test
UPDATE "Quiz" SET "isLevelTest" = true WHERE "id" IN (SELECT "quizId" FROM "LevelTestQuiz");
