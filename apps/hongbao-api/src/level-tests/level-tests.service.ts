import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from '../quiz/dto/create-quiz.dto';
import { UpdateQuizDto } from '../quiz/dto/update-quiz.dto';
import { successResponse } from '../utils/response';
import selectFromResponse from '../utils/selectFromResponse';
import { withErrorHandling } from '../utils/withErrorHandling';
import { CreateLevelTestDto } from './dto/create-level-test.dto';
import { UpdateLevelTestDto } from './dto/update-level-test.dto';

const categoryInclude = {
  category: { select: { id: true, name: true } },
} as const;

@Injectable()
export class LevelTestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLevelTestDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.levelTest.create({
        data,
        include: categoryInclude,
      });
      return successResponse({ data: res });
    });
  }

  async findAll(categoryId?: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.levelTest.findMany({
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
      const data = res.map(({ quiz, ...levelTest }) => ({
        ...levelTest,
        quizId: quiz?.quizId ?? null,
        testCount: quiz?.quiz._count.questions ?? 0,
      }));
      return successResponse({ data });
    });
  }

  async findOne(id: string) {
    return withErrorHandling(async () => {
      const levelTest = await this.prisma.levelTest.findUnique({
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
      if (!levelTest) throw new NotFoundException('Level test not found');
      return successResponse({ data: levelTest });
    });
  }

  async update(id: string, data: UpdateLevelTestDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.levelTest.update({
        where: { id },
        data,
        include: categoryInclude,
      });
      return successResponse({ data: res });
    });
  }

  async remove(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.levelTest.delete({ where: { id } });
      return successResponse({ data: res });
    });
  }

  async createQuiz(levelTestId: string, data: CreateQuizDto) {
    return withErrorHandling(async () => {
      const levelTest = await this.prisma.levelTest.findUnique({
        where: { id: levelTestId },
        select: { id: true },
      });
      if (!levelTest) throw new NotFoundException('Level test not found');

      const quiz = await this.prisma.$transaction(async (tx) => {
        const createdQuiz = await tx.quiz.create({
          data: { ...data, isLevelTest: true },
        });
        await tx.levelTestQuiz.create({
          data: { quizId: createdQuiz.id, levelTestId },
        });
        return createdQuiz;
      });

      return successResponse({ data: quiz });
    });
  }

  async getQuizzes(levelTestId: string) {
    return withErrorHandling(async () => {
      const levelTest = await this.prisma.levelTest.findUnique({
        where: { id: levelTestId },
        select: { id: true },
      });
      if (!levelTest) throw new NotFoundException('Level test not found');

      const res = await this.prisma.levelTestQuiz.findMany({
        where: { levelTestId },
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

  private async assertQuizBelongsToLevelTest(
    levelTestId: string,
    quizId: string,
  ) {
    const link = await this.prisma.levelTestQuiz.findUnique({
      where: { levelTestId_quizId: { levelTestId, quizId } },
    });
    if (!link)
      throw new NotFoundException('Quiz not found for this level test');
  }

  async findOneQuiz(levelTestId: string, quizId: string) {
    return withErrorHandling(async () => {
      await this.assertQuizBelongsToLevelTest(levelTestId, quizId);
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

  async updateQuiz(levelTestId: string, quizId: string, data: UpdateQuizDto) {
    return withErrorHandling(async () => {
      await this.assertQuizBelongsToLevelTest(levelTestId, quizId);
      const quiz = await this.prisma.quiz.update({
        where: { id: quizId },
        data,
      });
      return successResponse({ data: quiz });
    });
  }

  async removeQuiz(levelTestId: string, quizId: string) {
    return withErrorHandling(async () => {
      await this.assertQuizBelongsToLevelTest(levelTestId, quizId);
      const quiz = await this.prisma.quiz.delete({ where: { id: quizId } });
      return successResponse({ data: quiz });
    });
  }
}
