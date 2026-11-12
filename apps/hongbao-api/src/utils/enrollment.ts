import { Enrollment, Prisma } from '@prisma/client';

export type EnrollmentProduct = { courseId: string } | { levelTestId: string };

// Access requires both an ACTIVE status and an unexpired (or lifetime) expiry;
// EXPIRED is not written by a job, so status alone is not enough.
export const isEnrollmentActive = (
  enrollment: Pick<Enrollment, 'status' | 'expiredAt'> | null | undefined,
  now = new Date(),
): enrollment is Pick<Enrollment, 'status' | 'expiredAt'> =>
  enrollment?.status === 'ACTIVE' &&
  (enrollment.expiredAt === null || enrollment.expiredAt > now);

export const activeEnrollmentWhere = (now = new Date()) =>
  ({
    status: 'ACTIVE',
    OR: [{ expiredAt: null }, { expiredAt: { gt: now } }],
  }) satisfies Prisma.EnrollmentWhereInput;

export const enrollmentUniqueWhere = (
  userId: string,
  product: EnrollmentProduct,
): Prisma.EnrollmentWhereUniqueInput =>
  'courseId' in product
    ? { userId_courseId: { userId, courseId: product.courseId } }
    : { userId_levelTestId: { userId, levelTestId: product.levelTestId } };

export const hasProductAccess = async (
  db: Pick<Prisma.TransactionClient, 'enrollment'>,
  userId: string,
  product: EnrollmentProduct,
) => {
  const enrollment = await db.enrollment.findUnique({
    where: enrollmentUniqueWhere(userId, product),
    select: { status: true, expiredAt: true },
  });
  return isEnrollmentActive(enrollment);
};
