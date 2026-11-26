"use client";

import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import {
  appliedCouponsAtom,
  cartAtom,
  cartBumpAtom,
  cartDiscountTotalAtom,
  cartSubtotalAtom,
} from "@/store/cart.store";
import {
  getCouponDiscount,
  TAppliedCoupon,
} from "@/app/[locale]/shop/types/coupon.type";
import {
  clampMonths,
  SHOP_DEFAULT_MONTHS,
  TShopProduct,
} from "@/app/[locale]/shop/types/shop.type";
import { TErrorOptions } from "@/types/general.type";
import calculateDiscountPrice from "@/utils/calculateDiscountPrice";
import { showErrorNoti } from "@/utils/notifications-helper";
import { AxiosError } from "axios";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";

/** Lifetime products (flashcard decks) are a single unit, never months. */
const monthsFor = (product: TShopProduct, months: number) =>
  product.lifetime ? 1 : clampMonths(months);

export type TItemPromo = { promo: TAppliedCoupon; discount: number };

type TApplyCouponPayload = { code: string; courseId: string };
type TApplyCouponResponse = { data: TAppliedCoupon };

/**
 * The single entry point for cart reads and writes. Wraps the jotai atoms in
 * `src/store/cart.store.ts` so components never touch storage directly.
 */
const useCart = () => {
  const [items, setItems] = useAtom(cartAtom);
  const [appliedCoupons, setAppliedCoupons] = useAtom(appliedCouponsAtom);
  const subtotal = useAtomValue(cartSubtotalAtom);
  const discountTotal = useAtomValue(cartDiscountTotalAtom);
  const [bump, setBump] = useAtom(cartBumpAtom);

  const { mutateAsync: applyCoupon, isPending: isApplyingPromo } =
    useMutationQuery<TApplyCouponResponse, TApplyCouponPayload>({
      url: "coupon/apply",
    });

  const { mutate: removeCoupon, isPending: isRemovingPromo } = useMutationQuery<
    unknown,
    TApplyCouponPayload
  >({
    url: "coupon/apply",
    method: "delete",
  });

  const bumpCart = useCallback(() => setBump((n) => n + 1), [setBump]);

  /** Applied coupon + resulting discount for each item that has one, keyed by product id. */
  const itemPromos = useMemo(() => {
    const map: Record<string, TItemPromo> = {};
    items.forEach(({ product, months }) => {
      if (product.isFree) return;
      const coupon = appliedCoupons[product.id];
      if (!coupon) return;
      const m = months ?? 1;
      const lineSubtotal =
        calculateDiscountPrice(product.price, product.discount) * m;
      map[product.id] = {
        promo: coupon,
        discount: getCouponDiscount(coupon, lineSubtotal),
      };
    });
    return map;
  }, [items, appliedCoupons]);

  const promoTotal = useMemo(
    () => Object.values(itemPromos).reduce((sum, p) => sum + p.discount, 0),
    [itemPromos],
  );

  const total = Math.max(subtotal - promoTotal, 0);

  const isInCart = useCallback(
    (id: string) => items.some((i) => i.product.id === id),
    [items],
  );

  const addItem = useCallback(
    (product: TShopProduct, months: number = SHOP_DEFAULT_MONTHS) => {
      const exists = items.some((i) => i.product.id === product.id);
      setItems((prev) =>
        exists
          ? prev
          : [...prev, { product, months: monthsFor(product, months) }],
      );
      if (!exists) bumpCart();
    },
    [items, setItems, bumpCart],
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((i) => i.product.id !== id));
      setAppliedCoupons((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [setItems, setAppliedCoupons],
  );

  const toggleItem = useCallback(
    (product: TShopProduct, months: number = SHOP_DEFAULT_MONTHS) => {
      const exists = items.some((i) => i.product.id === product.id);
      setItems((prev) =>
        exists
          ? prev.filter((i) => i.product.id !== product.id)
          : [...prev, { product, months: monthsFor(product, months) }],
      );
      if (!exists) bumpCart();
    },
    [items, setItems, bumpCart],
  );

  /** Update the access duration (1-12 months) for a line already in the cart. */
  const setItemMonths = useCallback(
    (id: string, months: number) => {
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === id
            ? { ...i, months: monthsFor(i.product, months) }
            : i,
        ),
      );
    },
    [setItems],
  );

  /**
   * Validates `input` against the `coupon/apply` endpoint for a single cart
   * line (`id` doubles as the course id). Stores the returned coupon and
   * returns `{ ok: true }` on success, `{ ok: false, error }` otherwise.
   */
  const applyItemPromo = useCallback(
    async (id: string, input: string) => {
      const code = input.trim();
      if (!code) {
        return { ok: false as const, error: "Enter a promo code." };
      }
      try {
        const res = await applyCoupon({ code, courseId: id });
        setAppliedCoupons((prev) => ({ ...prev, [id]: res.data }));
        return { ok: true as const, promo: res.data };
      } catch (e) {
        const apiError = e as AxiosError<TErrorOptions>;
        return {
          ok: false as const,
          error: apiError.response?.data?.message || "That code isn't valid.",
        };
      }
    },
    [applyCoupon, setAppliedCoupons],
  );

  /**
   * Releases the coupon applied to a cart line via the `coupon/apply`
   * endpoint (same payload as applying, called with DELETE) and clears it
   * from state once the backend confirms.
   */
  const removeItemPromo = useCallback(
    (id: string) => {
      const coupon = appliedCoupons[id];
      if (!coupon) return;
      removeCoupon(
        { code: coupon.code, courseId: id },
        {
          onSuccess: () => {
            setAppliedCoupons((prev) => {
              if (!(id in prev)) return prev;
              const next = { ...prev };
              delete next[id];
              return next;
            });
          },
          onError: (e) => {
            const apiError = e as AxiosError<TErrorOptions>;
            showErrorNoti(apiError.response?.data?.message);
          },
        },
      );
    },
    [appliedCoupons, removeCoupon, setAppliedCoupons],
  );

  const getItemPromo = useCallback(
    (id: string): TItemPromo | null => itemPromos[id] ?? null,
    [itemPromos],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupons({});
  }, [setItems, setAppliedCoupons]);

  return {
    items,
    count: items.length,
    bump,
    subtotal,
    discountTotal,
    promoTotal,
    getItemPromo,
    applyItemPromo,
    removeItemPromo,
    isApplyingPromo,
    isRemovingPromo,
    total,
    isInCart,
    addItem,
    removeItem,
    toggleItem,
    setItemMonths,
    clearCart,
  };
};

export default useCart;
