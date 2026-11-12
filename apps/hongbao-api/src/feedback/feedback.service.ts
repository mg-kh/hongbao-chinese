import { PrismaService } from '@/prisma/prisma.service';
import { successResponse } from '@/utils/response';
import { withErrorHandling } from '@/utils/withErrorHandling';
import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  create(createFeedbackDto: CreateFeedbackDto) {
    return 'This action adds a new feedback';
  }

  async findAll() {
    return withErrorHandling(async () => {
      const res = await this.prisma.feedback.findMany({
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      });
      return successResponse({
        data: res,
      });
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
}
