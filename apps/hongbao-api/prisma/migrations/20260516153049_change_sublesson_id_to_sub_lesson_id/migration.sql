/*
  Warnings:

  - You are about to drop the column `sublessonId` on the `Quiz` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_sublessonId_fkey";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "sublessonId",
ADD COLUMN     "subLessonId" TEXT;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_subLessonId_fkey" FOREIGN KEY ("subLessonId") REFERENCES "SubLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
