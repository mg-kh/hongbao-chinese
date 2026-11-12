import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { successResponse } from '../../utils/response';
import { withErrorHandling } from '../../utils/withErrorHandling';
import { UseClientCouponDto } from './dto/use-client-coupon.dto';

@Injectable()
export class ClientCouponService {
  constructor(private readonly prisma: PrismaService) {}

  async applyCoupon(data: UseClientCouponDto, userId: string) {
    return withErrorHandling(async () => {
      const { code, courseId } = data;

      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true },
      });
      if (!course) throw new BadRequestException('Course not found');

      const redemption = await this.prisma.$transaction(async (tx) => {
        const coupon = await tx.coupon.findUnique({
          where: { code },
          include: {
            courses: { select: { courseId: true } },
            _count: { select: { redemptions: { where: { userId } } } },
          },
        });
        if (!coupon) throw new BadRequestException('Invalid coupon code');

        const now = new Date();
        if (!coupon.isActive) {
          throw new BadRequestException('This coupon is no longer active');
        }
        if (coupon.startsAt && coupon.startsAt > now) {
          throw new BadRequestException('This coupon is not active yet');
        }
        if (coupon.expiresAt && coupon.expiresAt < now) {
          throw new BadRequestException('This coupon has expired');
        }
        if (
          coupon.courses.length > 0 &&
          !coupon.courses.some((c) => c.courseId === courseId)
        ) {
          throw new BadRequestException(
            'This coupon is not applicable to this course',
          );
        }
        if (
          coupon.perUserLimit != null &&
          coupon._count.redemptions >= coupon.perUserLimit
        ) {
          throw new BadRequestException(
            'You have already used this coupon the maximum number of times',
          );
        }

        const { count } = await tx.coupon.updateMany({
          where: {
            id: coupon.id,
            OR: [
              { usageLimit: null },
              { usedCount: { lt: coupon.usageLimit ?? 0 } },
            ],
          },
          data: { usedCount: { increment: 1 } },
        });
        if (count === 0) {
          throw new BadRequestException(
            'This coupon has reached its usage limit',
          );
        }

        const created = await tx.couponRedemption.create({
          data: {
            couponId: coupon.id,
            userId,
            courseId,
            discount: coupon.discountValue,
          },
        });

        return { redemption: created, coupon };
      });

      return successResponse({
        data: {
          redemptionId: redemption.redemption.id,
          couponId: redemption.coupon.id,
          code: redemption.coupon.code,
          discountType: redemption.coupon.discountType,
          discountValue: redemption.coupon.discountValue,
        },
      });
    });
  }

  async removeCoupon(data: UseClientCouponDto, userId: string) {
    return withErrorHandling(async () => {
      const { code, courseId } = data;

      await this.prisma.$transaction(async (tx) => {
        const redemption = await tx.couponRedemption.findFirst({
          where: { userId, courseId, coupon: { code } },
          orderBy: { createdAt: 'desc' },
        });
        if (!redemption) {
          throw new NotFoundException(
            'No applied coupon found for this course',
          );
        }

        await tx.couponRedemption.delete({ where: { id: redemption.id } });

        await tx.coupon.update({
          where: { id: redemption.couponId },
          data: { usedCount: { decrement: 1 } },
        });
      });

      return successResponse({ data: null, message: 'Coupon removed' });
    });
  }
}
