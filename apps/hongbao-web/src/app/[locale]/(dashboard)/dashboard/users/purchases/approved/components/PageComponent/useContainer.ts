import useApiQuery from "@/hooks/fetching/useApiQuery";
import { usePathname } from "@/i18n/navigation";
import { useState } from "react";
import usePurchaseList from "../../../hooks/usePurchaseList";
import { TPurchaseCourseRes } from "../../../types/purchases.type";

const useContainer = () => {
  const pathname = usePathname();
  const { pendingCount } = usePurchaseList();
  const [params, setParams] = useState({ limit: "10", page: 1, search: "" });
  const { data, isLoading } = useApiQuery<
    { data: TPurchaseCourseRes },
    TPurchaseCourseRes
  >({
    url: `dashboard/purchases/approved`,
    params: {
      ...params,
    },
    select: (res) => res.data,
  });

  const handleSearch = (value: string) => {
    setParams((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const handleSearchClear = () => {
    setParams((prev) => ({
      ...prev,
      search: "",
    }));
  };

  return {
    pathname,
    pendingCount,
    approvedList: data?.items || [],
    isLoading,
    params,
    setParams,
    totalPages: data?.totalPage || 1,
    handleSearch,
    handleSearchClear,
  };
};

export default useContainer;
