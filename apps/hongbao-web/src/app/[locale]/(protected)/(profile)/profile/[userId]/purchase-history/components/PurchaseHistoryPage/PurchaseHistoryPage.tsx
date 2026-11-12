"use client";

import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import { Link } from "@/i18n/navigation";
import { currencyFormatter } from "@/utils/currencyFormatter";
import {
  Box,
  Button,
  Group,
  Pagination,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ReceiptIcon,
  StorefrontIcon,
} from "@phosphor-icons/react";
import { isEmpty } from "lodash";
import { useParams } from "next/navigation";
import OrderCard from "../OrderCard/OrderCard";
import useContainer from "./useContainer";

/** Copy shown when a status filter turns up nothing. */
const emptyByFilter: Record<string, string> = {
  ALL: "You haven't placed any orders yet.",
  PENDING: "Nothing is waiting for review.",
  APPROVED: "No active purchases right now.",
  EXPIRED: "Nothing has expired.",
  REJECTED: "No declined orders.",
};

const money = (value: number) =>
  currencyFormatter({ value, currencySample: "MMK" });

const PurchaseHistoryPage = () => {
  const {
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
    hasAnyOrders,
  } = useContainer();
  const { userId } = useParams();

  return (
    <Stack gap={20} className="flex-1!">
      <Link
        href={`/profile/${userId}`}
        className="flex! items-center! gap-1.5! w-fit! no-underline! text-gray-500! hover:text-hongbao-red-600! transition-colors! duration-200!"
      >
        <ArrowLeftIcon size={14} weight="bold" />
        <Text size="xs" fw={600}>
          Back to profile
        </Text>
      </Link>

      {/* header */}
      <Group justify="space-between" align="flex-start" wrap="wrap" gap={12}>
        <Stack gap={4} className="min-w-0!">
          <Text size="xl" fw="bold" c="hongbao-red">
            Purchase history
          </Text>
          <Text size="sm" c="gray.6">
            Every order you&apos;ve placed in the shop, with its review status
            and payment details.
          </Text>
        </Stack>
        <Button
          component={Link}
          href="/shop"
          color="hongbao-red"
          radius="md"
          size="sm"
          rightSection={<ArrowRightIcon size={14} />}
          className="w-full! sm:w-auto! shrink-0!"
        >
          Go to shop
        </Button>
      </Group>

      {/* summary strip - only meaningful once there's history */}
      {hasAnyOrders && (
        <Paper
          withBorder
          bdrs={16}
          p={{ base: 16, sm: 20 }}
          className="border-gray-200! bg-white!"
        >
          <Group gap={0} wrap="nowrap" align="stretch">
            {[
              {
                value: stats.total,
                label: stats.total === 1 ? "Order" : "Orders",
                accent: false,
              },
              { value: stats.approved, label: "Active", accent: false },
              { value: money(stats.spent), label: "Spent", accent: true },
            ].map((stat, i) => (
              <Box
                key={stat.label}
                className={`flex-1! min-w-0! ${i > 0 ? "border-l! border-gray-100! pl-4!" : ""} ${i < 2 ? "pr-4!" : ""}`}
              >
                <Text
                  size="lg"
                  fw={800}
                  c={stat.accent ? "hongbao-red.7" : "gray.9"}
                  lineClamp={1}
                >
                  {stat.value}
                </Text>
                <Text size="11px" c="gray.5" fw={600} className="mt-0.5!">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </Group>
        </Paper>
      )}

      {/* status filter - scrolls sideways on narrow screens */}
      {hasAnyOrders && (
        <Box className="-mx-1! overflow-x-auto! [&::-webkit-scrollbar]:hidden!">
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
                      : "border-gray-200! bg-white! text-gray-600! hover:border-hongbao-red-200! hover:text-hongbao-red-600!"
                  }`}
                >
                  {f.label}
                  <span
                    className={`rounded-full! px-1.5! py-0.5! text-[10px]! leading-none! ${
                      active
                        ? "bg-white/25! text-white!"
                        : "bg-gray-100! text-gray-500!"
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </Group>
        </Box>
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
            <Box className="flex! items-center! justify-center! w-14! h-14! rounded-2xl! bg-hongbao-red-50! text-hongbao-red-600!">
              {filter === "ALL" ? (
                <StorefrontIcon size={26} weight="fill" />
              ) : (
                <ReceiptIcon size={26} weight="fill" />
              )}
            </Box>
            <Text ta="center" c="gray.7">
              {emptyByFilter[filter]}
            </Text>
            {filter === "ALL" ? (
              <Button
                component={Link}
                href="/shop"
                color="hongbao-red"
                rightSection={<ArrowRightIcon size={15} />}
                className="w-full! sm:w-auto!"
              >
                Browse the shop
              </Button>
            ) : (
              <Button
                variant="light"
                color="hongbao-red"
                size="sm"
                onClick={() => setFilter("ALL")}
              >
                Show all orders
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

      {totalPages > 1 && (
        <Group justify="center">
          <Pagination
            total={totalPages}
            value={page}
            onChange={(value) => {
              setPage(value);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            color="hongbao-red"
            radius="md"
            siblings={1}
            boundaries={1}
          />
        </Group>
      )}
    </Stack>
  );
};

export default PurchaseHistoryPage;
