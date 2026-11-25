export type TPurchaseStatus = "PENDING" | "APPROVED" | "CANCELLED";

export type TPurchaseItem = {
  id: string;
  purchaseId: string;
  courseId: string | null;
  mockTestId: string | null;
  flashcardId: string | null;
  /** Snapshot of the product name at checkout. */
  productName: string;
  price: number;
  /** `null` means lifetime access. */
  durationDays: number | null;
  quantity: number;
  createdAt: string;
  course: { id?: string; title: string } | null;
  mockTest: { id?: string; title: string } | null;
  flashcard: { id?: string; name: string } | null;
};

export type TPurchase = {
  id: string;
  userId: string;
  orderNo: string;
  status: TPurchaseStatus;
  totalAmount: number;
  currency: string;
  paymentType: string | null;
  transactionNo: string | null;
  createdAt: string;
  paidAt: string | null;
  /** Set when an admin rejected the order (status CANCELLED). */
  rejectReason: string | null;
  updatedAt: string;
  user: { name: string };
  items: TPurchaseItem[];
};

/** `GET dashboard/purchases/:id` - a purchase with the full customer record. */
export type TPurchaseDetail = Omit<TPurchase, "user"> & {
  user: { id: string; name: string; email: string; imageUrl: string | null };
};

export type TPurchaseRes = {
  items: TPurchase[];
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};
