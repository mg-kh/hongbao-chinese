import { z } from "zod";
import { DiscountType } from "../enums.js";

export const CreateCouponSchema = z.object({
  code: z
    .string()
    .min(1)
    .max(50)
    .transform((v) => v.trim().toUpperCase()),
  description: z.string().nullish(),
  discountType: z.enum(DiscountType).default(DiscountType.PERCENTAGE),
  discountValue: z.number().positive(),
  usageLimit: z.number().int().positive().nullish(),
  perUserLimit: z.number().int().positive().default(1).nullish(),
  isActive: z.boolean().default(true),
  startsAt: z.iso.datetime({ offset: true }).nullish(),
  expiresAt: z.iso.datetime({ offset: true }).nullish(),
  courseIds: z.array(z.string().min(1)).default([]),
});
export type CreateCouponRequest = z.input<typeof CreateCouponSchema>;

export const UpdateCouponSchema = CreateCouponSchema.partial();
export type UpdateCouponRequest = z.input<typeof UpdateCouponSchema>;

export const CouponToCourseSchema = z.object({
  couponId: z.string().min(1),
  courseId: z.string().min(1),
});
export type CouponToCourseRequest = z.input<typeof CouponToCourseSchema>;

export const UseClientCouponSchema = z.object({
  code: z
    .string()
    .min(1)
    .transform((v) => v.trim().toUpperCase()),
  courseId: z.string().min(1),
});
export type UseClientCouponRequest = z.input<typeof UseClientCouponSchema>;
