import { TShopProduct } from "../types/shop.type";

/**
 * Deterministic pseudo-stats for the storefront. There's no ratings/orders
 * endpoint yet, so "sold" counts and star ratings are derived from the product
 * id - the same id always yields the same numbers, so nothing flickers between
 * renders. Swap these for real fields on `TShopProduct` once the API has them.
 */
const hash = (input: string): number => {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

/** 4.3 - 5.0, rounded to one decimal. */
export const productRating = (id: string): number =>
  Math.round((4.3 + (hash(`${id}:rating`) % 8) / 10) * 10) / 10;

/** A believable "units sold" number, 40 - ~4,600. */
export const productSold = (id: string): number =>
  40 + (hash(`${id}:sold`) % 4560);

/** 8 - 92 - how much of the flash-sale batch is gone. */
export const productClaimedPct = (id: string): number =>
  8 + (hash(`${id}:claimed`) % 85);

export const formatCompact = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);

/** Products with a live discount, deepest markdown first - powers Flash Deals. */
export const pickFlashDeals = (products: TShopProduct[]): TShopProduct[] =>
  products
    .filter((p) => !p.isFree && p.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 10);
