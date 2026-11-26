import { z } from "zod";

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const RevenueGranularity = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
} as const;
export type RevenueGranularity =
  (typeof RevenueGranularity)[keyof typeof RevenueGranularity];

/**
 * Query for `GET /dashboard/revenue`. Both bounds are inclusive UTC calendar
 * days, matching the date filters on the purchase list endpoints.
 * Omitting `granularity` lets the API choose one from the range width.
 */
export const RevenueQuerySchema = z
  .object({
    from: IsoDate,
    to: IsoDate,
    granularity: z.enum(RevenueGranularity).nullish(),
  })
  .refine((q) => q.from <= q.to, {
    message: "`from` must be on or before `to`",
    path: ["from"],
  });
export type RevenueQuery = z.input<typeof RevenueQuerySchema>;
