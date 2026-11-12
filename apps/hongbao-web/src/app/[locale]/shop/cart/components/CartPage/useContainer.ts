"use client";

import useCart from "@/hooks/useCart";
import { useRouter } from "@/i18n/navigation";
import { useMounted } from "@mantine/hooks";
import { useState } from "react";

const useContainer = () => {
  const cart = useCart();
  const mounted = useMounted();
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const goToCheckout = () => router.push("/shop/checkout");

  return {
    ...cart,
    // Cart lives in localStorage - hold the empty state until we've hydrated.
    isReady: mounted,
    goToCheckout,
    agreedToTerms,
    setAgreedToTerms,
  };
};

export default useContainer;
