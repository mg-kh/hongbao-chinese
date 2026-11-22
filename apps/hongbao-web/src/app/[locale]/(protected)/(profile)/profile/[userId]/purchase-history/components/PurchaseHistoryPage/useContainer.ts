"use client";

import { OrderFilter } from "../../../types/purchase-history.type";
import usePurchaseOrders from "../../hooks/usePurchaseOrders";

const useContainer = () => {
  const {
    orders,
    isLoading,
    isFetching,
    stats,
    page,
    setPage,
    totalPages,
    filter,
    setFilter,
    dateRange,
    setDateRange,
    isDateFiltered,
  } = usePurchaseOrders();

  /** Tab config - counts stay in sync with `stats`. */
  const filters: { value: OrderFilter; label: string; count: number }[] = [
    { value: "ALL", label: "All", count: stats.total },
    { value: "PENDING", label: "Under review", count: stats.pending },
    { value: "APPROVED", label: "Active", count: stats.approved },
    { value: "EXPIRED", label: "Expired", count: stats.expired },
    { value: "CANCELLED", label: "Declined", count: stats.cancelled },
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
    /** Item count for the selected status tab. */
    activeCount: filters.find((f) => f.value === filter)?.count ?? 0,
    // Already filtered by status on the server.
    filteredOrders: orders,
    dateRange,
    setDateRange,
    isDateFiltered,
    clearDateRange: () => setDateRange([null, null]),
    // Keep the filters on screen when a date range empties the list.
    hasAnyOrders: stats.total > 0 || isDateFiltered,
  };
};

export default useContainer;
