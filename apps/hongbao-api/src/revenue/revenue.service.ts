import { successResponse } from '@/utils/response';
import { withErrorHandling } from '@/utils/withErrorHandling';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RevenueGranularity } from '@repo/shared';
import { PrismaService } from '../prisma/prisma.service';
import { RevenueQueryDto } from './dto/revenue-query.dto';

type Range = { gte: Date; lte: Date };
type ProductType = 'COURSE' | 'MOCK_TEST' | 'FLASHCARD' | 'DELETED';

const DAY_MS = 24 * 60 * 60 * 1000;

// Dates are handled as UTC calendar days, matching the purchase list filters.
const utcDay = (iso: string) => new Date(`${iso}T00:00:00.000Z`);
const endOfUtcDay = (iso: string) => new Date(`${iso}T23:59:59.999Z`);

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const pickGranularity = (spanDays: number): RevenueGranularity =>
  spanDays <= 31 ? 'day' : spanDays <= 120 ? 'week' : 'month';

// Mirrors Postgres date_trunc on UTC timestamps (weeks start on Monday).
const truncate = (d: Date, g: RevenueGranularity) => {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  if (g === 'month') return new Date(Date.UTC(y, m, 1));
  const day = new Date(Date.UTC(y, m, d.getUTCDate()));
  if (g === 'day') return day;
  const sinceMonday = (day.getUTCDay() + 6) % 7;
  return new Date(day.getTime() - sinceMonday * DAY_MS);
};
const step = (d: Date, g: RevenueGranularity) =>
  g === 'month'
    ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))
    : new Date(d.getTime() + (g === 'week' ? 7 : 1) * DAY_MS);
const label = (d: Date, g: RevenueGranularity) =>
  g === 'month'
    ? `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
    : `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;

const deltaPct = (current: number, previous: number) =>
  previous === 0
    ? 0
    : Math.round(((current - previous) / previous) * 1000) / 10;

@Injectable()
export class RevenueService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Order-level revenue from APPROVED purchases, dated by `paidAt` (the time
   * an admin confirmed payment). Deltas compare against the immediately
   * preceding period of the same length.
   *
   * Product revenue uses the list price snapshotted on each PurchaseItem, so
   * it excludes coupon discounts and won't sum to totalRevenue when coupons
   * were used (redemptions aren't linked to orders).
   */
  async getRevenue(query: RevenueQueryDto) {
    return withErrorHandling(async () => {
      const from = utcDay(query.from);
      const range: Range = { gte: from, lte: endOfUtcDay(query.to) };
      const spanDays =
        Math.round((utcDay(query.to).getTime() - from.getTime()) / DAY_MS) + 1;
      const previous: Range = {
        gte: new Date(from.getTime() - spanDays * DAY_MS),
        lte: new Date(from.getTime() - 1),
      };
      const granularity = query.granularity ?? pickGranularity(spanDays);

      const [current, prior, trend, byProduct] = await Promise.all([
        this.totals(range),
        this.totals(previous),
        this.trend(range, granularity),
        this.byProduct(range),
      ]);

      return successResponse({
        data: {
          currency: 'MMK',
          granularity,
          totalRevenue: {
            value: current.revenue,
            deltaPct: deltaPct(current.revenue, prior.revenue),
          },
          orderCount: {
            value: current.orders,
            deltaPct: deltaPct(current.orders, prior.orders),
          },
          trend,
          byProduct,
        },
      });
    });
  }

  private async totals(paidAt: Range) {
    const res = await this.prisma.purchase.aggregate({
      where: { status: 'APPROVED', paidAt },
      _sum: { totalAmount: true },
      _count: { _all: true },
    });
    return { revenue: res._sum.totalAmount ?? 0, orders: res._count._all };
  }

  private async trend(paidAt: Range, granularity: RevenueGranularity) {
    // Whitelisted by the zod enum; safe to inline.
    const unit = Prisma.raw(`'${granularity}'`);
    const rows = await this.prisma.$queryRaw<
      { bucket: Date; revenue: bigint; orders: bigint; enrollments: bigint }[]
    >`
      SELECT date_trunc(${unit}, p."paidAt") AS bucket,
             SUM(p."totalAmount")             AS revenue,
             COUNT(*)                         AS orders,
             SUM(i.cnt)                       AS enrollments
      FROM "Purchase" p
      CROSS JOIN LATERAL (
        SELECT COUNT(*) AS cnt FROM "PurchaseItem" WHERE "purchaseId" = p."id"
      ) i
      WHERE p."status" = 'APPROVED'
        AND p."paidAt" BETWEEN ${paidAt.gte} AND ${paidAt.lte}
      GROUP BY 1
    `;

    const byBucket = new Map(rows.map((r) => [r.bucket.getTime(), r]));

    // Fill empty buckets so the chart shows gaps as zero, not as missing points.
    const points: {
      label: string;
      bucketStart: string;
      revenue: number;
      orders: number;
      enrollments: number;
    }[] = [];
    for (
      let b = truncate(paidAt.gte, granularity);
      b <= paidAt.lte;
      b = step(b, granularity)
    ) {
      const row = byBucket.get(b.getTime());
      points.push({
        label: label(b, granularity),
        bucketStart: b.toISOString(),
        revenue: Number(row?.revenue ?? 0),
        orders: Number(row?.orders ?? 0),
        enrollments: Number(row?.enrollments ?? 0),
      });
    }
    return points;
  }

  private async byProduct(paidAt: Range) {
    // Items whose product was deleted keep only their snapshot name, so they
    // are grouped by that name instead of an id.
    const rows = await this.prisma.$queryRaw<
      {
        productType: ProductType;
        productId: string | null;
        productName: string;
        revenue: bigint;
        quantity: bigint;
        orders: bigint;
      }[]
    >`
      SELECT CASE
               WHEN i."courseId"    IS NOT NULL THEN 'COURSE'
               WHEN i."mockTestId"  IS NOT NULL THEN 'MOCK_TEST'
               WHEN i."flashcardId" IS NOT NULL THEN 'FLASHCARD'
               ELSE 'DELETED'
             END                                              AS "productType",
             COALESCE(i."courseId", i."mockTestId", i."flashcardId") AS "productId",
             (ARRAY_AGG(i."productName" ORDER BY p."paidAt" DESC))[1] AS "productName",
             SUM(i."price" * i."quantity")                    AS revenue,
             SUM(i."quantity")                                AS quantity,
             COUNT(DISTINCT p."id")                           AS orders
      FROM "PurchaseItem" i
      JOIN "Purchase" p ON p."id" = i."purchaseId"
      WHERE p."status" = 'APPROVED'
        AND p."paidAt" BETWEEN ${paidAt.gte} AND ${paidAt.lte}
      GROUP BY 1, 2,
               CASE WHEN COALESCE(i."courseId", i."mockTestId", i."flashcardId") IS NULL
                    THEN i."productName" END
      ORDER BY revenue DESC
    `;
    return rows.map((r) => ({
      productType: r.productType,
      productId: r.productId,
      productName: r.productName,
      revenue: Number(r.revenue),
      quantity: Number(r.quantity),
      orders: Number(r.orders),
    }));
  }
}
