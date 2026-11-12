import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import { usePathname } from "@/i18n/navigation";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { useState } from "react";
import usePurchaseList from "../../../hooks/usePurchaseList";
import {
  TPurchaseCourse,
  TPurchaseCourseRes,
} from "../../../types/purchases.type";
import { modals } from "@mantine/modals";

const useContainer = () => {
  const pathname = usePathname();
  const { pendingCount } = usePurchaseList();
  const [params, setParams] = useState({
    limit: "10",
    page: 1,
    search: "",
    start_date: "",
    end_date: "",
  });
  const { data, isLoading } = useApiQuery<
    { data: TPurchaseCourseRes },
    TPurchaseCourseRes
  >({
    url: `dashboard/purchases/pending-approved`,
    select: (data) => data?.data,
    key: "purchase-pending-approved-list",
    params: {
      ...params,
    },
  });
  const { mutate: approve } = useMutationQuery({
    url: `dashboard/purchases/purchase-approve`,
    invalidateKeys: ["purchase-pending-approved-list", "purchase-list-count"],
  });
  const handleApprove = ({
    enrollmentId,
    courseId,
  }: {
    enrollmentId: string;
    courseId: string;
  }) => {
    approve(
      {
        enrollmentId,
        courseId,
      },
      {
        onSuccess: () => {
          showSuccessNoti();
        },
        onError: (e: TErrorOptions) => {
          showErrorNoti(e.message);
        },
      },
    );
  };
  const confirmApprove = (item: TPurchaseCourse) => {
    const openModal = modals.openConfirmModal({
      title: "Are you sure?",
      closeOnConfirm: false,
      centered: true,
      children: `Approve "${item?.course?.title ?? "this course"}" for ${item?.user?.name ?? "this user"}?`,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "green" },
      onConfirm: () => {
        handleApprove({ enrollmentId: item?.id, courseId: item?.courseId });
        modals.close(openModal);
      },
    });
  };

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
    open,
    pathname,
    pendingCount,
    pendingList: data?.items || [],
    isLoading,
    handleApprove,
    confirmApprove,
    params,
    setParams,
    totalPages: data?.totalPage || 1,
    handleSearch,
    handleSearchClear,
  };
};

export default useContainer;
