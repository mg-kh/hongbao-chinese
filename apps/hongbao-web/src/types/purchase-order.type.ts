/**
 * Shared purchase-order card types, used by the customer purchase history and
 * the dashboard purchases lists (pending / approved / rejected).
 */

/** Item fields both `purchase/my-purchases` and `dashboard/purchases/*` return. */
export type TRawPurchaseItem = {
  id: string;
  courseId: string | null;
  mockTestId: string | null;
  flashcardId?: string | null;
  /** Snapshot of the product name at checkout. */
  productName: string;
  price: number;
  /** `null` means lifetime access. */
  durationDays: number | null;
  quantity: number;
  course: { title: string } | null;
  mockTest: { title: string } | null;
  flashcard?: { name: string } | null;
};

/** Purchase fields both endpoints return. */
export type TRawPurchase = {
  id: string;
  orderNo: string;
  createdAt: string;
  currency: string;
  totalAmount: number;
  paymentType: string | null;
  transactionNo: string | null;
  rejectReason?: string | null;
  items: TRawPurchaseItem[];
};

export type TPurchaseCardItemType = "course" | "mock-test" | "flashcard";

export const PURCHASE_ITEM_TYPE_LABEL: Record<TPurchaseCardItemType, string> = {
  course: "Course",
  "mock-test": "Mock Test",
  flashcard: "Flashcard",
};

export type TPurchaseCardItem = {
  /** Order line id - unique within the order. */
  id: string;
  /** The course / mock test / flashcard deck the line grants access to. */
  productId: string | null;
  type: TPurchaseCardItemType;
  title: string;
  /** Access length per unit; `null` means lifetime. */
  durationDays: number | null;
  quantity: number;
  /** Line total (price × quantity). */
  lineTotal: number;
};

/** What the card renders - normalised from a raw purchase. */
export type TPurchaseCardOrder = {
  id: string;
  /** Customer-facing order number, e.g. "HB-20261025-E8B33554". */
  reference: string;
  /** ISO timestamp the order was submitted. */
  createdAt: string;
  currency: string;
  /** Sum of line totals. */
  subtotal: number;
  /** What the customer was charged. */
  total: number;
  paymentType: string | null;
  transactionNo: string | null;
  /** Admin's reason when the order was rejected. */
  rejectReason: string | null;
  items: TPurchaseCardItem[];
};
