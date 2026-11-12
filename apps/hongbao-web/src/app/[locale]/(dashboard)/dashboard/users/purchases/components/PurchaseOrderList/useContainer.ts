import { TPurchaseCourse } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/types/purchases.type";
import { useMemo } from "react";

export type TPurchaseOrderGroup = {
  orderNo: string;
  items: TPurchaseCourse[];
};

/**
 * Groups enrollment rows into orders by `orderNo`, keeping the order the
 * first row of each appears in. Rows without an order number stand alone.
 */
const useContainer = (rows: TPurchaseCourse[]) => {
  const orders = useMemo<TPurchaseOrderGroup[]>(() => {
    const map = new Map<string, TPurchaseCourse[]>();
    rows.forEach((row) => {
      const key = row?.orderNo || row?.id;
      map.set(key, [...(map.get(key) ?? []), row]);
    });
    return Array.from(map, ([orderNo, items]) => ({ orderNo, items }));
  }, [rows]);

  return { orders };
};

export default useContainer;
