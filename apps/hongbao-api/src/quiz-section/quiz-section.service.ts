import { PrismaService } from '@/prisma/prisma.service';
import { successResponse } from '@/utils/response';
import { withErrorHandling } from '@/utils/withErrorHandling';
import { Injectable } from '@nestjs/common';
import { CreateQuizSectionDto } from './dto/create-quiz-section.dto';
import { UpdateQuizSectionDto } from './dto/update-quiz-section.dto';

@Injectable()
export class QuizSectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateQuizSectionDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.quizSection.create({
        data: data,
      });

      return successResponse({
        data: res,
      });
    });
  }

  async findOne(quizId: string, sectionId: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.quizSection.findUnique({
        where: {
          id: sectionId,
          quizId,
        },
      });
      return successResponse({
        data: res,
      });
    });
  }

  async update(quizId: string, sectionId: string, data: UpdateQuizSectionDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.quizSection.update({
        where: {
          id: sectionId,
          quizId,
        },
        data,
      });
      return successResponse({
        data: res,
      });
    });
  }

  async remove(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.quizSection.delete({
        where: {
          id,
        },
      });
      return successResponse({
        data: res,
      });
    });
  }
}
