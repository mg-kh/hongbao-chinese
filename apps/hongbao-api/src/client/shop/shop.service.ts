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

const levelTestSelect = {
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
} satisfies Prisma.LevelTestSelect;

type ShopCourse = Prisma.CourseGetPayload<{ select: typeof courseSelect }>;
type ShopLevelTest = Prisma.LevelTestGetPayload<{
  select: typeof levelTestSelect;
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
      const includeCourses = type !== ProductType.LEVEL_TEST;
      const includeLevelTests = type !== ProductType.COURSE;

      const [courses, levelTests] = await Promise.all([
        includeCourses
          ? this.prisma.course.findMany({ where, select: courseSelect })
          : Promise.resolve<ShopCourse[]>([]),
        includeLevelTests
          ? this.prisma.levelTest.findMany({ where, select: levelTestSelect })
          : Promise.resolve<ShopLevelTest[]>([]),
      ]);

      const data = [
        ...courses.map((course) => ({
          ...course,
          type: ProductType.COURSE,
        })),
        ...levelTests.map(({ quiz, ...levelTest }) => ({
          ...levelTest,
          type: ProductType.LEVEL_TEST,
          testCount: quiz?.quiz._count.questions ?? 0,
        })),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return successResponse({ data });
    });
  }

  async getProductOverview() {
    return withErrorHandling(async () => {
      const where = { published: true };

      const [courseCount, levelTestCount] = await Promise.all([
        this.prisma.course.count({ where }),
        this.prisma.levelTest.count({ where }),
      ]);

      return successResponse({
        data: {
          productCount: courseCount + levelTestCount,
          courseCount,
          levelTestCount,
        },
      });
    });
  }
}
