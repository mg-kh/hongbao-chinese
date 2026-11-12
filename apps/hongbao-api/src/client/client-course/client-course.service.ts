import { Injectable } from '@nestjs/common';
import { map, sumBy } from 'lodash';
import { PrismaService } from '../../prisma/prisma.service';
import { successResponse } from '../../utils/response';
import selectFromResponse from '../../utils/selectFromResponse';
import { withErrorHandling } from '../../utils/withErrorHandling';

@Injectable()
export class ClientCourseService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCourses() {
    return withErrorHandling(async () => {
      const res = await this.prisma.course.findMany({
        where: {
          published: true,
        },
        select: {
          ...selectFromResponse([
            'id',
            'title',
            'description',
            'includedAssets',
            'isFree',
            'price',
            'perTime',
          ]),
          category: {
            select: { id: true, name: true },
          },
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async getCourseDetail(id: string) {
    return withErrorHandling(async () => {
      const quizSelect = {
        select: {
          quiz: {
            select: selectFromResponse(['id', 'title']),
          },
        },
      };
      const course = await this.prisma.course.findUnique({
        where: {
          id,
        },
        select: {
          ...selectFromResponse([
            'id',
            'title',
            'description',
            'includedAssets',
            'isFree',
            'price',
            'perTime',
          ]),
          category: {
            select: { id: true, name: true },
          },
          lessons: {
            select: {
              ...selectFromResponse(['id', 'title', 'description']),
              subLessons: {
                select: {
                  ...selectFromResponse(['id', 'title', 'description']),
                  quizzes: quizSelect,
                  videos: {
                    where: {
                      isIntroVideo: false,
                    },
                    select: selectFromResponse([
                      'id',
                      'title',
                      'description',
                      'url',
                    ]),
                  },
                },
              },
              quizzes: quizSelect,
            },
          },
          quizzes: quizSelect,
          videos: {
            where: { isIntroVideo: true },
            select: selectFromResponse([
              'id',
              'title',
              'description',
              'url',
              'duration',
            ]),
          },
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      });
      const videoCount =
        (course?.videos.length ?? 0) +
        sumBy(course?.lessons, (lesson) =>
          sumBy(lesson.subLessons, (subLesson) => subLesson.videos.length),
        );
      const lessonCount = course?._count.lessons ?? 0;
      const data = {
        ...course,
        quizzes: map(course?.quizzes, 'quiz'),
        lessons: map(course?.lessons, (lesson) => ({
          ...lesson,
          quizzes: map(lesson.quizzes, 'quiz'),
          subLessons: map(lesson.subLessons, (subLesson) => ({
            ...subLesson,
            quizzes: map(subLesson.quizzes, 'quiz'),
          })),
        })),
        videoCount,
        lessonCount,
      };
      return successResponse({
        data,
      });
    });
  }
}
