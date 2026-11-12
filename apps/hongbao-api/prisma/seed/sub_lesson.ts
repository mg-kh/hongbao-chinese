import { PrismaClient } from '@prisma/client';
import { SeedSubLesson } from './data/courses';
import { seedVideos } from './video';

/**
 * -----------------------
 * Sub Lessons
 * -----------------------
 */
export async function seedSubLessons(
  prisma: PrismaClient,
  lessonId: string,
  subLessons: SeedSubLesson[],
) {
  for (const data of subLessons) {
    const subLesson = await prisma.subLesson.create({
      data: {
        lessonId,
        title: data.title,
        description: data.description,
      },
    });

    await seedVideos(prisma, subLesson.id, subLesson.title);
  }
}
