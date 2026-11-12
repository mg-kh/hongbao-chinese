import { Injectable } from '@nestjs/common';
import { ProgressEntityType, ProgressStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { successResponse } from '../../utils/response';
import selectFromResponse from '../../utils/selectFromResponse';
import { withErrorHandling } from '../../utils/withErrorHandling';

@Injectable()
export class VideoService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
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
      return successResponse({
        data: video,
      });
    });
  }

  async getCompleted(userId: string) {
    return withErrorHandling(async () => {
      const progresses = await this.prisma.userProgress.findMany({
        where: {
          userId,
          entityType: ProgressEntityType.VIDEO,
          status: ProgressStatus.COMPLETED,
        },
        orderBy: { completedAt: 'desc' },
        select: { entityId: true },
      });

      const ids = progresses.map((p) => p.entityId);

      return successResponse({
        data: { ids, count: ids.length },
      });
    });
  }

  async markComplete(userId: string, videoId: string) {
    return withErrorHandling(async () => {
      await this.prisma.video.findUniqueOrThrow({ where: { id: videoId } });

      const progress = await this.prisma.userProgress.upsert({
        where: {
          userId_entityType_entityId: {
            userId,
            entityType: ProgressEntityType.VIDEO,
            entityId: videoId,
          },
        },
        create: {
          userId,
          entityType: ProgressEntityType.VIDEO,
          entityId: videoId,
          status: ProgressStatus.COMPLETED,
          completedAt: new Date(),
        },
        update: {
          status: ProgressStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      return successResponse({
        data: progress,
      });
    });
  }
}
