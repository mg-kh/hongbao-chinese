import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from '../quiz/dto/create-quiz.dto';
import { UpdateQuizDto } from '../quiz/dto/update-quiz.dto';
import { successResponse } from '../utils/response';
import selectFromResponse from '../utils/selectFromResponse';
import { withErrorHandling } from '../utils/withErrorHandling';
import { CreateMockTestDto } from './dto/create-mock-test.dto';
import { UpdateMockTestDto } from './dto/update-mock-test.dto';

const categoryInclude = {
  category: { select: { id: true, name: true } },
} as const;

@Injectable()
export class MockTestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMockTestDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.mockTest.create({
        data,
        include: categoryInclude,
      });
      return successResponse({ data: res });
    });
  }

  async findAll(categoryId?: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.mockTest.findMany({
        where: categoryId ? { categoryId } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          ...categoryInclude,
          quiz: {
            include: {
              quiz: { include: { _count: { select: { questions: true } } } },
            },
          },
        },
      });
      const data = res.map(({ quiz, ...mockTest }) => ({
        ...mockTest,
        quizId: quiz?.quizId ?? null,
        testCount: quiz?.quiz._count.questions ?? 0,
      }));
      return successResponse({ data });
    });
  }

  async findOne(id: string) {
    return withErrorHandling(async () => {
      const mockTest = await this.prisma.mockTest.findUnique({
        where: { id },
        include: {
          ...categoryInclude,
          quiz: {
            include: {
              quiz: {
                include: { questions: { orderBy: { order: 'asc' } } },
              },
            },
          },
        },
      });
      if (!mockTest) throw new NotFoundException('Mock test not found');
      return successResponse({ data: mockTest });
    });
  }

  async update(id: string, data: UpdateMockTestDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.mockTest.update({
        where: { id },
        data,
        include: categoryInclude,
      });
      return successResponse({ data: res });
    });
  }

  async remove(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.mockTest.delete({ where: { id } });
      return successResponse({ data: res });
    });
  }

  async createQuiz(mockTestId: string, data: CreateQuizDto) {
    return withErrorHandling(async () => {
      const mockTest = await this.prisma.mockTest.findUnique({
        where: { id: mockTestId },
        select: { id: true },
      });
      if (!mockTest) throw new NotFoundException('Mock test not found');

      const quiz = await this.prisma.$transaction(async (tx) => {
        const createdQuiz = await tx.quiz.create({
          data: { ...data, isMockTest: true },
        });
        await tx.mockTestQuiz.create({
          data: { quizId: createdQuiz.id, mockTestId },
        });
        return createdQuiz;
      });

      return successResponse({ data: quiz });
    });
  }

  async getQuizzes(mockTestId: string) {
    return withErrorHandling(async () => {
      const mockTest = await this.prisma.mockTest.findUnique({
        where: { id: mockTestId },
        select: { id: true },
      });
      if (!mockTest) throw new NotFoundException('Mock test not found');

      const res = await this.prisma.mockTestQuiz.findMany({
        where: { mockTestId },
        include: {
          quiz: {
            include: {
              _count: { select: { questions: true } },
              sections: {
                orderBy: { order: 'asc' },
                select: {
                  ...selectFromResponse([
                    'id',
                    'title',
                    'description',
                    'timeLimit',
                    'audioUrl',
                  ]),
                  _count: { select: { questions: true } },
                },
              },
            },
          },
        },
      });
      const data = res.map(({ quiz: { _count, sections, ...quiz } }) => ({
        ...quiz,
        testCount: _count.questions,
        sections: sections.map(({ _count, ...section }) => ({
          ...section,
          questionCount: _count.questions,
        })),
      }));
      return successResponse({ data });
    });
  }

  private async assertQuizBelongsToMockTest(
    mockTestId: string,
    quizId: string,
  ) {
    const link = await this.prisma.mockTestQuiz.findUnique({
      where: { mockTestId_quizId: { mockTestId, quizId } },
    });
    if (!link)
      throw new NotFoundException('Quiz not found for this mock test');
  }

  async findOneQuiz(mockTestId: string, quizId: string) {
    return withErrorHandling(async () => {
      await this.assertQuizBelongsToMockTest(mockTestId, quizId);
      const quiz = await this.prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
          sections: {
            orderBy: { order: 'asc' },
            select: selectFromResponse([
              'id',
              'title',
              'timeLimit',
              'audioUrl',
            ]),
          },
          questions: { orderBy: { order: 'asc' } },
        },
      });
      return successResponse({ data: quiz });
    });
  }

  async updateQuiz(mockTestId: string, quizId: string, data: UpdateQuizDto) {
    return withErrorHandling(async () => {
      await this.assertQuizBelongsToMockTest(mockTestId, quizId);
      const quiz = await this.prisma.quiz.update({
        where: { id: quizId },
        data,
      });
      return successResponse({ data: quiz });
    });
  }

  async removeQuiz(mockTestId: string, quizId: string) {
    return withErrorHandling(async () => {
      await this.assertQuizBelongsToMockTest(mockTestId, quizId);
      const quiz = await this.prisma.quiz.delete({ where: { id: quizId } });
      return successResponse({ data: quiz });
    });
  }
}
