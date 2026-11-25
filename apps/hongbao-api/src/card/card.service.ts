import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { successResponse } from '../utils/response';
import { withErrorHandling } from '../utils/withErrorHandling';
import { CreateCardDto } from './dto/create-card.dto';
import { FilterCardDto } from './dto/filter-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

const cardInclude = {
  flashcard: {
    select: {
      id: true,
      name: true,
      category: { select: { id: true, name: true } },
    },
  },
} as const;

@Injectable()
export class CardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCardDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.card.create({
        data,
        include: cardInclude,
      });
      return successResponse({ data: res });
    });
  }

  async findAll({
    categoryId,
    flashcardId,
    page = 1,
    limit = 10,
  }: Partial<FilterCardDto> = {}) {
    return withErrorHandling(async () => {
      const skip = (page - 1) * limit;
      const where = {
        ...(categoryId && { flashcard: { categoryId } }),
        ...(flashcardId && { flashcardId }),
      };

      const [items, total] = await this.prisma.$transaction([
        this.prisma.card.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          include: cardInclude,
          skip,
          take: limit,
        }),
        this.prisma.card.count({ where }),
      ]);

      return successResponse({
        data: {
          items,
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      });
    });
  }

  async findOne(id: string) {
    return withErrorHandling(async () => {
      const card = await this.prisma.card.findUnique({
        where: { id },
        include: cardInclude,
      });
      if (!card) throw new NotFoundException('Card not found');
      return successResponse({ data: card });
    });
  }

  async update(id: string, data: UpdateCardDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.card.update({
        where: { id },
        data,
        include: cardInclude,
      });
      return successResponse({ data: res });
    });
  }

  async remove(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.card.delete({ where: { id } });
      return successResponse({ data: res });
    });
  }
}
