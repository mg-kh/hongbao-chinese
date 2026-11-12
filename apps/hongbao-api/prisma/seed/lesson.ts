import { PrismaClient } from '@prisma/client';
import { SeedLesson } from './data/courses';
import { seedSubLessons } from './sub_lesson';

/**
 * -----------------------
 * Lessons
 * -----------------------
 */
export async function seedLessons(
  prisma: PrismaClient,
  courseId: string,
  lessons: SeedLesson[],
) {
  for (const data of lessons) {
    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title: data.title,
        description: data.description,
      },
    });

    await seedSubLessons(prisma, lesson.id, data.subLessons);
  }
}
