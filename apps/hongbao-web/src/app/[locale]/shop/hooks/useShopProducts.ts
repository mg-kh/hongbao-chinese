import useApiQuery from "@/hooks/fetching/useApiQuery";
import { keepPreviousData } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  ShopProductType,
  TShopProduct,
  TShopProductRes,
} from "../types/shop.type";
import { is } from "zod/v4/locales";

type Filters = {
  type: "all" | ShopProductType;
  /** Category (HSK level) id - `null` for every category. */
  categoryId: string | null;
};

/**
 * The storefront catalogue: courses and mock tests from the `shop/all-products`
 * API, normalised to `TShopProduct` so the listing, cart, and checkout only deal
 * with one shape. Type and category are filtered server-side.
 */
const useShopProducts = ({ type, categoryId }: Filters) => {
  const {
    data: productRes,
    isLoading,
    isFetching,
  } = useApiQuery<{ data: TShopProductRes[] }, TShopProductRes[]>({
    url: `shop/all-products`,
    params: { type, ...(categoryId ? { categoryId } : {}) },
    select: (data) => data?.data,
    // Keep showing the previous result while a new filter loads.
    placeholderData: keepPreviousData,
  });

  const products = useMemo<TShopProduct[]>(
    () =>
      (productRes ?? []).map((p) => ({
        id: p.id,
        type: p.type,
        title: p.title,
        description: p.description ?? "",
        level: p.category?.name ?? "",
        // The API price covers `perTime` months; the store sells by the month.
        price:
          p.perTime && p.perTime > 1
            ? Math.round(p.price / p.perTime)
            : p.price,
        discount: p.discount ?? 0,
        ...(p.type === "course"
          ? {
              isFree: p.isFree,
              includedAssets: p.includedAssets ?? [],
              detailHref: `/course-detail/${p.id}`,
            }
          : {
              isFree: p.price === 0,
              testCount: p.testCount,
            }),
      })),
    [productRes],
  );

  return { products, isLoading, isFetching };
};

export default useShopProducts;
