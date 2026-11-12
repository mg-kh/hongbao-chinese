import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { successResponse } from '../utils/response';
import { withErrorHandling } from '../utils/withErrorHandling';
import selectFromResponse from '../utils/selectFromResponse';
import { CreateVideoDto } from './dto/create-video.dto';
import { FilterVideoDto } from './dto/filter-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';

@Injectable()
export class VideoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVideoDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.video.create({
        data: {
          ...data,
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async findAll(query: FilterVideoDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.video.findMany({
        where: {
          ...(query.courseId && {
            subLesson: {
              lesson: {
                courseId: query.courseId,
              },
            },
          }),
          ...(query.lessonId && {
            subLesson: {
              lessonId: query.lessonId,
            },
          }),
          ...(query.subLessonId && {
            subLessonId: query.subLessonId,
          }),
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async findOne(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.video.findUnique({
        where: { id },
        include: {
          subLesson: {
            select: {
              ...selectFromResponse(['lessonId']),
              lesson: {
                select: selectFromResponse(['courseId']),
              },
            },
          },
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async update(id: string, data: UpdateVideoDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.video.update({
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
      const res = await this.prisma.video.delete({
        where: { id },
      });
      return successResponse({
        data: res,
      });
    });
  }
}
