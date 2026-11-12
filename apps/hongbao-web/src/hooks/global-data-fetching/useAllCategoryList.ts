import { useMemo } from "react";
import useApiQuery from "../fetching/useApiQuery";

export type TCategory = {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
};

/** Public category list (`all-categories`), used to populate filters. */
const useAllCategoryList = () => {
  const { data: categories, isLoading } = useApiQuery<
    { data: TCategory[] },
    TCategory[]
  >({
    url: `all-categories`,
    key: "all-categories",
    select: (data) => data?.data,
  });

  const categoryOptions = useMemo(
    () => (categories || []).map((c) => ({ label: c.name, value: c.id })),
    [categories],
  );

  return {
    categories: categories || [],
    categoryOptions,
    isLoading,
  };
};

export default useAllCategoryList;
