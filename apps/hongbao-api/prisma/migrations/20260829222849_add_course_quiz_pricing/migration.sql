-- AlterTable
ALTER TABLE "Course" DROP COLUMN "discount";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "perTime" INTEGER DEFAULT 0,
ADD COLUMN     "price" INTEGER DEFAULT 0;
