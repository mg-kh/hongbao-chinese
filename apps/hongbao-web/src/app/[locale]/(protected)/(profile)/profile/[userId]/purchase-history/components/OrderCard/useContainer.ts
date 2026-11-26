"use client";

import { TPurchaseOrder } from "@/app/[locale]/(protected)/(profile)/profile/[userId]/types/purchase-history.type";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";

type OrderAction = { label: string; href: string; variant: "filled" | "light" };

const useContainer = (order: TPurchaseOrder) => {
  const { userId } = useParams();
  const t = useTranslations("Profile.PurchaseHistory.OrderCard");

  /** The one action most useful for an order in this state. */
  const primaryAction = useMemo<OrderAction>(() => {
    const firstCourse = order.items.find((i) => i.type === "course");

    if (order.status === "APPROVED" && firstCourse?.productId) {
      return {
        label: t("start_learning"),
        href: `/profile/${userId}/learn/${firstCourse.productId}`,
        variant: "filled",
      };
    }
    if (order.status === "EXPIRED") {
      return { label: t("renew_access"), href: "/shop", variant: "filled" };
    }
    if (order.status === "CANCELLED") {
      return { label: t("try_again"), href: "/shop", variant: "filled" };
    }
    // PENDING, or an APPROVED order with no course item
    return { label: t("buy_again"), href: "/shop", variant: "light" };
  }, [order, userId, t]);

  return { primaryAction };
};

export default useContainer;
