import { Injectable, NotFoundException } from '@nestjs/common';
import type { FilterFlashcardQuery } from '@repo/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { successResponse } from '../../utils/response';
import { withErrorHandling } from '../../utils/withErrorHandling';

const flashcardSelect = {
  id: true,
  name: true,
  price: true,
  createdAt: true,
  category: { select: { id: true, name: true } },
  _count: { select: { cards: true } },
} as const;

const cardSelect = {
  id: true,
  cnWord: true,
  pinyin: true,
  type: true,
  meaningEn: true,
  meaningMm: true,
  exampleUsage: true,
} as const;

@Injectable()
export class ClientFlashcardService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({ categoryId }: FilterFlashcardQuery = {}) {
    return withErrorHandling(async () => {
      const res = await this.prisma.flashcard.findMany({
        where: { published: true, ...(categoryId ? { categoryId } : {}) },
        orderBy: { createdAt: 'desc' },
        select: flashcardSelect,
      });
      const data = res.map(({ _count, ...flashcard }) => ({
        ...flashcard,
        cardCount: _count.cards,
      }));
      return successResponse({ data });
    });
  }

  async findOne(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.flashcard.findFirst({
        where: { id, published: true },
        select: {
          ...flashcardSelect,
          cards: { orderBy: { createdAt: 'desc' }, select: cardSelect },
        },
      });
      if (!res) throw new NotFoundException('Flashcard not found');
      const { _count, ...flashcard } = res;
      return successResponse({
        data: { ...flashcard, cardCount: _count.cards },
      });
    });
  }
}
