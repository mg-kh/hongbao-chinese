import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { successResponse } from '../utils/response';
import { withErrorHandling } from '../utils/withErrorHandling';
import { CouponToCourseDto } from './dto/coupon-to-course.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCouponDto) {
    return withErrorHandling(async () => {
      const { courseIds, ...coupon } = data;
      const res = await this.prisma.coupon.create({
        data: {
          ...coupon,
          courses: {
            create: courseIds.map((courseId) => ({ courseId })),
          },
        },
        include: {
          courses: {
            select: { course: { select: { id: true, title: true } } },
          },
        },
      });
      return successResponse({ data: res });
    });
  }

  async findAll() {
    return withErrorHandling(async () => {
      const res = await this.prisma.coupon.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          courses: {
            select: { course: { select: { id: true, title: true } } },
          },
          _count: { select: { redemptions: true } },
        },
      });
      const data = res.map(({ courses, _count, ...coupon }) => ({
        ...coupon,
        courses: courses.map((c) => c.course),
        redemptionCount: _count.redemptions,
      }));
      return successResponse({ data });
    });
  }

  async findOne(id: string) {
    return withErrorHandling(async () => {
      const coupon = await this.prisma.coupon.findUnique({
        where: { id },
        include: {
          courses: {
            select: { course: { select: { id: true, title: true } } },
          },
          _count: { select: { redemptions: true } },
        },
      });
      if (!coupon) throw new NotFoundException('Coupon not found');

      const { courses, _count, ...rest } = coupon;
      return successResponse({
        data: {
          ...rest,
          courses: courses.map((c) => c.course),
          redemptionCount: _count.redemptions,
        },
      });
    });
  }

  async update(id: string, data: UpdateCouponDto) {
    return withErrorHandling(async () => {
      const { courseIds, ...coupon } = data;
      const res = await this.prisma.coupon.update({
        where: { id },
        data: {
          ...coupon,
          ...(courseIds && {
            courses: {
              deleteMany: {},
              create: courseIds.map((courseId) => ({ courseId })),
            },
          }),
        },
        include: {
          courses: {
            select: { course: { select: { id: true, title: true } } },
          },
        },
      });
      return successResponse({ data: res });
    });
  }

  async remove(id: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.coupon.delete({ where: { id } });
      return successResponse({ data: res });
    });
  }

  async addCourse(data: CouponToCourseDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.couponCourse.create({ data });
      return successResponse({ data: res });
    });
  }

  async removeCourse(data: CouponToCourseDto) {
    return withErrorHandling(async () => {
      const res = await this.prisma.couponCourse.delete({
        where: { couponId_courseId: data },
      });
      return successResponse({ data: res });
    });
  }
}
