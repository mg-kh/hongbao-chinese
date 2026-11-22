"use client";

import useContainer from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/PurchaseOrderList/useContainer";
import { TPurchase } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/types/purchases.type";
import CustomTable from "@/components/CustomTable/CustomTable";
import { Text } from "@mantine/core";

interface Props {
  rows: TPurchase[];
  isLoading?: boolean;
  /** Filters / search bar shown above the table. */
  header?: React.ReactNode;
  /** Pagination shown below the table. */
  footer?: React.ReactNode;
  emptyLabel?: string;
  /** Rows before this page, for the "No." column: `(page - 1) * limit`. */
  noOffset?: number;
}

/** Purchases table; clicking a row opens the purchase detail page. */
const PurchaseOrderList: React.FC<Props> = ({
  rows,
  isLoading,
  header,
  footer,
  emptyLabel = "No orders found",
  noOffset = 0,
}) => {
  const { openDetail, formatTotal, formatOrderedAt, formatOrderedAgo } =
    useContainer();

  const columns = [
    {
      id: "orderNo",
      header: "Order No",
      element: (p: TPurchase) => (
        <Text
          size="sm"
          fw={700}
          className="font-mono! tracking-tight! whitespace-nowrap! text-gray-900!"
        >
          {p.orderNo}
        </Text>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      element: (p: TPurchase) => (
        <Text size="sm" fw={600} c="gray.8" lineClamp={1}>
          {p.user?.name || "-"}
        </Text>
      ),
    },
    {
      id: "ordered",
      header: "Ordered",
      element: (p: TPurchase) => (
        <div className="whitespace-nowrap">
          <Text size="sm" c="gray.8">
            {formatOrderedAt(p)}
          </Text>
          <Text size="xs" c="gray.5">
            {formatOrderedAgo(p)}
          </Text>
        </div>
      ),
    },
    {
      id: "total",
      header: "Total",
      headerClass: "text-right!",
      columnClass: "text-right!",
      element: (p: TPurchase) => (
        <Text
          size="sm"
          fw={800}
          c="hongbao-red.7"
          className="whitespace-nowrap! tabular-nums!"
        >
          {formatTotal(p)}
        </Text>
      ),
    },
  ];

  return (
    <CustomTable<TPurchase>
      header={header}
      footer={footer}
      rows={rows}
      columns={columns}
      isLoading={isLoading}
      emptyLabel={emptyLabel}
      noOffset={noOffset}
      onTableRowClick={openDetail}
    />
  );
};

export default PurchaseOrderList;
