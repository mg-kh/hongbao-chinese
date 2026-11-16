import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { successResponse } from '../../utils/response';
import selectFromResponse from '../../utils/selectFromResponse';
import { withErrorHandling } from '../../utils/withErrorHandling';

@Injectable()
export class ClientMockTestService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMockTests(categoryId?: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.mockTest.findMany({
        where: {
          published: true,
          ...(categoryId ? { categoryId } : {}),
        },
        orderBy: { createdAt: 'desc' },
        select: {
          ...selectFromResponse([
            'id',
            'title',
            'description',
            'price',
            'perTime',
          ]),
          category: { select: { id: true, name: true } },
          quiz: {
            select: {
              quiz: { select: { _count: { select: { questions: true } } } },
            },
          },
        },
      });
      const data = res.map(({ quiz, ...mockTest }) => ({
        ...mockTest,
        testCount: quiz?.quiz._count.questions ?? 0,
      }));
      return successResponse({ data });
    });
  }

  async getMockTestDetail(id: string) {
    return withErrorHandling(async () => {
      const mockTest = await this.prisma.mockTest.findFirst({
        where: { id, published: true },
        select: {
          ...selectFromResponse([
            'id',
            'title',
            'description',
            'price',
            'perTime',
          ]),
          category: { select: { id: true, name: true } },
          quiz: {
            select: {
              quiz: {
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
              },
            },
          },
        },
      });
      if (!mockTest) throw new NotFoundException('Mock test not found');

      const { quiz, ...rest } = mockTest;
      const data = { ...rest, quiz: quiz?.quiz ?? null };
      return successResponse({ data });
    });
  }
}
