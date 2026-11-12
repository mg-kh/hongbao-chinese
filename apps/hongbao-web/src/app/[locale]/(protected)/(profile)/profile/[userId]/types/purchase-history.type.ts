/**
 * Purchase history types. `TMyPurchase*` mirror the raw
 * `purchase/my-purchases` response; `TPurchaseOrder` / `TOrderItem` are the
 * normalised shapes the page components render (see
 * `purchase-history/hooks/usePurchaseOrders.ts`).
 */

export type TOrderStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";

/* ---------------- API response ---------------- */

export type TMyPurchaseItem = {
  id: string;
  purchaseId: string;
  courseId: string | null;
  levelTestId: string | null;
  productName: string;
  /** Line price in the order's currency. */
  price: number;
  durationDays: number;
  quantity: number;
  createdAt: string;
  course: { id: string; title: string } | null;
  levelTest: { id: string; title: string } | null;
};

export type TMyPurchase = {
  id: string;
  userId: string;
  orderNo: string;
  status: TOrderStatus;
  totalAmount: number;
  currency: string;
  paymentType: string;
  transactionNo: string;
  createdAt: string;
  paidAt: string | null;
  updatedAt: string;
  items: TMyPurchaseItem[];
};

export type TMyPurchaseRes = {
  items: TMyPurchase[];
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

/* ---------------- UI shape ---------------- */

export type TOrderItemType = "course" | "level-test";

export type TOrderItem = {
  /** Order line id - unique within the order. */
  id: string;
  /** The course / level test the line grants access to. */
  productId: string | null;
  type: TOrderItemType;
  title: string;
  /** Access length granted by this line. */
  durationDays: number;
  quantity: number;
  /** Line total (price × quantity). */
  lineTotal: number;
};

export type TPurchaseOrder = {
  id: string;
  /** Customer-facing order number, e.g. "HB-20261025-E8B33554". */
  reference: string;
  status: TOrderStatus;
  /** ISO timestamp the order was submitted. */
  createdAt: string;
  /** ISO timestamp the payment was confirmed; null until then. */
  paidAt: string | null;
  /** ISO timestamp of the last status change. */
  updatedAt: string;
  currency: string;
  paymentType: string;
  transactionNo: string;
  /** Sum of line totals. */
  subtotal: number;
  /** What the customer was charged. */
  total: number;
  items: TOrderItem[];
};

/** Status buckets the list can be narrowed to. */
export type OrderFilter = "ALL" | TOrderStatus;
