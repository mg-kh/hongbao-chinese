"use client";

import OrderStatusBadge from "@/app/[locale]/(protected)/(profile)/profile/[userId]/purchase-history/components/OrderStatusBadge/OrderStatusBadge";
import OrderStatusTimeline from "@/app/[locale]/(protected)/(profile)/profile/[userId]/purchase-history/components/OrderStatusTimeline/OrderStatusTimeline";
import { TPurchaseOrder } from "@/app/[locale]/(protected)/(profile)/profile/[userId]/types/purchase-history.type";
import PurchaseOrderCard from "@/components/PurchaseOrderCard/PurchaseOrderCard";
import { Link } from "@/i18n/navigation";
import { Button, Divider } from "@mantine/core";
import useContainer from "@/app/[locale]/(protected)/(profile)/profile/[userId]/purchase-history/components/OrderCard/useContainer";

interface Props {
  order: TPurchaseOrder;
}

/** Customer view of the shared purchase card: lifecycle + next step. */
const OrderCard: React.FC<Props> = ({ order }) => {
  const { primaryAction } = useContainer(order);

  return (
    <PurchaseOrderCard
      order={order}
      badge={<OrderStatusBadge status={order.status} size="sm" />}
    >
      <Divider color="gray.2" />

      {/* lifecycle */}
      <OrderStatusTimeline order={order} />

      {/* actions */}
      <div className="flex flex-wrap gap-2.5">
        <Button
          component={Link}
          href={primaryAction.href}
          variant={primaryAction.variant}
          color="hongbao-red"
          radius="xl"
          size="sm"
          className="flex-1! sm:flex-none!"
        >
          {primaryAction.label}
        </Button>
        {primaryAction.href !== "/shop" && (
          <Button
            component={Link}
            href="/shop"
            variant="subtle"
            color="gray"
            radius="xl"
            size="sm"
            className="flex-1! sm:flex-none!"
          >
            Buy again
          </Button>
        )}
      </div>
    </PurchaseOrderCard>
  );
};

export default OrderCard;
