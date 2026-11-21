import { TPurchaseStatus } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/types/purchases.type";
import { Badge } from "@mantine/core";
import {
  CheckCircleIcon,
  HourglassMediumIcon,
  XCircleIcon,
} from "@phosphor-icons/react";

const statusMeta: Record<
  TPurchaseStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Pending",
    color: "hongbao-gold",
    icon: <HourglassMediumIcon size={12} weight="fill" />,
  },
  APPROVED: {
    label: "Approved",
    color: "green",
    icon: <CheckCircleIcon size={12} weight="fill" />,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "gray",
    // Same icon as the customer-facing "Declined" badge (OrderStatusBadge).
    icon: <XCircleIcon size={12} weight="fill" />,
  },
};

interface Props {
  status: TPurchaseStatus;
}

/** Admin wording for the raw purchase status. */
const PurchaseStatusBadge: React.FC<Props> = ({ status }) => {
  const meta = statusMeta[status] ?? statusMeta.PENDING;
  return (
    <Badge
      color={meta.color}
      size="sm"
      variant="light"
      radius="sm"
      leftSection={meta.icon}
    >
      {meta.label}
    </Badge>
  );
};

export default PurchaseStatusBadge;
