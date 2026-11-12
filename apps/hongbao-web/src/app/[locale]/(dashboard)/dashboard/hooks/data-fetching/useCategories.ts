import useApiQuery from "@/hooks/fetching/useApiQuery";
import { map } from "lodash";
import { useMemo } from "react";
import { TCategoryRes } from "../../assets/category/types/category.type";

const useCategories = () => {
  const {
    data: categoryRes,
    isLoading,
    isFetching,
  } = useApiQuery<{ data: TCategoryRes[] }, TCategoryRes[]>({
    url: `dashboard/category`,
    key: "category",
    select: (data) => data?.data,
  });

  const categoryDropdownData = useMemo(() => {
    return map(categoryRes, (c) => ({
      label: c.name,
      value: c.id,
    }));
  }, [categoryRes]);

  return {
    data: categoryRes || [],
    categoryDropdownData: categoryDropdownData || [],
    isLoading,
    isFetching,
  };
};

export default useCategories;
