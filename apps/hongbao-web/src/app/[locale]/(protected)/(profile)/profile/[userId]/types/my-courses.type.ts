export type TEnrollmentStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";

/* ---------------- API response (`purchase/my-enrollments`) ---------------- */

type TEnrollmentProduct = { id: string; title: string; perTime: number };

export type TMyEnrollment = {
  id: string;
  userId: string;
  courseId: string | null;
  levelTestId: string | null;
  status: TEnrollmentStatus;
  startedAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
  course: TEnrollmentProduct | null;
  levelTest: TEnrollmentProduct | null;
  hasAccess: boolean;
};

export type TMyEnrollmentRes = {
  items: TMyEnrollment[];
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

/* ---------------- UI shape ---------------- */

export type TMyCourse = {
  /** Enrollment id - unique per row. */
  id: string;
  /** The course / level test this enrollment grants access to. */
  productId: string;
  type: "course" | "level-test";
  title: string;
  /** Access length in months. */
  perTime: number;
  status: TEnrollmentStatus;
  startedAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  hasAccess: boolean;
};
