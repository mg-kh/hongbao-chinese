import { TPurchaseActionTarget } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/hooks/usePurchaseActions";
import {
  durationLabel,
  money,
  paymentLabel,
  toPurchaseCardOrder,
} from "@/utils/purchaseOrder";
import { useMemo } from "react";

const useContainer = (purchase: TPurchaseActionTarget) => {
  const order = useMemo(() => toPurchaseCardOrder(purchase), [purchase]);

  return {
    customer: purchase.user?.name || "this user",
    items: order.items.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      meta: [
        item.type === "mock-test" ? "Mock Test" : "Course",
        durationLabel(item.durationDays),
        item.quantity > 1 ? `×${item.quantity}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      lineTotal: money(item.lineTotal, order.currency),
    })),
    total: money(order.total, order.currency),
    payment: paymentLabel(order),
    hasPayment: !!(order.paymentType || order.transactionNo),
  };
};

export default useContainer;
