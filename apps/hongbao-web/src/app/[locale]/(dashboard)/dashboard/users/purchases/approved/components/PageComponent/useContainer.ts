import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useState } from "react";
import { TPurchaseRes } from "../../../types/purchases.type";

const useContainer = () => {
  const [params, setParams] = useState({ limit: "10", page: 1, search: "" });
  const { data, isLoading } = useApiQuery<{ data: TPurchaseRes }, TPurchaseRes>(
    {
      url: `dashboard/purchases/approved`,
      key: "purchase-approved-list",
      params: {
        ...params,
      },
      select: (res) => res.data,
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
