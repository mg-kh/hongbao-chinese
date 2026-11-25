import { currencyFormatter } from "@/utils/currencyFormatter";
import { pluralize } from "@/utils/pluralize";
import {
  TPurchaseCardItem,
  TPurchaseCardOrder,
  TRawPurchase,
} from "@/types/purchase-order.type";

export const money = (value: number, currency = "MMK") =>
  value <= 0 ? "Free" : currencyFormatter({ value, currencySample: currency });

/** "3 months" for whole months, otherwise "45 days"; `null` is lifetime. */
export const durationLabel = (days: number | null) => {
  if (days === null) return "Lifetime";
  if (days > 0 && days % 30 === 0) return pluralize(days / 30, "month");
  return pluralize(days, "day");
};

/** "KBZPAY · Txn 123456", or a placeholder when nothing was recorded. */
export const paymentLabel = (
  order: Pick<TPurchaseCardOrder, "paymentType" | "transactionNo">,
) =>
  [
    order.paymentType?.toUpperCase(),
    order.transactionNo && `Txn ${order.transactionNo}`,
  ]
    .filter(Boolean)
    .join(" · ") || "No payment info";

/** Raw API purchase -> the shape `PurchaseOrderCard` renders. */
export const toPurchaseCardOrder = (p: TRawPurchase): TPurchaseCardOrder => {
  const items: TPurchaseCardItem[] = p.items.map((i) => ({
    id: i.id,
    productId: i.courseId ?? i.mockTestId ?? i.flashcardId ?? null,
    type: i.mockTestId ? "mock-test" : i.flashcardId ? "flashcard" : "course",
    // Live title, falling back to the name captured at checkout.
    title:
      i.course?.title ||
      i.mockTest?.title ||
      i.flashcard?.name ||
      i.productName ||
      "-",
    durationDays: i.durationDays,
    quantity: i.quantity,
    lineTotal: i.price * i.quantity,
  }));

  return {
    id: p.id,
    reference: p.orderNo,
    createdAt: p.createdAt,
    currency: p.currency,
    subtotal: items.reduce((sum, i) => sum + i.lineTotal, 0),
    total: p.totalAmount,
    paymentType: p.paymentType,
    transactionNo: p.transactionNo,
    rejectReason: p.rejectReason ?? null,
    items,
  };
};
