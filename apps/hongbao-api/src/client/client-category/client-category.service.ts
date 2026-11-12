import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { successResponse } from '../../utils/response';
import { withErrorHandling } from '../../utils/withErrorHandling';

@Injectable()
export class ClientCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return withErrorHandling(async () => {
      const res = await this.prisma.category.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          _count: { select: { courses: true, flashcards: true } },
        },
      });
      const data = res.map(({ _count, ...category }) => ({
        ...category,
        courseCount: _count.courses,
        flashcardCount: _count.flashcards,
      }));
      return successResponse({ data });
    });
  }
}
