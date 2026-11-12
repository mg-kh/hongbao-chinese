/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_levelTestId_fkey";

-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "LevelTestQuiz" (
    "quizId" TEXT NOT NULL,
    "levelTestId" TEXT NOT NULL,

    CONSTRAINT "LevelTestQuiz_pkey" PRIMARY KEY ("levelTestId","quizId")
);

-- CreateIndex
CREATE UNIQUE INDEX "LevelTestQuiz_quizId_key" ON "LevelTestQuiz"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "LevelTestQuiz_levelTestId_key" ON "LevelTestQuiz"("levelTestId");

-- AddForeignKey
ALTER TABLE "LevelTestQuiz" ADD CONSTRAINT "LevelTestQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LevelTestQuiz" ADD CONSTRAINT "LevelTestQuiz_levelTestId_fkey" FOREIGN KEY ("levelTestId") REFERENCES "LevelTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
