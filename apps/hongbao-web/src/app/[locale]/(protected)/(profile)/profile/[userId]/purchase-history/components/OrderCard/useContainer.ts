"use client";

import { currencyFormatter } from "@/utils/currencyFormatter";
import { useDisclosure } from "@mantine/hooks";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { TPurchaseOrder } from "../../../types/purchase-history.type";

export const money = (value: number, currency = "MMK") =>
  value <= 0 ? "Free" : currencyFormatter({ value, currencySample: currency });

type OrderAction = { label: string; href: string; variant: "filled" | "light" };

const useContainer = (order: TPurchaseOrder) => {
  const { userId } = useParams();
  const [expanded, { toggle }] = useDisclosure(false);

  /** The one action most useful for an order in this state. */
  const primaryAction = useMemo<OrderAction>(() => {
    const firstCourse = order.items.find((i) => i.type === "course");

    if (order.status === "APPROVED" && firstCourse?.productId) {
      return {
        label: "Start learning",
        href: `/profile/${userId}/learn/${firstCourse.productId}`,
        variant: "filled",
      };
    }
    if (order.status === "EXPIRED") {
      return { label: "Renew access", href: "/shop", variant: "filled" };
    }
    if (order.status === "REJECTED") {
      return { label: "Try again", href: "/shop", variant: "filled" };
    }
    // PENDING, or an APPROVED order with no course item
    return { label: "Buy again", href: "/shop", variant: "light" };
  }, [order, userId]);

  return { expanded, toggle, primaryAction };
};

export default useContainer;
