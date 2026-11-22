import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useState } from "react";
import { TPurchaseRes } from "../../../types/purchases.type";

const useContainer = () => {
  const [params, setParams] = useState({
    limit: "10",
    page: 1,
    search: "",
    start_date: "",
    end_date: "",
  });
  const { data, isLoading } = useApiQuery<{ data: TPurchaseRes }, TPurchaseRes>(
    {
      url: `dashboard/purchases/rejected`,
      key: "purchase-rejected-list",
      params: {
        ...params,
      },
      select: (res) => res?.data,
    },
  );

  // Filters change the result set, so always restart from page 1.
  const handleSearch = (value: string) => {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  };
  const handleSearchClear = () => {
    setParams((prev) => ({ ...prev, search: "", page: 1 }));
  };
  const handleDateChange = (start_date: string, end_date: string) => {
    setParams((prev) => ({ ...prev, start_date, end_date, page: 1 }));
  };
  const handleLimitChange = (limit: string) => {
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  };
  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  return {
    rejectedList: data?.items || [],
    isLoading,
    params,
    totalPages: data?.totalPage || 1,
    handleSearch,
    handleSearchClear,
    handleDateChange,
    handleLimitChange,
    handlePageChange,
  };
};

export default useContainer;
