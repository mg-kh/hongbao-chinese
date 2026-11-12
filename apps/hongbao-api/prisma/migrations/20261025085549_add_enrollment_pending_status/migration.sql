-- AlterEnum
-- Recreate the type instead of `ALTER TYPE ... ADD VALUE`: Prisma can apply consecutive
-- migrations in one transaction (e.g. on the shadow database), and Postgres can't use an
-- enum value added in the same transaction. Values of a newly created type are usable
-- immediately, so the next migration's `DEFAULT 'PENDING'` works.
CREATE TYPE "EnrollmentStatus_new" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'REVOKED');
ALTER TABLE "Enrollment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Enrollment" ALTER COLUMN "status" TYPE "EnrollmentStatus_new"
    USING ("status"::text)::"EnrollmentStatus_new";
ALTER TYPE "EnrollmentStatus" RENAME TO "EnrollmentStatus_old";
ALTER TYPE "EnrollmentStatus_new" RENAME TO "EnrollmentStatus";
DROP TYPE "EnrollmentStatus_old";
ALTER TABLE "Enrollment" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
