import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { useState } from "react";
import {
  TPurchase,
  TPurchaseRes,
} from "@/app/[locale]/(dashboard)/dashboard/users/purchases/types/purchases.type";
import { modals } from "@mantine/modals";
import { PurchaseApproveRequest, PurchaseRejectRequest } from "@repo/shared";
import { createElement } from "react";
import RejectModal from "../RejectModal/RejectModal";

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
      url: `dashboard/purchases/pending-approved`,
      select: (data) => data?.data,
      key: "purchase-pending-approved-list",
      params: {
        ...params,
      },
    },
  );
  const {
    mutate: approve,
    isPending: isApproving,
    variables: approveVars,
  } = useMutationQuery<unknown, PurchaseApproveRequest>({
    url: `dashboard/purchases/purchase-approve`,
    invalidateKeys: [
      "purchase-pending-approved-list",
      "purchase-approved-list",
      "purchase-list-count",
    ],
  });
  const {
    mutate: reject,
    isPending: isRejecting,
    variables: rejectVars,
  } = useMutationQuery<unknown, PurchaseRejectRequest>({
    url: `dashboard/purchases/purchase-reject`,
    invalidateKeys: [
      "purchase-pending-approved-list",
      "purchase-rejected-list",
      "purchase-list-count",
    ],
  });
  /** Id of the order with a request in flight, so only its buttons spin. */
  const busyId =
    (isApproving && approveVars?.purchaseId) ||
    (isRejecting && rejectVars?.purchaseId) ||
    null;
  const handleApprove = (payload: PurchaseApproveRequest) => {
    approve(payload, {
      onSuccess: () => {
        showSuccessNoti();
      },
      onError: (e: TErrorOptions) => {
        showErrorNoti(e.message);
      },
    });
  };
  const handleReject = (payload: PurchaseRejectRequest) => {
    reject(payload, {
      onSuccess: () => {
        showSuccessNoti();
      },
      onError: (e: TErrorOptions) => {
        showErrorNoti(e.message);
      },
    });
  };
  const confirmReject = (purchase: TPurchase) => {
    const modalId = modals.open({
      title: "Reject order",
      centered: true,
      children: createElement(RejectModal, {
        purchase,
        onCancel: () => modals.close(modalId),
        onSubmit: (reason: string) => {
          handleReject({ purchaseId: purchase.id, reason });
          modals.close(modalId);
        },
      }),
    });
  };
  const confirmApprove = (purchase: TPurchase) => {
    const products = purchase.items
      .map(
        (item) =>
          item.course?.title || item.mockTest?.title || item.productName,
      )
      .join(", ");
    const openModal = modals.openConfirmModal({
      title: "Are you sure?",
      closeOnConfirm: false,
      centered: true,
      children: `Approve order ${purchase.orderNo} (${products || "no items"}) for ${purchase.user?.name ?? "this user"}?`,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "green" },
      onConfirm: () => {
        handleApprove({ purchaseId: purchase.id });
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
    pendingList: data?.items || [],
    isLoading,
    handleApprove,
    confirmApprove,
    confirmReject,
    busyId,
    params,
    setParams,
    totalPages: data?.totalPage || 1,
    handleSearch,
    handleSearchClear,
  };
};

export default useContainer;
