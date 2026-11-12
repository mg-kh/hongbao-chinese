/*
  Warnings:

  - Added the required column `expiredAt` to the `CourseEnrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseEnrollment" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "expiredAt" TIMESTAMP(3) NOT NULL;
