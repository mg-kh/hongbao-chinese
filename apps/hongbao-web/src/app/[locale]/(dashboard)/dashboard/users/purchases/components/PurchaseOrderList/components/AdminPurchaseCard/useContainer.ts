import { TPurchase } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/types/purchases.type";
import { toPurchaseCardOrder } from "@/utils/purchaseOrder";
import { format, formatDistanceToNow } from "date-fns";
import { useMemo } from "react";

// TODO: replace with the uploaded payment slip once checkout stores one.
export const TRANSACTION_IMAGE = "https://placehold.co/400x800/png";

const useContainer = (purchase: TPurchase) => {
  const order = useMemo(() => toPurchaseCardOrder(purchase), [purchase]);

  return {
    order,
    subtitle: `${purchase.user?.name || "-"} · ${format(purchase.createdAt, "d MMM yyyy, hh:mm a")}`,
    orderedAt: format(purchase.createdAt, "dd-MM-yyyy hh:mm:ss a"),
    orderedAgo: formatDistanceToNow(new Date(purchase.createdAt), {
      addSuffix: true,
    }),
    approvedAt: purchase.paidAt
      ? format(purchase.paidAt, "dd-MM-yyyy hh:mm:ss a")
      : null,
  };
};

export default useContainer;
