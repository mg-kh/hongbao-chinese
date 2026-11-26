/**
 * Purchase history types. `TMyPurchase*` mirror the raw
 * `purchase/my-purchases` response; `TPurchaseOrder` / `TOrderItem` are the
 * normalised shapes the page components render (see
 * `purchase-history/hooks/usePurchaseOrders.ts`).
 */

import type {
  TPurchaseCardItem,
  TPurchaseCardOrder,
} from "@/types/purchase-order.type";
import type { OrderStatus, PurchaseStatus } from "@repo/shared";

/**
 * Customer-facing order status, computed by the API (`orderStatus`):
 * APPROVED = still grants access, EXPIRED = approved but access has ended,
 * CANCELLED = declined by an admin.
 */
export type TOrderStatus = OrderStatus;

/* ---------------- API response ---------------- */

export type TMyPurchaseItem = {
  id: string;
  purchaseId: string;
  courseId: string | null;
  mockTestId: string | null;
  flashcardId: string | null;
  productName: string;
  /** Line price in the order's currency. */
  price: number;
  durationDays: number;
  quantity: number;
  createdAt: string;
  course: { id: string; title: string } | null;
  mockTest: { id: string; title: string } | null;
  flashcard: { id: string; name: string } | null;
};

export type TMyPurchase = {
  id: string;
  userId: string;
  orderNo: string;
  /** Raw DB status (PENDING / APPROVED / CANCELLED). */
  status: PurchaseStatus;
  totalAmount: number;
  currency: string;
  paymentType: string;
  transactionNo: string;
  createdAt: string;
  paidAt: string | null;
  /** Admin's reason, set when the order was rejected (CANCELLED). */
  rejectReason: string | null;
  updatedAt: string;
  /** Status the customer sees; derived server-side. */
  orderStatus: TOrderStatus;
  items: TMyPurchaseItem[];
};

export type TMyPurchaseRes = {
  items: TMyPurchase[];
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  /** Orders per status tab within the date range (ignores `status`). */
  counts: Record<OrderFilter, number>;
};

/* ---------------- UI shape ---------------- */

/** One order line - the shared purchase card's item shape. */
export type TOrderItem = TPurchaseCardItem;

/** The shared card's order plus the customer-facing lifecycle fields. */
export type TPurchaseOrder = TPurchaseCardOrder & {
  status: TOrderStatus;
  /** ISO timestamp the payment was confirmed; null until then. */
  paidAt: string | null;
  /** ISO timestamp of the last status change. */
  updatedAt: string;
};

/** Status buckets the list can be narrowed to. */
export type OrderFilter = "ALL" | TOrderStatus;
