import selectFromResponse from '@/utils/selectFromResponse';
import { Injectable } from '@nestjs/common';
import { map, omit } from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { successResponse } from '../utils/response';
import { withErrorHandling } from '../utils/withErrorHandling';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCourseDto, userId: string) {
    return withErrorHandling(async () => {
      const course = await this.prisma.course.create({
        data: {
          ...data,
          userId,
        },
      });
      return successResponse({
        data: course,
      });
    });
  }

  async findAll() {
    return withErrorHandling(async () => {
      const res = await this.prisma.course.findMany({
        include: {
          category: {
            select: { id: true, name: true },
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
        orderBy: {
          createdAt: 'desc',
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
      const data = await this.prisma.course.findUnique({
        where: {
          id,
        },
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      });
      return successResponse({
        data,
      });
    });
  }

  async update(id: string, data: UpdateCourseDto, userId: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.course.update({
        where: { id },
        data: {
          ...data,
          userId,
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async remove(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.course.delete({
        where: { id },
      });
      return successResponse({
        data: res,
      });
    });
  }
}
