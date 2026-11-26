import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { successResponse } from '../../utils/response';
import { withErrorHandling } from '../../utils/withErrorHandling';

@Injectable()
export class ClientFeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return withErrorHandling(async () => {
      const res = await this.prisma.feedback.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          position: true,
          content: true,
          rating: true,
        },
      });
      return successResponse({ data: res });
    });
  }
}
