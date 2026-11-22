/**
 * Mirrors of the Prisma enums in apps/hongbao-api/prisma/schema/*.prisma.
 * apps/hongbao-api/src/common/shared-enums.check.ts fails type-checking if these drift.
 */

export const Role = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  STAFF: "STAFF",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const QuestionType = {
  MULTIPLE_CHOICES: "MULTIPLE_CHOICES",
  TRUE_OR_FALSE: "TRUE_OR_FALSE",
  REARRANGE: "REARRANGE",
} as const;
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

export const PurchaseStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  CANCELLED: "CANCELLED",
} as const;
export type PurchaseStatus =
  (typeof PurchaseStatus)[keyof typeof PurchaseStatus];

export const EnrollmentStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  EXPIRED: "EXPIRED",
} as const;
export type EnrollmentStatus =
  (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

export const ProgressEntityType = {
  COURSE: "COURSE",
  LESSON: "LESSON",
  SUB_LESSON: "SUB_LESSON",
  VIDEO: "VIDEO",
  QUIZ: "QUIZ",
  QUESTION: "QUESTION",
  FLASHCARD: "FLASHCARD",
} as const;
export type ProgressEntityType =
  (typeof ProgressEntityType)[keyof typeof ProgressEntityType];

export const ProgressStatus = {
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;
export type ProgressStatus =
  (typeof ProgressStatus)[keyof typeof ProgressStatus];

export const DiscountType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED",
} as const;
export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

/** Not a Prisma enum — shop/enrollment product filter used by the client API. */
export const ProductType = {
  ALL: "all",
  COURSE: "course",
  MOCK_TEST: "mock-test",
} as const;
export type ProductType = (typeof ProductType)[keyof typeof ProductType];
