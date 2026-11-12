export type TDiscountType = "PERCENTAGE" | "FIXED";

export type TCouponRes = {
  id: string;
  code: string;
  description: string;
  discountType: TDiscountType;
  discountValue: number;
  usageLimit: number;
  perUserLimit: number;
  isActive: boolean;
  expiresAt: string;
  courseIds?: string[];
  courses?: { id: string; title: string }[];
};
