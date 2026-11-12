"use client";

import { useMemo, useState } from "react";
import { OrderFilter } from "../../../types/purchase-history.type";
import usePurchaseOrders from "../../hooks/usePurchaseOrders";

const useContainer = () => {
  const { orders, isLoading, isFetching, stats, page, setPage, totalPages } =
    usePurchaseOrders();
  const [filter, setFilter] = useState<OrderFilter>("ALL");

  const filteredOrders = useMemo(
    () => (filter === "ALL" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  /** Tab config - counts stay in sync with `stats`. */
  const filters: { value: OrderFilter; label: string; count: number }[] = [
    { value: "ALL", label: "All", count: stats.total },
    { value: "PENDING", label: "Under review", count: stats.pending },
    { value: "APPROVED", label: "Active", count: stats.approved },
    { value: "EXPIRED", label: "Expired", count: stats.expired },
    { value: "REJECTED", label: "Declined", count: stats.rejected },
  ];

  return {
    isLoading,
    isFetching,
    stats,
    page,
    setPage,
    totalPages,
    filter,
    setFilter,
    filters,
    filteredOrders,
    hasAnyOrders: stats.total > 0,
  };
};

export default useContainer;
