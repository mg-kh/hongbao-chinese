import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useState } from "react";
import { TPurchaseRes } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/types/purchases.type";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";

const useContainer = () => {
  const [params, setParams] = useState({
    limit: DEFAULT_PAGE_SIZE,
    page: 1,
    search: "",
    start_date: "",
    end_date: "",
  });
  const { data, isLoading } = useApiQuery<{ data: TPurchaseRes }, TPurchaseRes>(
    {
      url: `dashboard/purchases/pending-approved`,
      select: (data) => data?.data,
      key: "purchase-pending-approved-list",
      params: {
        ...params,
      },
    },
  );

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
    pendingList: data?.items || [],
    isLoading,
    params,
    setParams,
    totalPages: data?.totalPage || 1,
    handleSearch,
    handleSearchClear,
  };
};

export default useContainer;
