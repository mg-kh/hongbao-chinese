"use client";

import useCart from "@/hooks/useCart";
import { useRouter } from "@/i18n/navigation";
import { useMounted } from "@mantine/hooks";
import { useEffect, useState } from "react";

const useContainer = () => {
  const { count } = useCart();
  const mounted = useMounted();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  // An empty cart has nothing to check out - send them back to browse.
  // Skip the redirect once the order is placed (the cart clears on success).
  useEffect(() => {
    if (mounted && count === 0 && !submitted) {
      router.replace("/shop/cart");
    }
  }, [mounted, count, submitted, router]);

  return {
    isReady: mounted,
    isEmpty: mounted && count === 0 && !submitted,
    submitted,
    onSubmitted: () => setSubmitted(true),
  };
};

export default useContainer;
