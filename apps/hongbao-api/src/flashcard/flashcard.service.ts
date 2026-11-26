import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { successResponse } from '../utils/response';
import { withErrorHandling } from '../utils/withErrorHandling';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { FilterFlashcardDto } from './dto/filter-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';

const flashcardInclude = {
  category: { select: { id: true, name: true } },
  _count: { select: { cards: true } },
} as const;

@Injectable()
export class FlashcardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFlashcardDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.flashcard.create({
        data,
        include: flashcardInclude,
      });
      return successResponse({ data: res });
    });
  }

  async findAll({ categoryId }: FilterFlashcardDto = {}) {
    return withErrorHandling(async () => {
      const res = await this.prisma.flashcard.findMany({
        where: categoryId ? { categoryId } : undefined,
        orderBy: { createdAt: 'desc' },
        include: flashcardInclude,
      });
      return successResponse({ data: res });
    });
  }

  async findOne(id: string) {
    return withErrorHandling(async () => {
      const flashcard = await this.prisma.flashcard.findUnique({
        where: { id },
        include: {
          ...flashcardInclude,
          cards: { orderBy: { createdAt: 'desc' } },
        },
      });
      if (!flashcard) throw new NotFoundException('Flashcard not found');
      return successResponse({ data: flashcard });
    });
  }

  async update(id: string, data: UpdateFlashcardDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.flashcard.update({
        where: { id },
        data,
        include: flashcardInclude,
      });
      return successResponse({ data: res });
    });
  }

  // Cards are detached (flashcardId -> NULL), not deleted.
  async remove(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.flashcard.delete({ where: { id } });
      return successResponse({ data: res });
    });
  }
}
