"use client";

import useCart from "@/hooks/useCart";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

const useContainer = (productId: string) => {
  const {
    getItemPromo,
    applyItemPromo,
    removeItemPromo,
    isApplyingPromo,
    isRemovingPromo,
  } = useCart();
  const [promoOpen, { toggle: togglePromo, close: closePromo }] =
    useDisclosure(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const itemPromo = getItemPromo(productId);

  const apply = async () => {
    const res = await applyItemPromo(productId, code);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setError(null);
    setCode("");
  };

  const remove = () => {
    removeItemPromo(productId);
    setError(null);
    closePromo();
  };

  return {
    itemPromo,
    promoOpen,
    togglePromo,
    code,
    setCode: (v: string) => {
      setCode(v);
      if (error) setError(null);
    },
    error,
    apply,
    remove,
    isApplyingPromo,
    isRemovingPromo,
  };
};

export default useContainer;
