import { useDisclosure } from "@mantine/hooks";
import { TPurchaseCardOrder } from "@/types/purchase-order.type";
import { useTranslations } from "next-intl";

const useContainer = (order: TPurchaseCardOrder) => {
  const [expanded, { toggle }] = useDisclosure(false);
  const t = useTranslations("Shared.PurchaseOrderCard");

  /** "KBZPAY · Txn 123456", or a placeholder when nothing was recorded. */
  const payment =
    [
      order.paymentType?.toUpperCase(),
      order.transactionNo && t("txn", { number: order.transactionNo }),
    ]
      .filter(Boolean)
      .join(" · ") || t("no_payment_info");

  return {
    expanded,
    toggle,
    payment,
    hasDiscount: order.subtotal > order.total,
  };
};

export default useContainer;
