import { TDashboardStat } from "./common.type";

/** ISO date strings (YYYY-MM-DD). Both bounds inclusive. */
export type TRevenueDateRange = {
  from: string;
  to: string;
};

export type TRevenueTrendPoint = {
  label: string;
  revenue: number;
  enrollments: number;
};

export type TRevenueRes = {
  totalRevenue: TDashboardStat;
  trend: TRevenueTrendPoint[];
};
