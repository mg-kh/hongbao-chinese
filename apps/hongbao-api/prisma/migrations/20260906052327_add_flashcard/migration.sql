-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "cnWord" TEXT NOT NULL,
    "pinyin" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "meaningEn" TEXT NOT NULL,
    "meaningMm" TEXT NOT NULL,
    "exampleUsage" TEXT[],
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Flashcard_categoryId_idx" ON "Flashcard"("categoryId");

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
