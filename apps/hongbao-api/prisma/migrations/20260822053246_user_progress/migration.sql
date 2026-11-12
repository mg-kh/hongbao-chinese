-- CreateEnum
CREATE TYPE "ProgressEntityType" AS ENUM ('COURSE', 'LESSON', 'SUB_LESSON', 'VIDEO', 'QUIZ', 'QUESTION', 'VOCABULARY_CARD', 'GRAMMAR_CARD');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ReviewEntityType" AS ENUM ('QUESTION', 'VOCABULARY_CARD', 'GRAMMAR_CARD');

-- CreateEnum
CREATE TYPE "ReviewItemStatus" AS ENUM ('NEEDS_REVIEW', 'MASTERED');

-- CreateTable
CREATE TABLE "VocabularyCard" (
    "id" TEXT NOT NULL,
    "subLessonId" TEXT,
    "userId" TEXT NOT NULL,
    "hanzi" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "exampleSentence" TEXT,
    "exampleTranslation" TEXT,
    "audioUrl" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VocabularyCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrammarCard" (
    "id" TEXT NOT NULL,
    "subLessonId" TEXT,
    "userId" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "exampleSentence" TEXT,
    "exampleTranslation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrammarCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityType" "ProgressEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttemptLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizAttemptId" TEXT,
    "entityType" "ReviewEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "answer" JSONB,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttemptLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityType" "ReviewEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "status" "ReviewItemStatus" NOT NULL DEFAULT 'NEEDS_REVIEW',
    "wrongCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastWrongAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "ReviewItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VocabularyCard_subLessonId_idx" ON "VocabularyCard"("subLessonId");

-- CreateIndex
CREATE INDEX "GrammarCard_subLessonId_idx" ON "GrammarCard"("subLessonId");

-- CreateIndex
CREATE INDEX "UserProgress_userId_status_idx" ON "UserProgress"("userId", "status");

-- CreateIndex
CREATE INDEX "UserProgress_entityType_entityId_idx" ON "UserProgress"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_entityType_entityId_key" ON "UserProgress"("userId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "AttemptLog_userId_entityType_entityId_idx" ON "AttemptLog"("userId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "AttemptLog_entityType_entityId_isCorrect_idx" ON "AttemptLog"("entityType", "entityId", "isCorrect");

-- CreateIndex
CREATE INDEX "ReviewItem_userId_status_idx" ON "ReviewItem"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewItem_userId_entityType_entityId_key" ON "ReviewItem"("userId", "entityType", "entityId");

-- AddForeignKey
ALTER TABLE "VocabularyCard" ADD CONSTRAINT "VocabularyCard_subLessonId_fkey" FOREIGN KEY ("subLessonId") REFERENCES "SubLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyCard" ADD CONSTRAINT "VocabularyCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrammarCard" ADD CONSTRAINT "GrammarCard_subLessonId_fkey" FOREIGN KEY ("subLessonId") REFERENCES "SubLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrammarCard" ADD CONSTRAINT "GrammarCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptLog" ADD CONSTRAINT "AttemptLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptLog" ADD CONSTRAINT "AttemptLog_quizAttemptId_fkey" FOREIGN KEY ("quizAttemptId") REFERENCES "QuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewItem" ADD CONSTRAINT "ReviewItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
