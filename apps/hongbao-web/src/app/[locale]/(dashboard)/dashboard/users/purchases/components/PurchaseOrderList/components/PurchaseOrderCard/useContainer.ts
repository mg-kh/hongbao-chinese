import { TPurchaseOrderGroup } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/PurchaseOrderList/useContainer";
import { useDisclosure } from "@mantine/hooks";
import { first } from "lodash";

const useContainer = (order: TPurchaseOrderGroup) => {
  const [expanded, { toggle }] = useDisclosure(false);

  /** Order-level fields (user, payment, date) are the same on every line. */
  const summary = first(order.items);

  return { expanded, toggle, summary };
};

export default useContainer;
