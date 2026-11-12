import dayjs from "dayjs";
import { TRevenueDateRange, TRevenueRes, TRevenueTrendPoint } from "../../../types/revenue.type";

const DAILY_BASE_REVENUE = 1_500_000;

/**
 * Buckets the trend line by hour/day/week/month depending on how wide the
 * selected range is - the same approach a real analytics endpoint would use
 * so a "Today" view isn't a single flat point and a "1 Year" view isn't 365
 * unreadable bars.
 */
const buildTrend = (from: string, to: string): TRevenueTrendPoint[] => {
  const start = dayjs(from).startOf("day");
  const end = dayjs(to).endOf("day");
  const spanDays = Math.max(1, end.diff(start, "day") + 1);

  const points: TRevenueTrendPoint[] = [];

  if (spanDays <= 1) {
    for (let h = 0; h < 24; h += 3) {
      points.push({
        label: dayjs().hour(h).minute(0).format("hA"),
        revenue: Math.round((DAILY_BASE_REVENUE / 8) * (1 + 0.5 * Math.sin(h / 2))),
        enrollments: Math.round(3 + 2 * Math.sin(h / 2)),
      });
    }
  } else if (spanDays <= 14) {
    for (let i = 0; i < spanDays; i++) {
      points.push({
        label: start.add(i, "day").format("MMM D"),
        revenue: Math.round(DAILY_BASE_REVENUE * (1 + 0.35 * Math.sin(i * 0.8) + i * 0.015)),
        enrollments: Math.round(10 + 6 * Math.sin(i * 0.8) + i * 0.2),
      });
    }
  } else if (spanDays <= 120) {
    const weeks = Math.ceil(spanDays / 7);
    for (let i = 0; i < weeks; i++) {
      points.push({
        label: start.add(i * 7, "day").format("MMM D"),
        revenue: Math.round(DAILY_BASE_REVENUE * 7 * (1 + 0.3 * Math.sin(i * 0.9) + i * 0.03)),
        enrollments: Math.round(60 + 20 * Math.sin(i * 0.9) + i * 1.5),
      });
    }
  } else {
    const months = Math.ceil(spanDays / 30);
    for (let i = 0; i < months; i++) {
      points.push({
        label: start.add(i, "month").format("MMM YYYY"),
        revenue: Math.round(DAILY_BASE_REVENUE * 30 * (1 + 0.25 * Math.sin(i * 0.7) + i * 0.05)),
        enrollments: Math.round(260 + 60 * Math.sin(i * 0.7) + i * 8),
      });
    }
  }

  return points;
};

/**
 * Stand-in for GET /dashboard/revenue?from=&to=. Shaped exactly like
 * `TRevenueRes` so wiring the real endpoint later is a matter of flipping
 * `enabled: true` in useContainer.ts and deleting this file - no consumer of
 * the hook needs to change.
 */
export const getMockRevenue = (range: TRevenueDateRange): TRevenueRes => {
  const spanDays = Math.max(
    1,
    dayjs(range.to).endOf("day").diff(dayjs(range.from).startOf("day"), "day") + 1,
  );
  const multiplier = spanDays / 30;

  return {
    totalRevenue: {
      value: Math.round(18_420_000 * multiplier),
      deltaPct: 12.6,
    },
    trend: buildTrend(range.from, range.to),
  };
};
