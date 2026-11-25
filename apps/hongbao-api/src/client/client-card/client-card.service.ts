import { Injectable } from '@nestjs/common';
import type { FilterClientCardQuery } from '@repo/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { successResponse } from '../../utils/response';
import { withErrorHandling } from '../../utils/withErrorHandling';

@Injectable()
export class ClientCardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({ categoryId, flashcardId }: FilterClientCardQuery = {}) {
    return withErrorHandling(async () => {
      const res = await this.prisma.card.findMany({
        where: {
          ...(categoryId && { flashcard: { categoryId } }),
          ...(flashcardId && { flashcardId }),
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          cnWord: true,
          pinyin: true,
          type: true,
          meaningEn: true,
          meaningMm: true,
          exampleUsage: true,
          flashcard: {
            select: {
              id: true,
              name: true,
              category: { select: { id: true, name: true } },
            },
          },
        },
      });
      return successResponse({ data: res });
    });
  }
}
