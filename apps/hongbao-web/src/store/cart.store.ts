import calculateDiscountPrice from "@/utils/calculateDiscountPrice";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { TCartItem } from "@/app/[locale]/shop/types/shop.type";
import { TAppliedCoupon } from "@/app/[locale]/shop/types/coupon.type";

/**
 * Client-side cart. There's no cart API yet, so it lives in `localStorage`
 * and is shared across tabs. `getOnInit` reads the stored value synchronously
 * so a hard refresh doesn't flash an empty cart.
 */
export const cartAtom = atomWithStorage<TCartItem[]>(
  "hongbao-cart",
  [],
  undefined,
  { getOnInit: true },
);

/**
 * Coupon applied to each cart item, keyed by product id. Populated from the
 * `coupon/apply` endpoint response (see `useCart`) so the discount can be
 * recalculated locally (e.g. when months change) without re-hitting it.
 */
export const appliedCouponsAtom = atomWithStorage<Record<string, TAppliedCoupon>>(
  "hongbao-applied-coupons",
  {},
  undefined,
  { getOnInit: true },
);

export const cartCountAtom = atom((get) => get(cartAtom).length);

/**
 * Increments every time an item is added to the cart. `CartButton` keys an
 * inner element off this so its bounce animation restarts on every add.
 */
export const cartBumpAtom = atom(0);

/** Sum of every line (per-month price after its own discount × chosen months). */
export const cartSubtotalAtom = atom((get) =>
  get(cartAtom).reduce((sum, { product, months }) => {
    if (product.isFree) return sum;
    const m = months ?? 1;
    return sum + calculateDiscountPrice(product.price, product.discount) * m;
  }, 0),
);

/** Total amount saved versus the undiscounted prices, across all months. */
export const cartDiscountTotalAtom = atom((get) =>
  get(cartAtom).reduce((sum, { product, months }) => {
    if (product.isFree) return sum;
    const m = months ?? 1;
    const perMonthSaving =
      product.price - calculateDiscountPrice(product.price, product.discount);
    return sum + perMonthSaving * m;
  }, 0),
);
