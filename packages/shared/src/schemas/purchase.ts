import { z } from "zod";
import { PaginationQuerySchema } from "../common.js";
import { EnrollmentStatus, ProductType } from "../enums.js";

export const PurchaseApproveSchema = z.object({
  purchaseId: z.string().min(1),
});
export type PurchaseApproveRequest = z.input<typeof PurchaseApproveSchema>;

export const PurchaseRejectSchema = z.object({
  purchaseId: z.string().min(1),
  reason: z.string().trim().min(1).max(500),
});
export type PurchaseRejectRequest = z.input<typeof PurchaseRejectSchema>;

export const PurchasePaginationSchema = PaginationQuerySchema.extend({
  search: z.string().nullish(),
  start_date: z.string().nullish(),
  end_date: z.string().nullish(),
});
export type PurchasePaginationQuery = z.input<typeof PurchasePaginationSchema>;

export const CreateClientPurchaseSchema = z.object({
  contact: z.object({
    name: z.string().trim().min(1),
    email: z.string().email(),
    phone: z.string().trim().min(1),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        months: z.number().int().nonnegative(),
        promoCode: z.string().trim().optional(),
        productType: z.enum([
          ProductType.COURSE,
          ProductType.MOCK_TEST,
          ProductType.FLASHCARD,
        ]),
      }),
    )
    .min(1),
  paymentType: z.string().min(1),
  transactionNo: z.string().trim().min(6).max(6),
  totalAmount: z.number().int().nonnegative(),
});
export type CreateClientPurchaseRequest = z.input<
  typeof CreateClientPurchaseSchema
>;

/**
 * Customer-facing order status for `purchase/my-purchases`. Not a DB enum:
 * APPROVED / EXPIRED split approved purchases by whether the order still
 * grants access; PENDING / CANCELLED match the DB status.
 */
export const OrderStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const FilterClientPurchaseSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  /** Omitted = all orders. */
  status: z.enum(OrderStatus).nullish(),
  start_date: z.string().nullish(),
  end_date: z.string().nullish(),
});
export type FilterClientPurchaseQuery = z.input<
  typeof FilterClientPurchaseSchema
>;

export const FilterClientEnrollmentSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  type: z.enum(ProductType).default(ProductType.ALL),
  /**
   * Omitted = all enrollments. APPROVED = currently has access; EXPIRED also
   * covers APPROVED enrollments whose expiredAt has passed.
   */
  status: z.enum(EnrollmentStatus).nullish(),
});
export type FilterClientEnrollmentQuery = z.input<
  typeof FilterClientEnrollmentSchema
>;
