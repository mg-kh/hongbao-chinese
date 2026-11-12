import { Injectable } from '@nestjs/common';
import { map, omit } from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { successResponse } from '../utils/response';
import { withErrorHandling } from '../utils/withErrorHandling';
import selectFromResponse from '../utils/selectFromResponse';
import { CreateSubLessonDto } from './dto/create-sub_lesson.dto';
import { FilterSubLessonDto } from './dto/filter-sub_lesson.dto';
import { UpdateSubLessonDto } from './dto/update-sub_lesson.dto';

@Injectable()
export class SubLessonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSubLessonDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.subLesson.create({
        data: {
          ...data,
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async findAll(query: FilterSubLessonDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.subLesson.findMany({
        where: {
          ...(query.courseId && { lesson: { courseId: query?.courseId } }),
          ...(query.lessonId && { lessonId: query?.lessonId }),
        },
        include: {
          lesson: {
            select: {
              title: true,
            },
          },
          quizzes: {
            select: {
              quiz: {
                select: {
                  ...selectFromResponse(['id', 'title', 'description']),
                },
              },
            },
          },
          _count: {
            select: {
              quizzes: true,
            },
          },
        },
      });
      const data = map(res, (course) => ({
        ...omit(course, ['_count']),
        quizzes: map(course?.quizzes, (q) => q.quiz),
        quizzesCount: course?._count?.quizzes,
      }));
      return successResponse({
        data,
      });
    });
  }

  async findOne(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.subLesson.findUnique({
        where: { id },
        include: {
          lesson: {
            select: selectFromResponse(['courseId']),
          },
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async update(id: string, data: UpdateSubLessonDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.subLesson.update({
        where: { id },
        data,
      });
      return successResponse({
        data: res,
      });
    });
  }

  async remove(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.subLesson.delete({
        where: { id },
      });
      return successResponse({
        data: res,
      });
    });
  }
}
