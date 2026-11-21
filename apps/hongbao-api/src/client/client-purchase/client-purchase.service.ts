import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { isEnrollmentActive } from '../../utils/enrollment';
import { generateOrderNo, perTimeToDurationDays } from '../../utils/purchase';
import { successResponse } from '../../utils/response';
import { withErrorHandling } from '../../utils/withErrorHandling';
import { ProductType } from '../shop/dto/filter-shop.dto';
import { CreateClientPurchaseDto } from './dto/create-client-purchase.dto';
import { FilterClientEnrollmentDto } from './dto/filter-client-enrollment.dto';
import { FilterClientPurchaseDto } from './dto/filter-client-purchase.dto';

const purchaseInclude = {
  items: {
    include: {
      course: { select: { id: true, title: true } },
      mockTest: { select: { id: true, title: true } },
    },
  },
} satisfies Prisma.PurchaseInclude;

const enrollmentInclude = {
  course: { select: { id: true, title: true, perTime: true } },
  mockTest: { select: { id: true, title: true, perTime: true } },
} satisfies Prisma.EnrollmentInclude;

@Injectable()
export class ClientPurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  async createPurchase(data: CreateClientPurchaseDto, userId: string) {
    return withErrorHandling(async () => {
      const { items, paymentType, transactionNo, totalAmount } = data;

      const purchaseItems: Prisma.PurchaseItemCreateManyPurchaseInput[] = [];

      for (const { productType, productId } of items) {
        const isCourse = productType === ProductType.COURSE;

        const product = await this.findPublishedProduct(productType, productId);
        if (!product) {
          throw new NotFoundException(
            `${isCourse ? 'Course' : 'Mock test'} ${productId} not found`,
          );
        }

        const productWhere = isCourse
          ? { courseId: productId }
          : { mockTestId: productId };

        // Name/price/duration are snapshotted.
        const price = product.price ?? 0;
        purchaseItems.push({
          ...productWhere,
          productName: product.title,
          price,
          durationDays: perTimeToDurationDays(product.perTime),
        });
      }
      // Access is only granted once an admin confirms the payment
      // (PurchasesService.confirmPurchase).
      const res = await this.prisma.$transaction(async (tx) => {
        const purchase = await tx.purchase.create({
          data: {
            userId,
            orderNo: generateOrderNo(),
            totalAmount,
            paymentType,
            transactionNo,
          },
        });

        await this.addPurchaseItems(tx, purchase.id, purchaseItems);
        await this.addPendingEnrollments(
          tx,
          userId,
          purchase.orderNo,
          purchaseItems,
        );

        return tx.purchase.findUniqueOrThrow({
          where: { id: purchase.id },
          include: purchaseInclude,
        });
      });

      return successResponse({ data: res });
    });
  }

  private addPurchaseItems(
    tx: Prisma.TransactionClient,
    purchaseId: string,
    items: Prisma.PurchaseItemCreateManyPurchaseInput[],
  ) {
    return tx.purchaseItem.createMany({
      data: items.map((item) => ({ ...item, purchaseId })),
    });
  }

  // PENDING until confirmPurchase activates it. skipDuplicates leaves existing
  // enrollments (e.g. an APPROVED one being renewed) untouched.
  private addPendingEnrollments(
    tx: Prisma.TransactionClient,
    userId: string,
    orderNo: string,
    items: Prisma.PurchaseItemCreateManyPurchaseInput[],
  ) {
    return tx.enrollment.createMany({
      data: items.map(({ courseId, mockTestId }) => ({
        userId,
        orderNo,
        courseId,
        mockTestId,
      })),
      skipDuplicates: true,
    });
  }

  private findPublishedProduct(
    productType: CreateClientPurchaseDto['items'][number]['productType'],
    id: string,
  ) {
    const where = { id, published: true };
    switch (productType) {
      case ProductType.COURSE:
        return this.prisma.course.findFirst({ where });
      case ProductType.MOCK_TEST:
        return this.prisma.mockTest.findFirst({ where });
      default:
        return null;
    }
  }

  async getMyPurchases(query: FilterClientPurchaseDto, userId: string) {
    return withErrorHandling(async () => {
      const { page, limit, status } = query;
      const where: Prisma.PurchaseWhereInput = {
        userId,
        ...(status && { status }),
      };

      const [items, total] = await this.prisma.$transaction([
        this.prisma.purchase.findMany({
          where,
          include: purchaseInclude,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.purchase.count({ where }),
      ]);

      return successResponse({
        data: {
          items,
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      });
    });
  }

  async getMyEnrollments(query: FilterClientEnrollmentDto, userId: string) {
    return withErrorHandling(async () => {
      const { page, limit, type, status } = query;
      const where: Prisma.EnrollmentWhereInput = {
        userId,
        ...(status && { status }),
        ...(type === ProductType.COURSE && { courseId: { not: null } }),
        ...(type === ProductType.MOCK_TEST && { mockTestId: { not: null } }),
      };

      const [items, total] = await this.prisma.$transaction([
        this.prisma.enrollment.findMany({
          where,
          include: enrollmentInclude,
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.enrollment.count({ where }),
      ]);

      return successResponse({
        data: {
          items: items.map((enrollment) => ({
            ...enrollment,
            hasAccess: isEnrollmentActive(enrollment),
          })),
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      });
    });
  }

  async getPurchaseDetail(id: string, userId: string) {
    return withErrorHandling(async () => {
      const res = await this.prisma.purchase.findFirst({
        where: { id, userId },
        include: purchaseInclude,
      });
      if (!res) {
        throw new NotFoundException('Purchase not found');
      }

      return successResponse({ data: res });
    });
  }
}
