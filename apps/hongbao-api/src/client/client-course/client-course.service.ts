import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { map, sumBy } from 'lodash';
import { PrismaService } from '../../prisma/prisma.service';
import {
  enrollmentUniqueWhere,
  isEnrollmentActive,
} from '../../utils/enrollment';
import { successResponse } from '../../utils/response';
import selectFromResponse from '../../utils/selectFromResponse';
import { withErrorHandling } from '../../utils/withErrorHandling';

/** Sent in `errors.code` of the 403 from learn/course-detail. */
export type CourseAccessErrorCode =
  'ENROLLMENT_EXPIRED' | 'ENROLLMENT_PENDING' | 'NOT_ENROLLED';

const accessDenied = (
  code: CourseAccessErrorCode,
  message: string,
  expiredAt: Date | null = null,
) => new ForbiddenException({ message, errors: { code, expiredAt } });

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
    return withErrorHandling(async () =>
      successResponse({ data: await this.findCourseDetail(id) }),
    );
  }

  /**
   * Course detail for the learn pages. Paid courses need an APPROVED,
   * unexpired enrollment; otherwise a 403 with `errors.code` tells the
   * client why (expired / pending / never enrolled).
   */
  async getLearnCourseDetail(id: string, userId: string) {
    return withErrorHandling(async () => {
      const course = await this.prisma.course.findUnique({
        where: { id },
        select: { isFree: true },
      });
      if (!course) throw new NotFoundException('Course not found');

      if (!course.isFree) {
        const enrollment = await this.prisma.enrollment.findUnique({
          where: enrollmentUniqueWhere(userId, { courseId: id }),
          select: { status: true, expiredAt: true },
        });
        if (!enrollment) {
          throw accessDenied(
            'NOT_ENROLLED',
            'You are not enrolled in this course',
          );
        }
        if (enrollment.status === 'PENDING') {
          throw accessDenied(
            'ENROLLMENT_PENDING',
            'Your enrollment is waiting for approval',
          );
        }
        // isEnrollmentActive is a type guard, so read expiredAt before it narrows.
        const { expiredAt } = enrollment;
        if (!isEnrollmentActive(enrollment)) {
          throw accessDenied(
            'ENROLLMENT_EXPIRED',
            'Your access to this course has expired',
            expiredAt,
          );
        }
      }

      return successResponse({ data: await this.findCourseDetail(id) });
    });
  }

  private async findCourseDetail(id: string) {
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
    return data;
  }
}
