"use client";

import { useTranslations } from "next-intl";
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
    pageSize,
    setPageSize,
    totalPages,
    filter,
    setFilter,
    dateRange,
    setDateRange,
    isDateFiltered,
  } = usePurchaseOrders();
  const t = useTranslations("Profile.PurchaseHistory");

  /** Tab config - counts stay in sync with `stats`. */
  const filters: { value: OrderFilter; label: string; count: number }[] = [
    { value: "ALL", label: t("filter_all"), count: stats.total },
    { value: "PENDING", label: t("status.pending"), count: stats.pending },
    { value: "APPROVED", label: t("status.approved"), count: stats.approved },
    { value: "EXPIRED", label: t("status.expired"), count: stats.expired },
    {
      value: "CANCELLED",
      label: t("status.cancelled"),
      count: stats.cancelled,
    },
  ];

  /** Item count for the selected status tab. */
  const activeCount = filters.find((f) => f.value === filter)?.count ?? 0;

  /** Scroll back to the top so the new page starts at its first order. */
  const changePage = (value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    isLoading,
    isFetching,
    stats,
    page,
    changePage,
    pageSize,
    setPageSize,
    totalPages,
    filter,
    setFilter,
    filters,
    activeCount,
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
