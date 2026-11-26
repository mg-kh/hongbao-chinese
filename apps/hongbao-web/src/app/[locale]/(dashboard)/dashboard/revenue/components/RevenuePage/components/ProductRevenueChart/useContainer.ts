import {
  TRevenueProductRow,
  TRevenueProductType,
} from "@/app/[locale]/(dashboard)/dashboard/types/revenue.type";
import { useMemo } from "react";

export const MAX_BARS = 10;
export const BAR_ROW_HEIGHT = 40;
const MAX_NAME_LENGTH = 26;

const TYPE_LABEL: Record<TRevenueProductType, string> = {
  COURSE: "Course",
  MOCK_TEST: "Mock Test",
  FLASHCARD: "Flashcard",
  DELETED: "Deleted product",
};

export type TProductBar = {
  name: string;
  revenue: number;
  quantity: number;
  detail: string;
};

/**
 * Rows arrive sorted by revenue (desc). Past MAX_BARS the tail folds into a
 * single "Other" bar so the chart stays readable as the catalog grows.
 */
const toBars = (rows: TRevenueProductRow[]): TProductBar[] => {
  const head = rows.slice(0, MAX_BARS - (rows.length > MAX_BARS ? 1 : 0));
  const tail = rows.slice(head.length);

  const bars: TProductBar[] = head.map((r) => ({
    name: r.productName,
    revenue: r.revenue,
    quantity: r.quantity,
    detail: TYPE_LABEL[r.productType],
  }));

  if (tail.length) {
    bars.push({
      name: `Other (${tail.length})`,
      revenue: tail.reduce((s, r) => s + r.revenue, 0),
      quantity: tail.reduce((s, r) => s + r.quantity, 0),
      detail: `${tail.length} more products`,
    });
  }
  return bars;
};

/** Long names are shortened on the axis; the tooltip shows the full name. */
const truncateName = (value: string) =>
  value.length > MAX_NAME_LENGTH
    ? `${value.slice(0, MAX_NAME_LENGTH - 1)}…`
    : value;

const useContainer = (rows: TRevenueProductRow[]) => {
  const bars = useMemo(() => toBars(rows), [rows]);

  return {
    bars,
    chartHeight: bars.length * BAR_ROW_HEIGHT + 32,
    truncateName,
  };
};

export default useContainer;
