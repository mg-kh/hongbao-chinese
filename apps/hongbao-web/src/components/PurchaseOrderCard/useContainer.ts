import { useDisclosure } from "@mantine/hooks";
import { TPurchaseCardOrder } from "@/types/purchase-order.type";
import { paymentLabel } from "@/utils/purchaseOrder";

const useContainer = (order: TPurchaseCardOrder) => {
  const [expanded, { toggle }] = useDisclosure(false);

  return {
    expanded,
    toggle,
    payment: paymentLabel(order),
    hasDiscount: order.subtotal > order.total,
  };
};

export default useContainer;
