import { PrismaClient } from '@prisma/client';
import { COURSES, SAMPLE_VIDEO_URL } from './data/courses';
import { seedLessons } from './lesson';

/**
 * -----------------------
 * Courses
 * -----------------------
 * Seeds three real Mandarin Chinese courses, each with its lessons,
 * sub-lessons and videos.
 */
export async function seedCourses(prisma: PrismaClient, userId: string) {
  for (const data of COURSES) {
    const course = await prisma.course.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        includedAssets: data.includedAssets,
        isFree: data.isFree,
        price: data.isFree ? 0 : data.price,
        perTime: data.perTime,
        published: true,
      },
    });

    /**
     * Course intro / preview video
     */
    await prisma.video.create({
      data: {
        courseId: course.id,
        isIntroVideo: true,
        title: data.introVideoTitle,
        description: `Course preview for "${course.title}".`,
        url: SAMPLE_VIDEO_URL,
        duration: 120,
      },
    });

    await seedLessons(prisma, course.id, data.lessons);
  }
}
