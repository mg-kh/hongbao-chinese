/*
  Warnings:

  - You are about to drop the `AttemptLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LessonProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizAttempt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReviewItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubLessonProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttemptLog" DROP CONSTRAINT "AttemptLog_quizAttemptId_fkey";

-- DropForeignKey
ALTER TABLE "AttemptLog" DROP CONSTRAINT "AttemptLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "CourseProgress" DROP CONSTRAINT "CourseProgress_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseProgress" DROP CONSTRAINT "CourseProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "LessonProgress" DROP CONSTRAINT "LessonProgress_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "LessonProgress" DROP CONSTRAINT "LessonProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReviewItem" DROP CONSTRAINT "ReviewItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubLessonProgress" DROP CONSTRAINT "SubLessonProgress_subLessonId_fkey";

-- DropForeignKey
ALTER TABLE "SubLessonProgress" DROP CONSTRAINT "SubLessonProgress_userId_fkey";

-- DropTable
DROP TABLE "AttemptLog";

-- DropTable
DROP TABLE "CourseProgress";

-- DropTable
DROP TABLE "LessonProgress";

-- DropTable
DROP TABLE "QuizAttempt";

-- DropTable
DROP TABLE "ReviewItem";

-- DropTable
DROP TABLE "SubLessonProgress";

-- DropEnum
DROP TYPE "ReviewEntityType";

-- DropEnum
DROP TYPE "ReviewItemStatus";

-- CreateTable
CREATE TABLE "LevelTest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER DEFAULT 0,
    "perTime" INTEGER DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LevelTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "type" "QuestionType" NOT NULL,
    "data" JSONB NOT NULL,
    "levelTestId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LevelTest_categoryId_idx" ON "LevelTest"("categoryId");

-- CreateIndex
CREATE INDEX "Test_levelTestId_idx" ON "Test"("levelTestId");

-- AddForeignKey
ALTER TABLE "LevelTest" ADD CONSTRAINT "LevelTest_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_levelTestId_fkey" FOREIGN KEY ("levelTestId") REFERENCES "LevelTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
