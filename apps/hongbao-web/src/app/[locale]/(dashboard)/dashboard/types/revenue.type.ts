import { RevenueGranularity } from "@repo/shared";
import { TDashboardStat } from "@/app/[locale]/(dashboard)/dashboard/types/common.type";

/** ISO date strings (YYYY-MM-DD). Both bounds inclusive. */
export type TRevenueDateRange = {
  from: string;
  to: string;
};

export type TRevenueTrendPoint = {
  label: string;
  /** ISO timestamp of the bucket's start (UTC). */
  bucketStart: string;
  revenue: number;
  orders: number;
  /** Purchased items in the bucket (one per product granted). */
  enrollments: number;
};

export type TRevenueProductType =
  "COURSE" | "MOCK_TEST" | "FLASHCARD" | "DELETED";

export type TRevenueProductRow = {
  productType: TRevenueProductType;
  /** Null when the product has since been deleted. */
  productId: string | null;
  productName: string;
  /** Sum of list prices snapshotted at checkout; excludes coupon discounts. */
  revenue: number;
  quantity: number;
  orders: number;
};

export type TRevenueRes = {
  currency: string;
  granularity: RevenueGranularity;
  totalRevenue: TDashboardStat;
  orderCount: TDashboardStat;
  trend: TRevenueTrendPoint[];
  byProduct: TRevenueProductRow[];
};
