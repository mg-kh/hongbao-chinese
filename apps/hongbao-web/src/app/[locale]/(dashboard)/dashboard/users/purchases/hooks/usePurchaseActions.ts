import ApproveModal from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/ApproveModal/ApproveModal";
import RejectModal from "@/app/[locale]/(dashboard)/dashboard/users/purchases/components/RejectModal/RejectModal";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import { TErrorOptions } from "@/types/general.type";
import { TRawPurchase } from "@/types/purchase-order.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { modals } from "@mantine/modals";
import { PurchaseApproveRequest, PurchaseRejectRequest } from "@repo/shared";
import { createElement } from "react";

/** The fields approve / reject need - satisfied by list rows and the detail. */
export type TPurchaseActionTarget = TRawPurchase & {
  user?: { name: string } | null;
};

/** Query keys every approve / reject must refresh. */
const SHARED_KEYS = ["purchase-list-count", "purchase-detail"];

/**
 * Approve / reject a pending purchase with confirmation modals.
 * Shared by the pending list and the purchase detail page.
 */
const usePurchaseActions = () => {
  const {
    mutate: approve,
    isPending: isApproving,
    variables: approveVars,
  } = useMutationQuery<unknown, PurchaseApproveRequest>({
    url: `dashboard/purchases/purchase-approve`,
    invalidateKeys: [
      ...SHARED_KEYS,
      "purchase-pending-approved-list",
      "purchase-approved-list",
    ],
  });
  const {
    mutate: reject,
    isPending: isRejecting,
    variables: rejectVars,
  } = useMutationQuery<unknown, PurchaseRejectRequest>({
    url: `dashboard/purchases/purchase-reject`,
    invalidateKeys: [
      ...SHARED_KEYS,
      "purchase-pending-approved-list",
      "purchase-rejected-list",
    ],
  });

  /** Id of the order with a request in flight, so only its buttons spin. */
  const busyId =
    (isApproving && approveVars?.purchaseId) ||
    (isRejecting && rejectVars?.purchaseId) ||
    null;

  const callbacks = {
    onSuccess: () => showSuccessNoti(),
    onError: (e: TErrorOptions) => showErrorNoti(e.message),
  };

  const confirmReject = (purchase: TPurchaseActionTarget) => {
    const modalId = modals.open({
      title: "Reject order",
      centered: true,
      children: createElement(RejectModal, {
        purchase,
        onCancel: () => modals.close(modalId),
        onSubmit: (reason: string) => {
          reject({ purchaseId: purchase.id, reason }, callbacks);
          modals.close(modalId);
        },
      }),
    });
  };

  const confirmApprove = (purchase: TPurchaseActionTarget) => {
    const modalId = modals.open({
      title: "Approve order",
      centered: true,
      children: createElement(ApproveModal, {
        purchase,
        onCancel: () => modals.close(modalId),
        onConfirm: () => {
          approve({ purchaseId: purchase.id }, callbacks);
          modals.close(modalId);
        },
      }),
    });
  };

  return { confirmApprove, confirmReject, busyId };
};

export default usePurchaseActions;
