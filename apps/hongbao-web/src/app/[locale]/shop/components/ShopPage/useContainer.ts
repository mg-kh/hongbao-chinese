"use client";

import useAllCategoryList from "@/hooks/global-data-fetching/useAllCategoryList";
import calculateDiscountPrice from "@/utils/calculateDiscountPrice";
import { useDisclosure } from "@mantine/hooks";
import { useDeferredValue, useMemo, useState } from "react";
import useShopOverview from "../../hooks/useShopOverview";
import useShopProducts from "../../hooks/useShopProducts";
import { ShopProductType, TShopProduct } from "../../types/shop.type";
import { pickFlashDeals, productSold } from "../../utils/productSignals";

export type ShopTypeFilter = "all" | ShopProductType;
export type ShopSort = "relevance" | "top-sales" | "price-low" | "price-high";

const priceOf = (p: TShopProduct) =>
  p.isFree ? 0 : calculateDiscountPrice(p.price, p.discount);

const useContainer = (initialType: ShopTypeFilter) => {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  // `initialType` comes from `?type=` (the homepage "See all courses" link).
  const [type, setType] = useState<ShopTypeFilter>(initialType);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sort, setSort] = useState<ShopSort>("relevance");
  const [drawerOpened, drawer] = useDisclosure(false);

  // Type and category are filtered by the API; search, sale and sort stay client-side.
  const { products, isFetching } = useShopProducts({ type, categoryId });
  const { categoryOptions } = useAllCategoryList();
  const { typeCounts } = useShopOverview();

  const toggleCategory = (id: string) =>
    setCategoryId((prev) => (prev === id ? null : id));

  const clearFilters = () => {
    setType("all");
    setCategoryId(null);
    setOnSaleOnly(false);
    setSearch("");
    setSort("relevance");
  };

  const flashDeals = useMemo(() => pickFlashDeals(products), [products]);

  const results = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();

    const filtered = products.filter((p) => {
      const matchesSale = !onSaleOnly || (!p.isFree && p.discount > 0);
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesSale && matchesSearch;
    });

    const sorted = [...filtered];
    if (sort === "price-low") sorted.sort((a, b) => priceOf(a) - priceOf(b));
    else if (sort === "price-high")
      sorted.sort((a, b) => priceOf(b) - priceOf(a));
    else if (sort === "top-sales")
      sorted.sort((a, b) => productSold(b.id) - productSold(a.id));
    else
      sorted.sort(
        (a, b) => b.discount - a.discount || a.title.localeCompare(b.title),
      );

    return sorted;
  }, [products, deferredSearch, onSaleOnly, sort]);

  const activeFilterCount =
    (type !== "all" ? 1 : 0) + (categoryId ? 1 : 0) + (onSaleOnly ? 1 : 0);

  return {
    isFetching,
    search,
    setSearch,
    type,
    setType,
    categoryId,
    toggleCategory,
    onSaleOnly,
    setOnSaleOnly,
    sort,
    setSort,
    clearFilters,
    typeCounts,
    categoryOptions,
    flashDeals,
    results,
    total: results.length,
    activeFilterCount,
    drawerOpened,
    openDrawer: drawer.open,
    closeDrawer: drawer.close,
  };
};

export default useContainer;
