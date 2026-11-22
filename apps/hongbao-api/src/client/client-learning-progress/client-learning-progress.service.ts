import { Injectable } from '@nestjs/common';
import { ProgressEntityType, ProgressStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { successResponse } from '../../utils/response';
import selectFromResponse from '../../utils/selectFromResponse';
import { withErrorHandling } from '../../utils/withErrorHandling';

@Injectable()
export class ClientLearningProgressService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- activity ----------

  /**
   * Completion timestamps from the last `days` days (any entity type), used
   * for the profile's daily streak calendar. Raw timestamps rather than
   * server-bucketed dates, so the client can group them in the user's own
   * timezone.
   *
   * With `year`, returns that calendar year instead of the last `days` days.
   * The range is padded by a day on each side because the client buckets by
   * its local timezone, which can shift a UTC timestamp across Jan 1; the
   * client drops anything outside the year itself.
   */
  async getActivity(userId: string, days: number, year?: number) {
    return withErrorHandling(async () => {
      const DAY_MS = 24 * 60 * 60 * 1000;
      let completedAt: { gte: Date; lt?: Date };

      if (
        year !== undefined &&
        Number.isInteger(year) &&
        year >= 2000 &&
        year <= 9999
      ) {
        completedAt = {
          gte: new Date(Date.UTC(year, 0, 1) - DAY_MS),
          lt: new Date(Date.UTC(year + 1, 0, 1) + DAY_MS),
        };
      } else {
        const span = Number.isFinite(days)
          ? Math.min(Math.max(Math.floor(days), 1), 366)
          : 120;
        completedAt = { gte: new Date(Date.now() - span * DAY_MS) };
      }

      const completed = { userId, status: ProgressStatus.COMPLETED };

      // The earliest completion ever lets the client know how far back the
      // year switcher should go - an account can hold records from before
      // its own createdAt (imports, seeded data).
      const [rows, first] = await Promise.all([
        this.prisma.userProgress.findMany({
          where: { ...completed, completedAt },
          orderBy: { completedAt: 'desc' },
          select: { completedAt: true },
        }),
        this.prisma.userProgress.findFirst({
          where: { ...completed, completedAt: { not: null } },
          orderBy: { completedAt: 'asc' },
          select: { completedAt: true },
        }),
      ]);

      const timestamps = rows
        .map((r) => r.completedAt?.toISOString())
        .filter((d): d is string => !!d);

      return successResponse({
        data: {
          completedAt: timestamps,
          firstCompletedAt: first?.completedAt?.toISOString() ?? null,
        },
      });
    });
  }

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
