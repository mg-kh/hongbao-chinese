/**
 * Compile-time guard: the enums in @repo/shared must stay identical to the
 * Prisma-generated ones. If a Prisma enum changes, `check-types` fails here
 * until packages/shared/src/enums.ts is updated to match.
 */
import type * as Prisma from '@prisma/client';
import type * as Shared from '@repo/shared';

type Equals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Assert<T extends true> = T;

export type SharedEnumsMatchPrisma = [
  Assert<Equals<Shared.Role, Prisma.Role>>,
  Assert<Equals<Shared.QuestionType, Prisma.QuestionType>>,
  Assert<Equals<Shared.PurchaseStatus, Prisma.PurchaseStatus>>,
  Assert<Equals<Shared.EnrollmentStatus, Prisma.EnrollmentStatus>>,
  Assert<Equals<Shared.ProgressEntityType, Prisma.ProgressEntityType>>,
  Assert<Equals<Shared.ProgressStatus, Prisma.ProgressStatus>>,
  Assert<Equals<Shared.DiscountType, Prisma.DiscountType>>,
];
