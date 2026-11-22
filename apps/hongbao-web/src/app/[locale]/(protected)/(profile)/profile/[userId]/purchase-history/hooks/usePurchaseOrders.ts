"use client";

import useApiQuery from "@/hooks/fetching/useApiQuery";
import { toPurchaseCardOrder } from "@/utils/purchaseOrder";
import { DatesRangeValue } from "@mantine/dates";
import { keepPreviousData } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  OrderFilter,
  TMyPurchase,
  TMyPurchaseRes,
  TPurchaseOrder,
} from "../../types/purchase-history.type";

const PAGE_LIMIT = 10;

const toOrder = (p: TMyPurchase): TPurchaseOrder => ({
  ...toPurchaseCardOrder(p),
  status: p.orderStatus,
  paidAt: p.paidAt,
  updatedAt: p.updatedAt,
});

/**
 * The signed-in user's orders from `purchase/my-purchases`, one page at a
 * time. Status and date range are filtered server-side; `stats` are
 * server-side totals for the date range (they ignore the status tab).
 */
const usePurchaseOrders = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilterState] = useState<OrderFilter>("ALL");

  /** Switching tabs starts over from the first page. */
  const setFilter = (value: OrderFilter) => {
    setFilterState(value);
    setPage(1);
  };
  const [dateRange, setDateRangeState] = useState<DatesRangeValue>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  /** Changing the range starts over from the first page. */
  const setDateRange = (value: DatesRangeValue) => {
    setDateRangeState(value);
    setPage(1);
  };

  const { data, isLoading, isFetching } = useApiQuery<
    { data: TMyPurchaseRes },
    TMyPurchaseRes
  >({
    url: "purchase/my-purchases",
    key: "my-purchases",
    params: {
      page,
      limit: PAGE_LIMIT,
      ...(filter !== "ALL" && { status: filter }),
      start_date: (startDate as string) || "",
      end_date: (endDate as string) || "",
    },
    select: (res) => res?.data,
    placeholderData: keepPreviousData,
  });

  const orders = useMemo<TPurchaseOrder[]>(
    () => (data?.items ?? []).map(toOrder),
    [data],
  );

  const stats = {
    total: data?.counts?.ALL ?? 0,
    pending: data?.counts?.PENDING ?? 0,
    approved: data?.counts?.APPROVED ?? 0,
    cancelled: data?.counts?.CANCELLED ?? 0,
    expired: data?.counts?.EXPIRED ?? 0,
  };

  return {
    orders,
    isLoading,
    isFetching,
    stats,
    page,
    setPage,
    totalPages: data?.totalPage || 1,
    filter,
    setFilter,
    dateRange,
    setDateRange,
    isDateFiltered: Boolean(startDate || endDate),
  };
};

export default usePurchaseOrders;
