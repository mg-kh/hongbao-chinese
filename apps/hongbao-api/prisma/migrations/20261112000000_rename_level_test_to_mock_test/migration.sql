-- Rename "LevelTest" -> "MockTest" (data-preserving renames only)

-- Tables
ALTER TABLE "LevelTest" RENAME TO "MockTest";
ALTER TABLE "LevelTestQuiz" RENAME TO "MockTestQuiz";

-- Columns
ALTER TABLE "MockTestQuiz" RENAME COLUMN "levelTestId" TO "mockTestId";
ALTER TABLE "PurchaseItem" RENAME COLUMN "levelTestId" TO "mockTestId";
ALTER TABLE "Enrollment" RENAME COLUMN "levelTestId" TO "mockTestId";
ALTER TABLE "Quiz" RENAME COLUMN "isLevelTest" TO "isMockTest";

-- Primary keys
ALTER TABLE "MockTest" RENAME CONSTRAINT "LevelTest_pkey" TO "MockTest_pkey";
ALTER TABLE "MockTestQuiz" RENAME CONSTRAINT "LevelTestQuiz_pkey" TO "MockTestQuiz_pkey";

-- Foreign keys
ALTER TABLE "MockTest" RENAME CONSTRAINT "LevelTest_categoryId_fkey" TO "MockTest_categoryId_fkey";
ALTER TABLE "MockTestQuiz" RENAME CONSTRAINT "LevelTestQuiz_quizId_fkey" TO "MockTestQuiz_quizId_fkey";
ALTER TABLE "MockTestQuiz" RENAME CONSTRAINT "LevelTestQuiz_levelTestId_fkey" TO "MockTestQuiz_mockTestId_fkey";
ALTER TABLE "PurchaseItem" RENAME CONSTRAINT "PurchaseItem_levelTestId_fkey" TO "PurchaseItem_mockTestId_fkey";
ALTER TABLE "Enrollment" RENAME CONSTRAINT "Enrollment_levelTestId_fkey" TO "Enrollment_mockTestId_fkey";

-- Indexes
ALTER INDEX "LevelTest_categoryId_idx" RENAME TO "MockTest_categoryId_idx";
ALTER INDEX "LevelTestQuiz_quizId_key" RENAME TO "MockTestQuiz_quizId_key";
ALTER INDEX "LevelTestQuiz_levelTestId_key" RENAME TO "MockTestQuiz_mockTestId_key";
ALTER INDEX "PurchaseItem_levelTestId_idx" RENAME TO "PurchaseItem_mockTestId_idx";
ALTER INDEX "Enrollment_levelTestId_idx" RENAME TO "Enrollment_mockTestId_idx";
ALTER INDEX "Enrollment_userId_levelTestId_key" RENAME TO "Enrollment_userId_mockTestId_key";
