/*
  Warnings:

  - Added the required column `courseId` to the `SubLesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubLesson" ADD COLUMN     "courseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SubLesson" ADD CONSTRAINT "SubLesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
