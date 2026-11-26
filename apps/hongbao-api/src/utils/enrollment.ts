import { Enrollment, Prisma } from '@prisma/client';

export type EnrollmentProduct =
  { courseId: string } | { mockTestId: string } | { flashcardId: string };

// Access requires both an APPROVED status and an unexpired (or lifetime) expiry;
// EXPIRED is not written by a job, so status alone is not enough.
export const isEnrollmentActive = (
  enrollment: Pick<Enrollment, 'status' | 'expiredAt'> | null | undefined,
  now = new Date(),
): enrollment is Pick<Enrollment, 'status' | 'expiredAt'> =>
  enrollment?.status === 'APPROVED' &&
  (enrollment.expiredAt === null || enrollment.expiredAt > now);

export const activeEnrollmentWhere = (now = new Date()) =>
  ({
    status: 'APPROVED',
    OR: [{ expiredAt: null }, { expiredAt: { gt: now } }],
  }) satisfies Prisma.EnrollmentWhereInput;

export const enrollmentUniqueWhere = (
  userId: string,
  product: EnrollmentProduct,
): Prisma.EnrollmentWhereUniqueInput => {
  if ('courseId' in product) {
    return { userId_courseId: { userId, courseId: product.courseId } };
  }
  if ('mockTestId' in product) {
    return { userId_mockTestId: { userId, mockTestId: product.mockTestId } };
  }
  return { userId_flashcardId: { userId, flashcardId: product.flashcardId } };
};

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
