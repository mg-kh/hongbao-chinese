import { PrismaService } from '@/prisma/prisma.service';
import { successResponse } from '@/utils/response';
import { withErrorHandling } from '@/utils/withErrorHandling';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BulkCreateFeedbackDto } from './dto/bulk-create-feedback.dto';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFeedbackDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.feedback.create({ data });
      return successResponse({ data: res });
    });
  }

  /** All-or-nothing: one bad row rejects the whole batch. */
  async bulkCreate({ feedbacks }: BulkCreateFeedbackDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.feedback.createMany({ data: feedbacks });
      return successResponse({ data: { count: res.count } });
    });
  }

  async findAll() {
    return withErrorHandling(async () => {
      const res = await this.prisma.feedback.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return successResponse({ data: res });
    });
  }

  async findOne(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.feedback.findUnique({ where: { id } });
      if (!res) throw new NotFoundException('Feedback not found');
      return successResponse({ data: res });
    });
  }

  async update(id: string, data: UpdateFeedbackDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.feedback.update({ where: { id }, data });
      return successResponse({ data: res });
    });
  }

  async remove(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.feedback.delete({ where: { id } });
      return successResponse({ data: res });
    });
  }
}
