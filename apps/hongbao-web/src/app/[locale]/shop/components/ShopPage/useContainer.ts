"use client";

import useAllCategoryList from "@/hooks/global-data-fetching/useAllCategoryList";
import calculateDiscountPrice from "@/utils/calculateDiscountPrice";
import { useDisclosure } from "@mantine/hooks";
import { useDeferredValue, useMemo, useState } from "react";
import useShopProducts from "@/app/[locale]/shop/hooks/useShopProducts";
import {
  ShopProductType,
  TShopProduct,
} from "@/app/[locale]/shop/types/shop.type";
import {
  pickFlashDeals,
  productSold,
} from "@/app/[locale]/shop/utils/productSignals";

export type ShopTypeFilter = "all" | ShopProductType;
export type ShopSort = "relevance" | "top-sales" | "price-low" | "price-high";

export const SHOP_SORT_OPTIONS: { value: ShopSort; label: string }[] = [
  { value: "relevance", label: "Recommended" },
  { value: "top-sales", label: "Best selling" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

const TYPE_LABELS: Record<ShopProductType, string> = {
  course: "Courses",
  "mock-test": "Mock Tests",
  flashcard: "Flashcards",
};

/** A removable chip shown above the results for each active filter. */
export type TAppliedFilter = { key: string; label: string; remove: () => void };

const isOnSale = (p: TShopProduct) => !p.isFree && p.discount > 0;

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

  const toggleCategory = (id: string) =>
    setCategoryId((prev) => (prev === id ? null : id));

  const clearFilters = () => {
    setType("all");
    setCategoryId(null);
    setOnSaleOnly(false);
    setSearch("");
  };

  const flashDeals = useMemo(() => pickFlashDeals(products), [products]);

  const searched = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [products, deferredSearch]);

  const results = useMemo(() => {
    const filtered = searched.filter((p) => !onSaleOnly || isOnSale(p));

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
  }, [searched, onSaleOnly, sort]);

  const appliedFilters: TAppliedFilter[] = [];
  if (search.trim())
    appliedFilters.push({
      key: "search",
      label: `"${search.trim()}"`,
      remove: () => setSearch(""),
    });
  if (type !== "all")
    appliedFilters.push({
      key: "type",
      label: TYPE_LABELS[type],
      remove: () => setType("all"),
    });
  if (categoryId)
    appliedFilters.push({
      key: "category",
      label:
        categoryOptions.find((o) => o.value === categoryId)?.label ?? "Level",
      remove: () => setCategoryId(null),
    });
  if (onSaleOnly)
    appliedFilters.push({
      key: "sale",
      label: "On sale",
      remove: () => setOnSaleOnly(false),
    });

  // Sort is not a filter, so it isn't counted or cleared with the chips.
  const activeFilterCount = appliedFilters.length;

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
    categoryOptions,
    appliedFilters,
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
