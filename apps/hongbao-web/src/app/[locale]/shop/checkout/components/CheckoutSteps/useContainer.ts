"use client";

import useCart from "@/hooks/useCart";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { checkoutSteps } from "./schema/checkout.schema";

const useContainer = (onSubmitted: () => void) => {
  const t = useTranslations("Checkout.CheckoutSteps");
  const form = useFormContext();
  const { control, setValue, getValues, trigger } = form;
  const [opened, { open, close }] = useDisclosure(false);
  const { items, total, clearCart, getItemPromo } = useCart();

  const step = useWatch({ control, name: "step" });
  const values = useWatch({ control });

  const isStepValid = useMemo(
    () => checkoutSteps[step].schema.safeParse(values).success,
    [values, step],
  );

  const nextStep = async () => {
    const valid = await trigger([...checkoutSteps[step].fields]);
    if (!valid) return;
    setValue("step", step < 2 ? step + 1 : step);
  };

  const prevStep = () => setValue("step", step > 0 ? step - 1 : step);

  const { mutate, isPending } = useMutationQuery({
    url: `purchase`,
  });

  const handleConfirm = () => {
    const v = getValues();
    const payload = {
      items: items.map((i) => ({
        productId: i.product.id,
        productType: i.product.type,
        months: i.months ?? 1,
        promoCode: getItemPromo(i.product.id)?.promo.code,
      })),
      totalAmount: total,
      paymentType: v.payment_type,
      transactionNo: v.transaction_no,
      contact: { name: v.full_name, email: v.email, phone: v.phone },
    };
    mutate(payload, {
      onSuccess: () => {
        showSuccessNoti(t("order_received"));
        clearCart();
        close();
        onSubmitted();
      },
      onError: (e: TErrorOptions) => {
        showErrorNoti(e.message);
      },
    });
  };

  return {
    step,
    isStepValid,
    nextStep,
    prevStep,
    setValue,
    opened,
    open,
    close,
    handleConfirm,
    isPending,
  };
};

export default useContainer;
