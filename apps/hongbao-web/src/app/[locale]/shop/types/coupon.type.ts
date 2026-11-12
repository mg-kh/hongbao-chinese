import { TDiscountType } from "@/app/[locale]/(dashboard)/dashboard/promotion/generate-coupons/types/coupon.type";

/** Coupon applied to a single cart line, as returned by `coupon/apply`. */
export type TAppliedCoupon = {
  couponId: string;
  code: string;
  discountType: TDiscountType;
  discountValue: number;
};

/** Amount taken off `subtotal` by `coupon`, clamped to the subtotal. */
export const getCouponDiscount = (
  coupon: TAppliedCoupon | null,
  subtotal: number,
): number => {
  if (!coupon || subtotal <= 0) return 0;
  const raw =
    coupon.discountType === "PERCENTAGE"
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue;
  return Math.min(Math.round(raw), subtotal);
};
