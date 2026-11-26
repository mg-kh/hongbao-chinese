export type TEnrollmentStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";

/* ---------------- API response (`purchase/my-enrollments`) ---------------- */

type TEnrollmentProduct = {
  id: string;
  title: string;
  perTime: number;
  /** Not returned by the API yet - reserved for course / mock test cover images. */
  thumbnail?: string | null;
};

export type TMyEnrollment = {
  id: string;
  userId: string;
  courseId: string | null;
  mockTestId: string | null;
  flashcardId: string | null;
  status: TEnrollmentStatus;
  startedAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string;
  course: TEnrollmentProduct | null;
  mockTest: TEnrollmentProduct | null;
  /** Decks have a `name` and no access period (lifetime). */
  flashcard: { id: string; name: string } | null;
  hasAccess: boolean;
};

/** Status buckets the list can be narrowed to (server-side). */
export type CourseFilter = "ALL" | "APPROVED" | "PENDING" | "EXPIRED";

export type TMyEnrollmentRes = {
  items: TMyEnrollment[];
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  /** Per-status totals; independent of the selected status filter. */
  counts: Record<CourseFilter, number>;
};

/* ---------------- UI shape ---------------- */

export type TMyCourse = {
  /** Enrollment id - unique per row. */
  id: string;
  /** The course / mock test this enrollment grants access to. */
  productId: string;
  type: "course" | "mock-test" | "flashcard";
  title: string;
  /** Cover image; the card falls back to a type icon when missing. */
  thumbnail: string | null;
  /** Access length in months. */
  perTime: number;
  status: TEnrollmentStatus;
  startedAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  hasAccess: boolean;
};
