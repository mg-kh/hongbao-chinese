import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { successResponse } from '../utils/response';
import { withErrorHandling } from '../utils/withErrorHandling';
import { CreateQuestionDto } from './dto/create-question.dto';
import { FilterQuestionDto } from './dto/filter-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
// import selectFromResponse from '@/utils/selectFromResponse';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateQuestionDto, userId: string) {
    return withErrorHandling(async () => {
      const { sectionId, quizId, ...rest } = data;
      const res = await this.prisma.question.create({
        data: {
          ...rest,
          ...(sectionId && { sectionId }),
          ...(quizId && { quizId }),
          userId,
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async findAll(query: FilterQuestionDto) {
    return withErrorHandling(async () => {
      const data = await this.prisma.question.findMany({
        where: {
          OR: [
            { quizId: query.quizzId },
            { section: { quizId: query.quizzId } },
          ],
          ...(query.sectionId && { sectionId: query.sectionId }),
        },
        // select: {
        //   ...selectFromResponse(['id', 'title', 'type', 'data']),
        // },
      });
      return successResponse({
        data,
      });
    });
  }

  async findOne(id: string) {
    return withErrorHandling(async () => {
      const data = await this.prisma.question.findUnique({
        where: {
          id,
        },
      });
      return successResponse({
        data,
      });
    });
  }

  async update(id: string, data: UpdateQuestionDto, userId: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.question.update({
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
      const res = await this.prisma.question.delete({
        where: { id },
      });
      return successResponse({
        data: res,
      });
    });
  }
}
