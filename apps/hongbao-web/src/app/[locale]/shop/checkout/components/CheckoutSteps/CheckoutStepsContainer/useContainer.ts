"use client";

import useProfile from "@/hooks/global-data-fetching/useProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CheckoutFormFields,
  CheckoutSchema,
} from "../schema/checkout.schema";

const useContainer = () => {
  const { data: profile } = useProfile();

  const form = useForm<CheckoutFormFields>({
    mode: "onChange",
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      step: 0,
      full_name: "",
      email: "",
      phone: "",
      payment_type: "kpay",
      transaction_no: undefined,
    },
  });

  const { reset, getValues } = form;

  // Prefill identity for signed-in shoppers; still editable.
  useEffect(() => {
    if (!profile) return;
    const current = getValues();
    if (current.full_name || current.email) return;
    reset({
      ...current,
      full_name: profile.name ?? "",
      email: profile.email ?? "",
    });
  }, [profile, reset, getValues]);

  return { form };
};

export default useContainer;
