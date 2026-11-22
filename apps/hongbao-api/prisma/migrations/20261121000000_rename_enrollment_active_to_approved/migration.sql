-- AlterEnum
-- Align enrollment status with the client (PENDING / APPROVED / EXPIRED).
-- RENAME VALUE keeps existing ACTIVE rows, now APPROVED.
ALTER TYPE "EnrollmentStatus" RENAME VALUE 'ACTIVE' TO 'APPROVED';
