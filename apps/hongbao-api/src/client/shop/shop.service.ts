import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { successResponse } from '../../utils/response';
import { withErrorHandling } from '../../utils/withErrorHandling';
import { FilterShopDto, ProductType } from './dto/filter-shop.dto';

const categorySelect = { select: { id: true, name: true } } as const;

const courseSelect = {
  id: true,
  title: true,
  description: true,
  includedAssets: true,
  isFree: true,
  price: true,
  perTime: true,
  createdAt: true,
  category: categorySelect,
} satisfies Prisma.CourseSelect;

const mockTestSelect = {
  id: true,
  title: true,
  description: true,
  price: true,
  perTime: true,
  createdAt: true,
  category: categorySelect,
  quiz: {
    select: {
      quiz: { select: { _count: { select: { questions: true } } } },
    },
  },
} satisfies Prisma.MockTestSelect;

type ShopCourse = Prisma.CourseGetPayload<{ select: typeof courseSelect }>;
type ShopMockTest = Prisma.MockTestGetPayload<{
  select: typeof mockTestSelect;
}>;

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts({ type, categoryId }: FilterShopDto) {
    return withErrorHandling(async () => {
      const where = {
        published: true,
        ...(categoryId ? { categoryId } : {}),
      };
      const includeCourses = type !== ProductType.MOCK_TEST;
      const includeMockTests = type !== ProductType.COURSE;

      const [courses, mockTests] = await Promise.all([
        includeCourses
          ? this.prisma.course.findMany({ where, select: courseSelect })
          : Promise.resolve<ShopCourse[]>([]),
        includeMockTests
          ? this.prisma.mockTest.findMany({ where, select: mockTestSelect })
          : Promise.resolve<ShopMockTest[]>([]),
      ]);

      const data = [
        ...courses.map((course) => ({
          ...course,
          type: ProductType.COURSE,
        })),
        ...mockTests.map(({ quiz, ...mockTest }) => ({
          ...mockTest,
          type: ProductType.MOCK_TEST,
          testCount: quiz?.quiz._count.questions ?? 0,
        })),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return successResponse({ data });
    });
  }

  async getProductOverview() {
    return withErrorHandling(async () => {
      const where = { published: true };

      const [courseCount, mockTestCount] = await Promise.all([
        this.prisma.course.count({ where }),
        this.prisma.mockTest.count({ where }),
      ]);

      return successResponse({
        data: {
          productCount: courseCount + mockTestCount,
          courseCount,
          mockTestCount,
        },
      });
    });
  }
}
