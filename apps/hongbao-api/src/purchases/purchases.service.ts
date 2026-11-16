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
      counts.find((item) => item.status === 'PAID')?._count._all ?? 0;
    const pendingCount =
      counts.find((item) => item.status === 'PENDING')?._count._all ?? 0;

    return successResponse({
      data: {
        approvedCount,
        pendingCount,
      },
    });
  }

  async getAllPendingApprovedCourse(query: PurchasePaginationDto) {
    return this.getPurchasesByStatus('PENDING', query);
  }

  async getAllApprovedCourse(query: PurchasePaginationDto) {
    return this.getPurchasesByStatus('PAID', query);
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
   * Marks a purchase PAID and grants/extends access for each item in one
   * transaction. Idempotent: only the PENDING -> PAID transition grants access,
   * so repeated confirmations (double clicks, retried webhooks) are no-ops.
   */
  async confirmPurchase(purchaseId: string) {
    const granted = await this.prisma.$transaction(async (tx) => {
      const paidAt = new Date();
      const { count } = await tx.purchase.updateMany({
        where: { id: purchaseId, status: 'PENDING' },
        data: { status: 'PAID', paidAt },
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
    if (!granted && purchase.status !== 'PAID') {
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
          status: 'ACTIVE',
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
          status: 'ACTIVE',
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
                OR: [{ courseId: search }, { mockTestId: search }],
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
