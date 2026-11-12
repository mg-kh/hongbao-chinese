/*
  Warnings:

  - Added the required column `paymentType` to the `CourseEnrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionNo` to the `CourseEnrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseEnrollment" ADD COLUMN     "paymentType" TEXT NOT NULL,
ADD COLUMN     "transactionNo" TEXT NOT NULL;
