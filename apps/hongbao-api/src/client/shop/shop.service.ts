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

const flashcardSelect = {
  id: true,
  name: true,
  price: true,
  createdAt: true,
  category: categorySelect,
  _count: { select: { cards: true } },
} satisfies Prisma.FlashcardSelect;

type ShopCourse = Prisma.CourseGetPayload<{ select: typeof courseSelect }>;
type ShopMockTest = Prisma.MockTestGetPayload<{
  select: typeof mockTestSelect;
}>;
type ShopFlashcard = Prisma.FlashcardGetPayload<{
  select: typeof flashcardSelect;
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
      const includes = (t: ProductType) =>
        type === ProductType.ALL || type === t;

      const [courses, mockTests, flashcards] = await Promise.all([
        includes(ProductType.COURSE)
          ? this.prisma.course.findMany({ where, select: courseSelect })
          : Promise.resolve<ShopCourse[]>([]),
        includes(ProductType.MOCK_TEST)
          ? this.prisma.mockTest.findMany({ where, select: mockTestSelect })
          : Promise.resolve<ShopMockTest[]>([]),
        includes(ProductType.FLASHCARD)
          ? this.prisma.flashcard.findMany({ where, select: flashcardSelect })
          : Promise.resolve<ShopFlashcard[]>([]),
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
        // Decks have no description or access period: sold for lifetime access.
        ...flashcards.map(({ name, _count, ...flashcard }) => ({
          ...flashcard,
          title: name,
          description: null,
          perTime: 0,
          type: ProductType.FLASHCARD,
          cardCount: _count.cards,
        })),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return successResponse({ data });
    });
  }

  async getProductOverview() {
    return withErrorHandling(async () => {
      const where = { published: true };

      const [courseCount, mockTestCount, flashcardCount] = await Promise.all([
        this.prisma.course.count({ where }),
        this.prisma.mockTest.count({ where }),
        this.prisma.flashcard.count({ where }),
      ]);

      return successResponse({
        data: {
          productCount: courseCount + mockTestCount + flashcardCount,
          courseCount,
          mockTestCount,
          flashcardCount,
        },
      });
    });
  }
}
