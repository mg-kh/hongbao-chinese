/*
  Warnings:

  - You are about to alter the column `price` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `discount` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `userId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `SubLesson` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SubLesson` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Video` table. All the data in the column will be lost.
  - Made the column `userId` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_userId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubLesson" DROP CONSTRAINT "SubLesson_courseId_fkey";

-- DropForeignKey
ALTER TABLE "SubLesson" DROP CONSTRAINT "SubLesson_userId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_userId_fkey";

-- DropIndex
DROP INDEX "Video_subLessonId_key";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE INTEGER,
ALTER COLUMN "discount" SET DEFAULT 0,
ALTER COLUMN "discount" SET DATA TYPE INTEGER,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "SubLesson" DROP COLUMN "courseId",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Course_userId_idx" ON "Course"("userId");

-- CreateIndex
CREATE INDEX "Lesson_courseId_idx" ON "Lesson"("courseId");

-- CreateIndex
CREATE INDEX "SubLesson_lessonId_idx" ON "SubLesson"("lessonId");

-- CreateIndex
CREATE INDEX "Video_subLessonId_idx" ON "Video"("subLessonId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
