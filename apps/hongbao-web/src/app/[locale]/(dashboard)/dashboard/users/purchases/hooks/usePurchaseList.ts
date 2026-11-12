import useApiQuery from "@/hooks/fetching/useApiQuery";

type TPurchaseListRes = {
  approvedCount: number;
  pendingCount: number;
};

const usePurchaseList = () => {
  const { data } = useApiQuery<{ data: TPurchaseListRes }, TPurchaseListRes>({
    url: `dashboard/purchases/list`,
    select: (data) => data?.data,
    key: "purchase-list-count",
  });
  return {
    approvedCount: data?.approvedCount,
    pendingCount: data?.pendingCount,
  };
};

export default usePurchaseList;
