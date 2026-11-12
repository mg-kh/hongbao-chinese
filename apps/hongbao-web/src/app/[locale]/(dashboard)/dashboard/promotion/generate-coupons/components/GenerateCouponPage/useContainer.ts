import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TCouponRes } from "../../types/coupon.type";

const useContainer = () => {
  const { open, opened } = useEditDrawer();

  const { data: coupons, isLoading } = useApiQuery<
    { data: TCouponRes[] },
    TCouponRes[]
  >({
    url: `dashboard/coupon`,
    key: "coupon",
    select: (data) => data?.data,
  });
  return { open, opened, coupons, isLoading };
};

export default useContainer;
