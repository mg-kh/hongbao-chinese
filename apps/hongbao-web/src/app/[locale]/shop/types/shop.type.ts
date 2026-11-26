import type { ProductType } from "@repo/shared";

export type ShopProductType = Exclude<ProductType, "all">;

/** Shared fields of every item returned by `shop/all-products`. */
type TShopProductResBase = {
  id: string;
  title: string;
  description: string;
  /** Price for `perTime` months of access. */
  price: number;
  perTime: number;
  discount?: number;
  createdAt: string;
  category: {
    id: string;
    name: string;
  } | null;
};

export type TShopProductRes =
  | (TShopProductResBase & {
      type: "course";
      isFree: boolean;
      includedAssets: string[];
    })
  | (TShopProductResBase & {
      type: "mock-test";
      testCount: number;
    })
  | (TShopProductResBase & {
      type: "flashcard";
      /** Number of cards in the deck. */
      cardCount: number;
    });

export type TShopOverviewRes = {
  productCount: number;
  courseCount: number;
  mockTestCount: number;
  flashcardCount: number;
};

export type TShopProduct = {
  id: string;
  type: ShopProductType;
  title: string;
  description: string;
  /** "HSK 1" … "HSK 5" - empty string when the product isn't tied to a level. */
  level: string;
  /** Price for a single month of access. Longer durations are `price * months`. */
  price: number;
  /** Percent off, 0 when there's no discount. */
  discount: number;
  isFree?: boolean;
  includedAssets?: string[];
  /** Number of tests bundled in a mock-test product. */
  testCount?: number;
  /** Number of cards in a flashcard deck. */
  cardCount?: number;
  /**
   * One-off purchase with lifetime access (flashcard decks): `price` is the
   * full price and the cart keeps it at a single unit instead of months.
   */
  lifetime?: boolean;
  /** Detail page link - courses point at `/course-detail/:id`. */
  detailHref?: string;
};

export type TCartItem = {
  product: TShopProduct;
  /** Chosen access duration in months (1-12). */
  months: number;
};

export const SHOP_MIN_MONTHS = 1;
export const SHOP_MAX_MONTHS = 12;
export const SHOP_DEFAULT_MONTHS = 1;

/** Snaps any input to a whole number of months within 1-12. */
export const clampMonths = (n: number): number => {
  const rounded = Math.round(n);
  if (!Number.isFinite(rounded) || rounded < SHOP_MIN_MONTHS) {
    return SHOP_MIN_MONTHS;
  }
  return Math.min(SHOP_MAX_MONTHS, rounded);
};

/** 1-12 - labels are translated at render time (see `MonthSelect`). */
export const MONTH_VALUES = Array.from(
  { length: SHOP_MAX_MONTHS },
  (_, i) => i + 1,
);

/**
 * Translation keys (under `Shop.Types`) for each product type's singular and
 * plural label.
 */
export const SHOP_TYPE_META: Record<
  ShopProductType,
  {
    labelKey: "course" | "mock_test" | "flashcard";
    pluralKey: "courses" | "mock_tests" | "flashcards";
  }
> = {
  course: { labelKey: "course", pluralKey: "courses" },
  "mock-test": { labelKey: "mock_test", pluralKey: "mock_tests" },
  flashcard: { labelKey: "flashcard", pluralKey: "flashcards" },
};
