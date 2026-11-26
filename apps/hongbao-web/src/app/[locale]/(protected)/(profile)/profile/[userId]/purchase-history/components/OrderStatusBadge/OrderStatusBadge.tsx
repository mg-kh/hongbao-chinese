import { Badge, BadgeProps } from "@mantine/core";
import {
  CheckCircleIcon,
  ClockCountdownIcon,
  HourglassMediumIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { TOrderStatus } from "../../../types/purchase-history.type";

const statusMeta: Record<
  TOrderStatus,
  {
    /** Message key under `Profile.PurchaseHistory.status`. */
    labelKey: "pending" | "approved" | "cancelled" | "expired";
    color: string;
    icon: React.ReactNode;
    /** Light card background + border for an order in this status. */
    surface: string;
  }
> = {
  PENDING: {
    labelKey: "pending",
    color: "hongbao-gold",
    icon: <HourglassMediumIcon size={12} weight="fill" />,
    surface: "bg-hongbao-gold-50/60! border-hongbao-gold-200/70!",
  },
  APPROVED: {
    labelKey: "approved",
    color: "green",
    icon: <CheckCircleIcon size={12} weight="fill" />,
    surface: "bg-green-50/80! border-green-200/70!",
  },
  CANCELLED: {
    labelKey: "cancelled",
    color: "gray",
    icon: <XCircleIcon size={12} weight="fill" />,
    surface: "bg-gray-50! border-gray-200/70!",
  },
  EXPIRED: {
    labelKey: "expired",
    color: "hongbao-red",
    icon: <ClockCountdownIcon size={12} weight="fill" />,
    surface: "bg-hongbao-red-50/50! border-hongbao-red-200/70!",
  },
};

interface Props extends Omit<BadgeProps, "color" | "leftSection"> {
  status: TOrderStatus;
}

/** Single source of truth for how each order status looks and reads. */
const OrderStatusBadge: React.FC<Props> = ({ status, ...props }) => {
  const t = useTranslations("Profile.PurchaseHistory.status");
  // Fall back rather than crash if the API ever sends an unmapped status.
  const meta = statusMeta[status] ?? statusMeta.PENDING;
  return (
    <Badge
      color={meta.color}
      variant="light"
      radius="sm"
      leftSection={meta.icon}
      {...props}
    >
      {t(meta.labelKey)}
    </Badge>
  );
};

export { statusMeta };
export default OrderStatusBadge;
