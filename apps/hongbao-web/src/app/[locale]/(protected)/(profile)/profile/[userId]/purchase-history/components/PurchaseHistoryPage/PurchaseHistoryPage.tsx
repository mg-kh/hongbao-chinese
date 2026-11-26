"use client";

import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import DateRangeInput from "@/components/Inputs/DateRangeInput/DateRangeInput";
import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import { Link } from "@/i18n/navigation";
import {
  Box,
  Button,
  Group,
  Pagination,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import {
  ArrowRightIcon,
  ReceiptIcon,
  StorefrontIcon,
} from "@phosphor-icons/react";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { PAGE_SIZE_OPTIONS } from "@/constants/pagination";
import OrderCard from "../OrderCard/OrderCard";
import useContainer from "./useContainer";

/** Message keys for the copy shown when a status filter turns up nothing. */
const emptyByFilter = {
  ALL: "empty.all",
  PENDING: "empty.pending",
  APPROVED: "empty.approved",
  EXPIRED: "empty.expired",
  CANCELLED: "empty.cancelled",
} as const;

const PurchaseHistoryPage = () => {
  const {
    isLoading,
    isFetching,
    page,
    changePage,
    pageSize,
    setPageSize,
    totalPages,
    filter,
    setFilter,
    filters,
    filteredOrders,
    hasAnyOrders,
    dateRange,
    setDateRange,
    isDateFiltered,
    clearDateRange,
    activeCount,
  } = useContainer();
  const { userId } = useParams();
  const t = useTranslations("Profile.PurchaseHistory");

  return (
    <Stack gap={20} className="flex-1!">
      {/* header */}
      <Group justify="space-between" align="center" wrap="wrap" gap={12}>
        <CustomBreadCrumb
          title={t("title")}
          links={[
            {
              label: t("breadcrumb_profile"),
              href: `/profile/${userId}`,
              isActive: true,
            },
            { label: t("title"), href: "", isActive: false },
          ]}
        />
        <Button
          component={Link}
          href="/shop"
          color="hongbao-red"
          radius="md"
          size="sm"
          rightSection={<ArrowRightIcon size={14} />}
          className="w-full! sm:w-auto! shrink-0!"
        >
          {t("go_to_shop")}
        </Button>
      </Group>

      {/* status filter (scrolls sideways on narrow screens) + date range */}
      {hasAnyOrders && (
        <Group justify="space-between" align="center" gap={12} wrap="wrap">
          <Box className="-mx-1! min-w-0! max-w-full! overflow-x-auto! [&::-webkit-scrollbar]:hidden!">
            <Group gap={8} wrap="nowrap" className="px-1! w-max!">
              {filters.map((f) => {
                const active = filter === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFilter(f.value)}
                    aria-pressed={active}
                    className={`flex! items-center! gap-2! shrink-0! rounded-full! border! px-3.5! py-1.5! text-xs! font-semibold! cursor-pointer! transition-colors! duration-200! ease-out! ${
                      active
                        ? "border-hongbao-red-500! bg-hongbao-red-500! text-white!"
                        : "border-gray-200! bg-surface! text-gray-600! hover:border-hongbao-red-200! hover:text-hongbao-red-600! dark:hover:text-night-red!"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </Group>
          </Box>
          <DateRangeInput value={dateRange} onChange={setDateRange} />
        </Group>
      )}

      {/* item count for the active filter */}
      {hasAnyOrders && !isLoading && (
        <Group gap={8} align="center" wrap="wrap">
          <Text size="sm" c="gray.6">
            {t.rich("showing_count", {
              count: activeCount,
              b: (chunks) => (
                <Text span fw={700} c="gray.9">
                  {chunks}
                </Text>
              ),
            })}
          </Text>
          {isDateFiltered && (
            <span className="rounded-full! bg-gray-100! px-2! py-0.5! text-[11px]! font-semibold! text-gray-600!">
              {t("date_range_applied")}
            </span>
          )}
        </Group>
      )}

      {/* list */}
      {isLoading ? (
        <LoaderComponent />
      ) : isEmpty(filteredOrders) ? (
        <Paper
          withBorder
          bdrs={20}
          p={{ base: 28, sm: 40 }}
          className="border-dashed! border-gray-300! bg-gray-50/60!"
        >
          <Stack align="center" gap={14}>
            <Box className="flex! items-center! justify-center! w-14! h-14! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600! dark:text-night-red!">
              {filter === "ALL" ? (
                <StorefrontIcon size={26} weight="fill" />
              ) : (
                <ReceiptIcon size={26} weight="fill" />
              )}
            </Box>
            <Text ta="center" c="gray.7">
              {isDateFiltered
                ? t("empty.date_range")
                : t(emptyByFilter[filter])}
            </Text>
            {isDateFiltered ? (
              <Button
                variant="light"
                color="hongbao-red"
                size="sm"
                onClick={clearDateRange}
              >
                {t("clear_date_range")}
              </Button>
            ) : filter === "ALL" ? (
              <Button
                component={Link}
                href="/shop"
                color="hongbao-red"
                rightSection={<ArrowRightIcon size={15} />}
                className="w-full! sm:w-auto!"
              >
                {t("browse_shop")}
              </Button>
            ) : (
              <Button
                variant="light"
                color="hongbao-red"
                size="sm"
                onClick={() => setFilter("ALL")}
              >
                {t("show_all")}
              </Button>
            )}
          </Stack>
        </Paper>
      ) : (
        <Stack
          gap={12}
          className={`transition-opacity! duration-200! ${isFetching ? "opacity-60!" : ""}`}
        >
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Stack>
      )}

      {/* sticky pagination - floats above the mobile bottom nav */}
      {!isLoading && !isEmpty(filteredOrders) && (
        // Full-width sticky track, but clicks pass through everywhere except the
        // compact bar pinned to its right edge.
        <Box className="pointer-events-none! sticky! bottom-[calc(72px+env(safe-area-inset-bottom))]! lg:bottom-4! z-30! mt-auto! flex! justify-end!">
          <Group
            align="center"
            wrap="nowrap"
            gap={10}
            className="pointer-events-auto! w-fit! max-w-full! rounded-xl! border! border-gray-200! bg-surface/95! backdrop-blur-md! px-2.5! py-1.5! shadow-[0_4px_20px_-6px_rgba(0,0,0,0.18)]!"
          >
            {/* same per-page choices as the dashboard tables */}
            <Select
              placeholder={t("per_page")}
              aria-label={t("orders_per_page")}
              data={PAGE_SIZE_OPTIONS}
              value={String(pageSize)}
              onChange={(value) => value && setPageSize(Number(value))}
              allowDeselect={false}
              size="xs"
              radius="md"
              w={80}
              className="shrink-0!"
              comboboxProps={{ position: "top", shadow: "md" }}
            />
            <Pagination
              total={totalPages}
              value={page}
              onChange={changePage}
              color="hongbao-red"
              radius="md"
              size="sm"
              siblings={1}
              boundaries={1}
            />
          </Group>
        </Box>
      )}
    </Stack>
  );
};

export default PurchaseHistoryPage;
