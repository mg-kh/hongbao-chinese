import { PrismaClient } from '@prisma/client';
import { SAMPLE_VIDEO_URL } from './data/courses';

/**
 * -----------------------
 * Sub Lesson Videos
 * -----------------------
 * Each sub-lesson gets two short lesson videos. They all point at a public
 * sample clip so the player has real media to load.
 */
export async function seedVideos(
  prisma: PrismaClient,
  subLessonId: string,
  subLessonTitle: string,
) {
  await prisma.video.createMany({
    data: [
      {
        subLessonId,
        title: `${subLessonTitle} – Explanation`,
        description: `Walkthrough of the key points in "${subLessonTitle}".`,
        url: SAMPLE_VIDEO_URL,
        duration: 240,
      },
      {
        subLessonId,
        title: `${subLessonTitle} – Practice`,
        description: `Guided practice and examples for "${subLessonTitle}".`,
        url: SAMPLE_VIDEO_URL,
        duration: 180,
      },
    ],
  });
}
