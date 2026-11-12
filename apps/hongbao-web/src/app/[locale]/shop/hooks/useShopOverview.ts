import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useMemo } from "react";
import { ShopProductType, TShopOverviewRes } from "../types/shop.type";

/** Product counts per type (`shop/product-overview`) - shown on the category filter. */
const useShopOverview = () => {
  const { data: overview, isLoading } = useApiQuery<
    { data: TShopOverviewRes },
    TShopOverviewRes
  >({
    url: `shop/product-overview`,
    select: (data) => data?.data,
  });

  const typeCounts = useMemo<Record<"all" | ShopProductType, number>>(
    () => ({
      all: overview?.productCount ?? 0,
      course: overview?.courseCount ?? 0,
      "level-test": overview?.levelTestCount ?? 0,
    }),
    [overview],
  );

  return { typeCounts, isLoading };
};

export default useShopOverview;
