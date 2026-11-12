/*
  Warnings:

  - Made the column `updatedAt` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Lesson` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Question` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Quiz` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `SubLesson` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "SubLesson" ALTER COLUMN "updatedAt" SET NOT NULL;
