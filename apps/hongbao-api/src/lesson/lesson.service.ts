import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { successResponse } from '../utils/response';
import { withErrorHandling } from '../utils/withErrorHandling';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { FilterLessonDto } from './dto/filter-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import selectFromResponse from '@/utils/selectFromResponse';
import { map, omit } from 'lodash';

@Injectable()
export class LessonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLessonDto) {
    return withErrorHandling(async () => {
      const lesson = await this.prisma.lesson.create({
        data: {
          ...data,
        },
      });
      return successResponse({
        data: lesson,
      });
    });
  }

  async findAll(query: FilterLessonDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.lesson.findMany({
        where: {
          ...(query.courseId && { courseId: query?.courseId }),
        },
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          course: {
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
      const data = await this.prisma.lesson.findUnique({
        where: {
          id,
        },
      });
      return successResponse({
        data,
      });
    });
  }

  async update(id: string, data: UpdateLessonDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.lesson.update({
        where: { id },
        data: {
          ...data,
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async remove(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.lesson.delete({
        where: { id },
      });
      return successResponse({
        data: res,
      });
    });
  }
}
