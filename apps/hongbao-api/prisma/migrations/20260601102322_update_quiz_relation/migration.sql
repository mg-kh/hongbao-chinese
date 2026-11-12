/*
  Warnings:

  - The primary key for the `CourseQuiz` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LessonQuiz` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SubLessonQuiz` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CourseQuiz" DROP CONSTRAINT "CourseQuiz_pkey",
ADD CONSTRAINT "CourseQuiz_pkey" PRIMARY KEY ("courseId", "quizId");

-- AlterTable
ALTER TABLE "LessonQuiz" DROP CONSTRAINT "LessonQuiz_pkey",
ADD CONSTRAINT "LessonQuiz_pkey" PRIMARY KEY ("lessonId", "quizId");

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SubLessonQuiz" DROP CONSTRAINT "SubLessonQuiz_pkey",
ADD CONSTRAINT "SubLessonQuiz_pkey" PRIMARY KEY ("subLessonId", "quizId");
