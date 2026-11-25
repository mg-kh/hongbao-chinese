import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { type EnrollmentStatus, type OrderStatus } from '@repo/shared';
import {
  activeEnrollmentWhere,
  isEnrollmentActive,
} from '../../utils/enrollment';
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
      flashcard: { select: { id: true, name: true } },
    },
  },
} satisfies Prisma.PurchaseInclude;

const enrollmentInclude = {
  course: { select: { id: true, title: true, perTime: true } },
  mockTest: { select: { id: true, title: true, perTime: true } },
  flashcard: { select: { id: true, name: true } },
} satisfies Prisma.EnrollmentInclude;

type ShopProduct = {
  title: string;
  price: number | null;
  perTime: number | null;
};

const productLabel: Record<CheckoutProductType, string> = {
  [ProductType.COURSE]: 'Course',
  [ProductType.MOCK_TEST]: 'Mock test',
  [ProductType.FLASHCARD]: 'Flashcard',
};

type CheckoutProductType =
  CreateClientPurchaseDto['items'][number]['productType'];

@Injectable()
export class ClientPurchaseService {
  constructor(private readonly prisma: PrismaService) {}

  async createPurchase(data: CreateClientPurchaseDto, userId: string) {
    return withErrorHandling(async () => {
      const { items, paymentType, transactionNo, totalAmount } = data;

      const purchaseItems: Prisma.PurchaseItemCreateManyPurchaseInput[] = [];

      for (const { productType, productId } of items) {
        const product = await this.findPublishedProduct(productType, productId);
        if (!product) {
          throw new NotFoundException(
            `${productLabel[productType]} ${productId} not found`,
          );
        }

        const productWhere = {
          [ProductType.COURSE]: { courseId: productId },
          [ProductType.MOCK_TEST]: { mockTestId: productId },
          [ProductType.FLASHCARD]: { flashcardId: productId },
        }[productType];

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
      data: items.map(({ courseId, mockTestId, flashcardId }) => ({
        userId,
        orderNo,
        courseId,
        mockTestId,
        flashcardId,
      })),
      skipDuplicates: true,
    });
  }

  private async findPublishedProduct(
    productType: CheckoutProductType,
    id: string,
  ): Promise<ShopProduct | null> {
    const where = { id, published: true };
    switch (productType) {
      case ProductType.COURSE:
        return this.prisma.course.findFirst({ where });
      case ProductType.MOCK_TEST:
        return this.prisma.mockTest.findFirst({ where });
      case ProductType.FLASHCARD: {
        // Decks have no access period: lifetime access.
        const flashcard = await this.prisma.flashcard.findFirst({ where });
        return flashcard
          ? { title: flashcard.name, price: flashcard.price, perTime: null }
          : null;
      }
      default:
        return null;
    }
  }

  async getMyPurchases(query: FilterClientPurchaseDto, userId: string) {
    return withErrorHandling(async () => {
      const { page, limit, status, start_date, end_date } = query;

      // An approved order is "active" while an active enrollment still points
      // at it. Renewals overwrite Enrollment.orderNo, so an order whose access
      // ran out (or was superseded by a renewal) counts as expired.
      const activeEnrollments = await this.prisma.enrollment.findMany({
        where: { userId, ...activeEnrollmentWhere() },
        select: { orderNo: true },
        distinct: ['orderNo'],
      });
      const activeOrderNos = activeEnrollments.map((e) => e.orderNo);

      const statusWhere: Record<OrderStatus, Prisma.PurchaseWhereInput> = {
        PENDING: { status: 'PENDING' },
        APPROVED: { status: 'APPROVED', orderNo: { in: activeOrderNos } },
        EXPIRED: { status: 'APPROVED', orderNo: { notIn: activeOrderNos } },
        CANCELLED: { status: 'CANCELLED' },
      };

      // User + date range. The status filter is layered on top, so the
      // per-status counts don't depend on the selected tab.
      const baseWhere: Prisma.PurchaseWhereInput = {
        userId,
        ...((start_date || end_date) && {
          createdAt: {
            ...(start_date && {
              gte: new Date(`${start_date}T00:00:00.000Z`),
            }),
            ...(end_date && {
              lte: new Date(`${end_date}T23:59:59.999Z`),
            }),
          },
        }),
      };
      const withStatus = (s: OrderStatus): Prisma.PurchaseWhereInput => ({
        AND: [baseWhere, statusWhere[s]],
      });
      const where = status ? withStatus(status) : baseWhere;

      const [items, total, all, pending, approved, expired, cancelled] =
        await this.prisma.$transaction([
          this.prisma.purchase.findMany({
            where,
            include: purchaseInclude,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
          }),
          this.prisma.purchase.count({ where }),
          this.prisma.purchase.count({ where: baseWhere }),
          this.prisma.purchase.count({ where: withStatus('PENDING') }),
          this.prisma.purchase.count({ where: withStatus('APPROVED') }),
          this.prisma.purchase.count({ where: withStatus('EXPIRED') }),
          this.prisma.purchase.count({ where: withStatus('CANCELLED') }),
        ]);

      const activeSet = new Set(activeOrderNos);
      const toOrderStatus = (p: (typeof items)[number]): OrderStatus => {
        if (p.status !== 'APPROVED') return p.status;
        return activeSet.has(p.orderNo) ? 'APPROVED' : 'EXPIRED';
      };

      return successResponse({
        data: {
          items: items.map((p) => ({ ...p, orderStatus: toOrderStatus(p) })),
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
          counts: {
            ALL: all,
            PENDING: pending,
            APPROVED: approved,
            EXPIRED: expired,
            CANCELLED: cancelled,
          },
        },
      });
    });
  }

  async getMyEnrollments(query: FilterClientEnrollmentDto, userId: string) {
    return withErrorHandling(async () => {
      const { page, limit, type, status } = query;
      const now = new Date();

      // EXPIRED is never written by a job: an enrollment stays APPROVED and
      // only its expiredAt passes, so the buckets are derived from both.
      const statusWhere: Record<EnrollmentStatus, Prisma.EnrollmentWhereInput> =
        {
          PENDING: { status: 'PENDING' },
          APPROVED: activeEnrollmentWhere(now),
          EXPIRED: {
            OR: [
              { status: 'EXPIRED' },
              { status: 'APPROVED', expiredAt: { lte: now } },
            ],
          },
        };

      // User + product type. The status filter is layered on top, so the
      // per-status counts don't depend on the selected tab.
      const baseWhere: Prisma.EnrollmentWhereInput = {
        userId,
        ...(type === ProductType.COURSE && { courseId: { not: null } }),
        ...(type === ProductType.MOCK_TEST && { mockTestId: { not: null } }),
        ...(type === ProductType.FLASHCARD && { flashcardId: { not: null } }),
      };
      const withStatus = (
        s: EnrollmentStatus,
      ): Prisma.EnrollmentWhereInput => ({
        AND: [baseWhere, statusWhere[s]],
      });
      const where = status ? withStatus(status) : baseWhere;

      const [items, total, all, pending, approved, expired] =
        await this.prisma.$transaction([
          this.prisma.enrollment.findMany({
            where,
            include: enrollmentInclude,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
          }),
          this.prisma.enrollment.count({ where }),
          this.prisma.enrollment.count({ where: baseWhere }),
          this.prisma.enrollment.count({ where: withStatus('PENDING') }),
          this.prisma.enrollment.count({ where: withStatus('APPROVED') }),
          this.prisma.enrollment.count({ where: withStatus('EXPIRED') }),
        ]);

      return successResponse({
        data: {
          items: items.map((enrollment) => ({
            ...enrollment,
            hasAccess: isEnrollmentActive(enrollment, now),
          })),
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
          counts: {
            ALL: all,
            PENDING: pending,
            APPROVED: approved,
            EXPIRED: expired,
          },
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
