"use client";

import PurchaseStatusBadge from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/PurchaseStatusBadge/PurchaseStatusBadge";
import useContainer, {
  TRANSACTION_IMAGE,
} from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/PurchaseOrderList/components/AdminPurchaseCard/useContainer";
import { TPurchase } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/types/purchases.type";
import PurchaseOrderCard from "@/components/PurchaseOrderCard/PurchaseOrderCard";
import { Box, Image, Text } from "@mantine/core";
import { modals } from "@mantine/modals";

interface Props {
  purchase: TPurchase;
  renderAction?: (purchase: TPurchase) => React.ReactNode;
}

/** Admin view of the shared purchase card: customer + payment proof. */
const AdminPurchaseCard: React.FC<Props> = ({ purchase, renderAction }) => {
  const { order, subtitle, orderedAt, orderedAgo, approvedAt } =
    useContainer(purchase);

  return (
    <PurchaseOrderCard
      order={order}
      subtitle={subtitle}
      badge={<PurchaseStatusBadge status={purchase.status} />}
      action={renderAction?.(purchase)}
    >
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <Box>
            <Text size="10px" fw={700} c="gray.5" tt="uppercase">
              Customer
            </Text>
            <Text size="sm" fw={600} c="gray.8">
              {purchase.user?.name || "-"}
            </Text>
            <Text size="xs" c="gray.5" className="select-all! break-all!">
              {purchase.userId}
            </Text>
          </Box>
          <Box>
            <Text size="10px" fw={700} c="gray.5" tt="uppercase">
              Ordered
            </Text>
            <Text size="sm" c="gray.8">
              {orderedAt}
            </Text>
            <Text size="xs" c="gray.5">
              {orderedAgo}
            </Text>
          </Box>
          {approvedAt && (
            <Box>
              <Text size="10px" fw={700} c="gray.5" tt="uppercase">
                Approved
              </Text>
              <Text size="sm" c="gray.8">
                {approvedAt}
              </Text>
              <Text size="xs" c="gray.5">
                Approved by HongBao
              </Text>
            </Box>
          )}
        </div>

        <Box className="shrink-0!">
          <Text size="10px" fw={700} c="gray.5" tt="uppercase" mb={4}>
            Transaction image
          </Text>
          <Image
            radius="md"
            src={TRANSACTION_IMAGE}
            h={120}
            w={80}
            fit="cover"
            alt="Transaction image"
            className="cursor-pointer! border! border-gray-200! transition-shadow! hover:shadow-md!"
            onClick={() =>
              modals.open({
                title: "Check the transaction image",
                children: (
                  <Image
                    radius="md"
                    src={TRANSACTION_IMAGE}
                    h={600}
                    mx="auto"
                    alt="Transaction image"
                  />
                ),
              })
            }
          />
        </Box>
      </div>
    </PurchaseOrderCard>
  );
};

export default AdminPurchaseCard;
