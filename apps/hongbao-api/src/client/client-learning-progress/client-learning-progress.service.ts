import { Injectable } from '@nestjs/common';
import { ProgressEntityType, ProgressStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { successResponse } from '../../utils/response';
import selectFromResponse from '../../utils/selectFromResponse';
import { withErrorHandling } from '../../utils/withErrorHandling';

@Injectable()
export class ClientLearningProgressService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- video ----------

  async findVideo(id: string) {
    return withErrorHandling(async () => {
      const video = await this.prisma.video.findUniqueOrThrow({
        where: { id },
        select: selectFromResponse([
          'id',
          'title',
          'description',
          'url',
          'duration',
        ]),
      });
      return successResponse({ data: video });
    });
  }

  getCompletedVideos(userId: string) {
    return this.getCompleted(userId, ProgressEntityType.VIDEO);
  }

  async markVideoComplete(userId: string, videoId: string) {
    return withErrorHandling(async () => {
      await this.prisma.video.findUniqueOrThrow({ where: { id: videoId } });
      return this.markComplete(userId, ProgressEntityType.VIDEO, videoId);
    });
  }

  // ---------- quiz ----------

  async findQuiz(id: string) {
    return withErrorHandling(async () => {
      const quiz = await this.prisma.quiz.findUniqueOrThrow({
        where: { id },
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
      });
      return successResponse({ data: quiz });
    });
  }

  getCompletedQuizzes(userId: string) {
    return this.getCompleted(userId, ProgressEntityType.QUIZ);
  }

  async markQuizComplete(userId: string, quizId: string) {
    return withErrorHandling(async () => {
      await this.prisma.quiz.findUniqueOrThrow({ where: { id: quizId } });
      return this.markComplete(userId, ProgressEntityType.QUIZ, quizId);
    });
  }

  // ---------- shared ----------

  /** Every completed entity id of one type for the user, newest first. */
  private async getCompleted(userId: string, entityType: ProgressEntityType) {
    return withErrorHandling(async () => {
      const progresses = await this.prisma.userProgress.findMany({
        where: { userId, entityType, status: ProgressStatus.COMPLETED },
        orderBy: { completedAt: 'desc' },
        select: { entityId: true },
      });

      const ids = progresses.map((p) => p.entityId);

      return successResponse({ data: { ids, count: ids.length } });
    });
  }

  /** Upserts a COMPLETED progress row. Callers verify the entity exists. */
  private async markComplete(
    userId: string,
    entityType: ProgressEntityType,
    entityId: string,
  ) {
    const now = new Date();
    const progress = await this.prisma.userProgress.upsert({
      where: {
        userId_entityType_entityId: { userId, entityType, entityId },
      },
      create: {
        userId,
        entityType,
        entityId,
        status: ProgressStatus.COMPLETED,
        completedAt: now,
      },
      update: { status: ProgressStatus.COMPLETED, completedAt: now },
    });

    return successResponse({ data: progress });
  }
}
