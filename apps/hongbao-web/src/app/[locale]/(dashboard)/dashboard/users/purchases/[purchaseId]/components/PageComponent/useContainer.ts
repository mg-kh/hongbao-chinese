import usePurchaseActions from "@/app/[locale]/(dashboard)/dashboard/users/purchases/hooks/usePurchaseActions";
import {
  TPurchaseDetail,
  TPurchaseStatus,
} from "@/app/[locale]/(dashboard)/dashboard/users/purchases/types/purchases.type";
import {
  PURCHASES_APPROVED,
  PURCHASES_PENDING,
  PURCHASES_REJECTED,
} from "@/constants/DashboardRoutes";
import useApiQuery from "@/hooks/fetching/useApiQuery";
import { money, toPurchaseCardOrder } from "@/utils/purchaseOrder";
import { format, formatDistanceToNow } from "date-fns";
import { useParams } from "next/navigation";
import { useMemo } from "react";

/** The list each status lives in - where "back" goes. */
const listByStatus: Record<TPurchaseStatus, { label: string; href: string }> = {
  PENDING: { label: "Pending List", href: PURCHASES_PENDING },
  APPROVED: { label: "Approved", href: PURCHASES_APPROVED },
  CANCELLED: { label: "Rejected", href: PURCHASES_REJECTED },
};

const fullDate = (value: string) => format(value, "dd MMM yyyy, hh:mm:ss a");
const ago = (value: string) =>
  formatDistanceToNow(new Date(value), { addSuffix: true });

const useContainer = () => {
  const { purchaseId } = useParams<{ purchaseId: string }>();

  const {
    data: purchase,
    isLoading,
    isError,
  } = useApiQuery<{ data: TPurchaseDetail }, TPurchaseDetail>({
    url: `dashboard/purchases/${purchaseId}`,
    key: ["purchase-detail", purchaseId],
    enabled: !!purchaseId,
    select: (res) => res?.data,
  });

  const { confirmApprove, confirmReject, busyId } = usePurchaseActions();

  const order = useMemo(
    () => (purchase ? toPurchaseCardOrder(purchase) : null),
    [purchase],
  );

  const timeline = useMemo(() => {
    if (!purchase) return [];
    const steps = [
      {
        label: "Ordered",
        at: fullDate(purchase.createdAt),
        ago: ago(purchase.createdAt),
      },
    ];
    if (purchase.paidAt) {
      steps.push({
        label: "Approved",
        at: fullDate(purchase.paidAt),
        ago: ago(purchase.paidAt),
      });
    }
    if (purchase.status === "CANCELLED") {
      // No dedicated timestamp; the reject is the last write to the order.
      steps.push({
        label: "Rejected",
        at: fullDate(purchase.updatedAt),
        ago: ago(purchase.updatedAt),
      });
    }
    return steps;
  }, [purchase]);

  const itemRows = useMemo(() => {
    if (!purchase || !order) return [];
    return order.items.map((item, index) => {
      const raw = purchase.items[index];
      return {
        item,
        checkoutName:
          raw && raw.productName !== item.title ? raw.productName : undefined,
        lineTotal: money(item.lineTotal, order.currency),
        unitBreakdown:
          raw && item.quantity > 1
            ? `${money(raw.price, order.currency)} × ${item.quantity}`
            : undefined,
      };
    });
  }, [purchase, order]);

  const totals = order
    ? {
        subtotal: money(order.subtotal, order.currency),
        discount: `-${money(order.subtotal - order.total, order.currency)}`,
        total: money(order.total, order.currency),
        hasDiscount: order.subtotal > order.total,
      }
    : null;

  return {
    purchase,
    itemRows,
    totals,
    isLoading,
    isError,
    list: listByStatus[purchase?.status ?? "PENDING"],
    timeline,
    isPending: purchase?.status === "PENDING",
    isBusy: !!purchase && busyId === purchase.id,
    handleApprove: () => purchase && confirmApprove(purchase),
    handleReject: () => purchase && confirmReject(purchase),
  };
};

export default useContainer;
