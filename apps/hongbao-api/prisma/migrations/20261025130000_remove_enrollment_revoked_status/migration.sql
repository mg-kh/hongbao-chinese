-- AlterEnum
-- Postgres can't drop an enum value, so the type is recreated.
-- REVOKED rows already had no access; EXPIRED keeps that.
CREATE TYPE "EnrollmentStatus_new" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED');
ALTER TABLE "Enrollment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Enrollment" ALTER COLUMN "status" TYPE "EnrollmentStatus_new"
    USING (CASE "status"::text WHEN 'REVOKED' THEN 'EXPIRED' ELSE "status"::text END)::"EnrollmentStatus_new";
ALTER TYPE "EnrollmentStatus" RENAME TO "EnrollmentStatus_old";
ALTER TYPE "EnrollmentStatus_new" RENAME TO "EnrollmentStatus";
DROP TYPE "EnrollmentStatus_old";
ALTER TABLE "Enrollment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
