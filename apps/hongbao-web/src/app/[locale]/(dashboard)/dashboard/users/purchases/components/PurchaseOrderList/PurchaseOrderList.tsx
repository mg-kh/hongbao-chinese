"use client";

import LoaderComponent from "@/components/LoaderComponent/LoaderComponent";
import { TPurchaseCourse } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/types/purchases.type";
import { Paper, Stack, Text } from "@mantine/core";
import { ReceiptIcon } from "@phosphor-icons/react";
import PurchaseOrderCard from "./components/PurchaseOrderCard/PurchaseOrderCard";
import useContainer from "./useContainer";

interface Props {
  rows: TPurchaseCourse[];
  isLoading?: boolean;
  /** Filters / search bar shown above the list. */
  header?: React.ReactNode;
  /** Pagination shown below the list. */
  footer?: React.ReactNode;
  /** Right-hand side of each order line (e.g. an Approve button). */
  renderItemAction?: (item: TPurchaseCourse) => React.ReactNode;
  emptyLabel?: string;
}

const PurchaseOrderList: React.FC<Props> = ({
  rows,
  isLoading,
  header,
  footer,
  renderItemAction,
  emptyLabel = "No orders found",
}) => {
  const { orders } = useContainer(rows);

  return (
    <Stack gap={12}>
      {header && (
        <Paper withBorder bdrs={12} className="border-gray-200! px-4! py-3!">
          {header}
        </Paper>
      )}

      {isLoading ? (
        <LoaderComponent />
      ) : orders.length === 0 ? (
        <Paper
          withBorder
          bdrs={16}
          className="flex! flex-col! items-center! gap-3! border-dashed! border-gray-300! bg-gray-50/60! py-12!"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <ReceiptIcon size={22} />
          </div>
          <Text size="sm" c="dimmed" fw={500}>
            {emptyLabel}
          </Text>
        </Paper>
      ) : (
        <Stack gap={12}>
          {orders.map((order) => (
            <PurchaseOrderCard
              key={order.orderNo}
              order={order}
              renderItemAction={renderItemAction}
            />
          ))}
        </Stack>
      )}

      {footer && (
        <Paper withBorder bdrs={12} className="border-gray-200! px-4! py-3!">
          {footer}
        </Paper>
      )}
    </Stack>
  );
};

export default PurchaseOrderList;
