import { successResponse } from '@/utils/response';
import selectFromResponse from '@/utils/selectFromResponse';
import {
  EnrollmentProduct,
  enrollmentUniqueWhere,
  isEnrollmentActive,
} from '@/utils/enrollment';
import { withErrorHandling } from '@/utils/withErrorHandling';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PurchaseItem, PurchaseStatus } from '@prisma/client';
import { addDays } from 'date-fns';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseApproveDto } from './dto/purchase-approve.dto';
import { PurchasePaginationDto } from './dto/purchase-pagination.dto';
import { PurchaseRejectDto } from './dto/purchase-reject.dto';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getPurchaseList() {
    const counts = await this.prisma.purchase.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    });

    const approvedCount =
      counts.find((item) => item.status === 'APPROVED')?._count._all ?? 0;
    const pendingCount =
      counts.find((item) => item.status === 'PENDING')?._count._all ?? 0;
    // Admin rejections are stored as CANCELLED (see purchaseReject).
    const rejectedCount =
      counts.find((item) => item.status === 'CANCELLED')?._count._all ?? 0;

    return successResponse({
      data: {
        approvedCount,
        pendingCount,
        rejectedCount,
      },
    });
  }

  async getAllPendingApprovedCourse(query: PurchasePaginationDto) {
    return this.getPurchasesByStatus('PENDING', query);
  }

  async getAllApprovedCourse(query: PurchasePaginationDto) {
    return this.getPurchasesByStatus('APPROVED', query);
  }

  async getAllRejectedPurchases(query: PurchasePaginationDto) {
    return this.getPurchasesByStatus('CANCELLED', query);
  }

  /** One purchase with everything the dashboard detail page shows. */
  async getPurchaseDetail(id: string) {
    return withErrorHandling(async () => {
      const purchase = await this.prisma.purchase.findUnique({
        where: { id },
        include: {
          user: {
            select: selectFromResponse(['id', 'name', 'email', 'imageUrl']),
          },
          items: {
            include: {
              course: { select: selectFromResponse(['id', 'title']) },
              mockTest: { select: selectFromResponse(['id', 'title']) },
              flashcard: { select: selectFromResponse(['id', 'name']) },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      if (!purchase) {
        throw new NotFoundException('Purchase not found');
      }

      return successResponse({
        data: purchase,
      });
    });
  }

  async purchaseApprove(data: PurchaseApproveDto) {
    return withErrorHandling(async () => {
      const { purchase, granted } = await this.confirmPurchase(data.purchaseId);

      if (granted) {
        try {
          const names = purchase.items.map((item) => item.productName);
          await this.notificationsService.sendToUser(
            {
              title: 'Enrollment Approved',
              body: `Your enrollment for "${names.join('", "')}" has been approved.`,
            },
            purchase.userId,
          );
        } catch {
          // Notification delivery is best-effort and must not fail the approval.
        }
      }

      return successResponse({
        data: purchase,
      });
    });
  }

  /**
   * Rejects a PENDING purchase (status -> CANCELLED), records the reason and
   * removes the PENDING enrollment requests checkout created for it, in one
   * transaction. Repeating a reject on an already-CANCELLED order is a no-op.
   */
  async purchaseReject(data: PurchaseRejectDto) {
    return withErrorHandling(async () => {
      const count = await this.prisma.$transaction(async (tx) => {
        const { count } = await tx.purchase.updateMany({
          where: { id: data.purchaseId, status: 'PENDING' },
          data: { status: 'CANCELLED', rejectReason: data.reason },
        });
        if (count > 0) {
          await this.removePendingEnrollments(tx, data.purchaseId);
        }
        return count;
      });

      const purchase = await this.prisma.purchase.findUnique({
        where: { id: data.purchaseId },
        include: { items: true },
      });
      if (!purchase) {
        throw new NotFoundException('Purchase not found');
      }
      if (count === 0 && purchase.status !== 'CANCELLED') {
        throw new BadRequestException(
          `Purchase is ${purchase.status} and cannot be rejected`,
        );
      }

      if (count > 0) {
        try {
          const names = purchase.items.map((item) => item.productName);
          await this.notificationsService.sendToUser(
            {
              title: 'Order Rejected',
              body: `Your order ${purchase.orderNo} for "${names.join('", "')}" was rejected. Reason: ${data.reason}`,
            },
            purchase.userId,
          );
        } catch {
          // Notification delivery is best-effort and must not fail the rejection.
        }
      }

      return successResponse({
        data: purchase,
      });
    });
  }

  /**
   * Drops the PENDING enrollment requests a rejected order created at checkout.
   *
   * Only rows still PENDING and tagged with this order are touched, so active
   * access (APPROVED, incl. a renewal in progress) is never removed. Because
   * enrollments are unique per user+product, a second pending order for the
   * same product shares this row (checkout uses skipDuplicates); in that case
   * the request is handed over to that order instead of deleted.
   */
  private async removePendingEnrollments(
    tx: Prisma.TransactionClient,
    purchaseId: string,
  ) {
    const purchase = await tx.purchase.findUniqueOrThrow({
      where: { id: purchaseId },
      select: { userId: true, orderNo: true },
    });

    const requests = await tx.enrollment.findMany({
      where: {
        userId: purchase.userId,
        orderNo: purchase.orderNo,
        status: 'PENDING',
      },
      select: { id: true, courseId: true, mockTestId: true, flashcardId: true },
    });

    for (const request of requests) {
      const product = request.courseId
        ? { courseId: request.courseId }
        : request.mockTestId
          ? { mockTestId: request.mockTestId }
          : { flashcardId: request.flashcardId };

      const otherPending = await tx.purchase.findFirst({
        where: {
          userId: purchase.userId,
          status: 'PENDING',
          id: { not: purchaseId },
          items: { some: product },
        },
        orderBy: { createdAt: 'desc' },
        select: { orderNo: true },
      });

      if (otherPending) {
        await tx.enrollment.update({
          where: { id: request.id },
          data: { orderNo: otherPending.orderNo },
        });
      } else {
        await tx.enrollment.delete({ where: { id: request.id } });
      }
    }
  }

  /**
   * Marks a purchase APPROVED and grants/extends access for each item in one
   * transaction. Idempotent: only the PENDING -> APPROVED transition grants access,
   * so repeated confirmations (double clicks, retried webhooks) are no-ops.
   */
  async confirmPurchase(purchaseId: string) {
    const granted = await this.prisma.$transaction(async (tx) => {
      const paidAt = new Date();
      const { count } = await tx.purchase.updateMany({
        where: { id: purchaseId, status: 'PENDING' },
        data: { status: 'APPROVED', paidAt },
      });
      if (count === 0) {
        return false;
      }

      const purchase = await tx.purchase.findUniqueOrThrow({
        where: { id: purchaseId },
        include: { items: true },
      });

      // Serialize grants per user so two purchases of the same product
      // confirmed concurrently can't both extend from the same expiry.
      await tx.$queryRaw`SELECT 1 FROM "User" WHERE "id" = ${purchase.userId} FOR UPDATE`;

      for (const item of purchase.items) {
        await this.grantAccess(
          tx,
          purchase.userId,
          purchase.orderNo,
          item,
          paidAt,
        );
      }
      return true;
    });

    const purchase = await this.prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: { items: true },
    });
    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }
    if (!granted && purchase.status !== 'APPROVED') {
      throw new BadRequestException(
        `Purchase is ${purchase.status} and cannot be confirmed`,
      );
    }

    return { purchase, granted };
  }

  private async grantAccess(
    tx: Prisma.TransactionClient,
    userId: string,
    orderNo: string,
    item: PurchaseItem,
    now: Date,
  ) {
    let product: EnrollmentProduct;
    if (item.courseId) {
      product = { courseId: item.courseId };
    } else if (item.mockTestId) {
      product = { mockTestId: item.mockTestId };
    } else if (item.flashcardId) {
      product = { flashcardId: item.flashcardId };
    } else {
      // Product was deleted after checkout; nothing to grant.
      return;
    }

    const existing = await tx.enrollment.findUnique({
      where: enrollmentUniqueWhere(userId, product),
    });
    const isActive = isEnrollmentActive(existing, now);
    const days =
      item.durationDays === null ? null : item.durationDays * item.quantity;

    let expiredAt: Date | null;
    if (days === null) {
      // Lifetime purchase.
      expiredAt = null;
    } else if (isActive && existing.expiredAt === null) {
      // Already lifetime; a timed purchase can't shorten it.
      expiredAt = null;
    } else {
      // Stack on remaining time if still active, otherwise start from now.
      expiredAt = addDays(
        isActive && existing.expiredAt ? existing.expiredAt : now,
        days,
      );
    }

    if (existing) {
      await tx.enrollment.update({
        where: { id: existing.id },
        data: {
          status: 'APPROVED',
          orderNo,
          expiredAt,
          ...(!isActive && { startedAt: now }),
        },
      });
    } else {
      await tx.enrollment.create({
        data: {
          userId,
          ...product,
          orderNo,
          status: 'APPROVED',
          startedAt: now,
          expiredAt,
        },
      });
    }
  }

  private async getPurchasesByStatus(
    status: PurchaseStatus,
    query: PurchasePaginationDto,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const { search, start_date, end_date } = query;

    const where: Prisma.PurchaseWhereInput = {
      status,

      ...(search && {
        OR: [
          { userId: { equals: search } },
          { orderNo: { equals: search } },
          { transactionNo: { equals: search } },
          {
            items: {
              some: {
                OR: [
                  { courseId: search },
                  { mockTestId: search },
                  { flashcardId: search },
                ],
              },
            },
          },
          {
            user: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        ],
      }),

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

    const [data, total] = await this.prisma.$transaction([
      this.prisma.purchase.findMany({
        where,
        include: {
          user: {
            select: selectFromResponse(['name']),
          },
          items: {
            include: {
              course: {
                select: selectFromResponse(['title']),
              },
              mockTest: {
                select: selectFromResponse(['title']),
              },
              flashcard: {
                select: selectFromResponse(['name']),
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),

      this.prisma.purchase.count({
        where,
      }),
    ]);

    const totalPage = Math.ceil(total / limit);

    return successResponse({
      data: {
        items: data,
        page,
        limit,
        total,
        totalPage,
      },
    });
  }
}
