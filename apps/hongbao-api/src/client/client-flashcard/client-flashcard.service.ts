import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { successResponse } from '../../utils/response';
import { withErrorHandling } from '../../utils/withErrorHandling';

@Injectable()
export class ClientFlashcardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(categoryId?: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.flashcard.findMany({
        where: categoryId ? { categoryId } : undefined,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          cnWord: true,
          pinyin: true,
          type: true,
          meaningEn: true,
          meaningMm: true,
          exampleUsage: true,
          category: { select: { id: true, name: true } },
        },
      });
      return successResponse({ data: res });
    });
  }
}
