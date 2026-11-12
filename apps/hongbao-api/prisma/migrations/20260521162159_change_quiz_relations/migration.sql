/*
  Warnings:

  - You are about to drop the column `courseId` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `subLessonId` on the `Quiz` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "QuizType" AS ENUM ('COURSE', 'LESSON', 'SUB_LESSON');

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_subLessonId_fkey";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "courseId",
DROP COLUMN "lessonId",
DROP COLUMN "subLessonId";

-- CreateTable
CREATE TABLE "CourseQuiz" (
    "quizId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "CourseQuiz_pkey" PRIMARY KEY ("quizId","courseId")
);

-- CreateTable
CREATE TABLE "LessonQuiz" (
    "quizId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "LessonQuiz_pkey" PRIMARY KEY ("quizId","lessonId")
);

-- CreateTable
CREATE TABLE "SubLessonQuiz" (
    "quizId" TEXT NOT NULL,
    "subLessonId" TEXT NOT NULL,

    CONSTRAINT "SubLessonQuiz_pkey" PRIMARY KEY ("quizId","subLessonId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseQuiz_quizId_key" ON "CourseQuiz"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseQuiz_courseId_key" ON "CourseQuiz"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonQuiz_quizId_key" ON "LessonQuiz"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonQuiz_lessonId_key" ON "LessonQuiz"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "SubLessonQuiz_quizId_key" ON "SubLessonQuiz"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "SubLessonQuiz_subLessonId_key" ON "SubLessonQuiz"("subLessonId");

-- AddForeignKey
ALTER TABLE "CourseQuiz" ADD CONSTRAINT "CourseQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseQuiz" ADD CONSTRAINT "CourseQuiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonQuiz" ADD CONSTRAINT "LessonQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonQuiz" ADD CONSTRAINT "LessonQuiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubLessonQuiz" ADD CONSTRAINT "SubLessonQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubLessonQuiz" ADD CONSTRAINT "SubLessonQuiz_subLessonId_fkey" FOREIGN KEY ("subLessonId") REFERENCES "SubLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
