"use client";

import useApiQuery from "@/hooks/fetching/useApiQuery";
import { toPurchaseCardOrder } from "@/utils/purchaseOrder";
import { keepPreviousData } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  TMyPurchase,
  TMyPurchaseRes,
  TOrderStatus,
  TPurchaseOrder,
} from "../../types/purchase-history.type";

const PAGE_LIMIT = 10;

/**
 * Raw purchase status -> what the customer sees. CANCELLED is an admin
 * rejection.
 */
const toOrderStatus = (status: TMyPurchase["status"]): TOrderStatus => {
  switch (status) {
    case "APPROVED":
      return "APPROVED";
    case "CANCELLED":
      return "REJECTED";
    case "PENDING":
    default:
      return "PENDING";
  }
};

const toOrder = (p: TMyPurchase): TPurchaseOrder => ({
  ...toPurchaseCardOrder(p),
  status: toOrderStatus(p.status),
  paidAt: p.paidAt,
  updatedAt: p.updatedAt,
});

/**
 * The signed-in user's orders from `purchase/my-purchases`, one page at a
 * time, plus counts derived from the loaded page. `stats.total` is the
 * server-side total; the per-status counts and `spent` only cover the
 * current page.
 */
const usePurchaseOrders = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useApiQuery<
    { data: TMyPurchaseRes },
    TMyPurchaseRes
  >({
    url: "purchase/my-purchases",
    key: "my-purchases",
    params: { page, limit: PAGE_LIMIT },
    select: (res) => res?.data,
    placeholderData: keepPreviousData,
  });

  const orders = useMemo<TPurchaseOrder[]>(
    () => (data?.items ?? []).map(toOrder),
    [data],
  );

  const stats = useMemo(() => {
    const by = (status: TOrderStatus) =>
      orders.filter((o) => o.status === status).length;
    return {
      total: data?.total ?? 0,
      pending: by("PENDING"),
      approved: by("APPROVED"),
      rejected: by("REJECTED"),
      expired: by("EXPIRED"),
      /** Total across approved + expired orders (money actually spent). */
      spent: orders
        .filter((o) => o.status === "APPROVED" || o.status === "EXPIRED")
        .reduce((sum, o) => sum + o.total, 0),
    };
  }, [orders, data?.total]);

  return {
    orders,
    isLoading,
    isFetching,
    stats,
    page,
    setPage,
    totalPages: data?.totalPage || 1,
  };
};

export default usePurchaseOrders;
