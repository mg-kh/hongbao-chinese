import { Badge, BadgeProps } from "@mantine/core";
import {
  CheckCircleIcon,
  ClockCountdownIcon,
  HourglassMediumIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { TOrderStatus } from "../../../types/purchase-history.type";

const statusMeta: Record<
  TOrderStatus,
  {
    label: string;
    color: string;
    icon: React.ReactNode;
    /** Light card background + border for an order in this status. */
    surface: string;
  }
> = {
  PENDING: {
    label: "Under review",
    color: "hongbao-gold",
    icon: <HourglassMediumIcon size={12} weight="fill" />,
    surface: "bg-hongbao-gold-50/30! border-hongbao-gold-200/50!",
  },
  APPROVED: {
    label: "Active",
    color: "green",
    icon: <CheckCircleIcon size={12} weight="fill" />,
    surface: "bg-green-50/50! border-green-200/50!",
  },
  CANCELLED: {
    label: "Declined",
    color: "gray",
    icon: <XCircleIcon size={12} weight="fill" />,
    surface: "bg-gray-50/60! border-gray-200/50!",
  },
  EXPIRED: {
    label: "Expired",
    color: "hongbao-red",
    icon: <ClockCountdownIcon size={12} weight="fill" />,
    surface: "bg-hongbao-red-50/25! border-hongbao-red-200/50!",
  },
};

interface Props extends Omit<BadgeProps, "color" | "leftSection"> {
  status: TOrderStatus;
}

/** Single source of truth for how each order status looks and reads. */
const OrderStatusBadge: React.FC<Props> = ({ status, ...props }) => {
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
      {meta.label}
    </Badge>
  );
};

export { statusMeta };
export default OrderStatusBadge;
