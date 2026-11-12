import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { successResponse } from '../../utils/response';
import selectFromResponse from '../../utils/selectFromResponse';
import { withErrorHandling } from '../../utils/withErrorHandling';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    return withErrorHandling(async () => {
      const quiz = await this.prisma.quiz.findUniqueOrThrow({
        where: { id },
        select: {
          ...selectFromResponse(['id', 'title', 'description']),
          questions: {
            orderBy: { order: 'asc' },
            select: selectFromResponse([
              'id',
              'title',
              'explanation',
              'order',
              'type',
              'data',
              'sectionId',
            ]),
          },
        },
      });
      return successResponse({
        data: quiz,
      });
    });
  }
}
