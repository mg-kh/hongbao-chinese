import useApiQuery from "@/hooks/fetching/useApiQuery";
import { keepPreviousData } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  CourseFilter,
  TMyCourse,
  TMyEnrollment,
  TMyEnrollmentRes,
} from "@/app/[locale]/(protected)/(profile)/profile/[userId]/types/my-courses.type";

const PAGE_LIMIT = 10;

/**
 * The API never writes EXPIRED - an enrollment stays APPROVED and only its
 * `expiredAt` passes - so derive it here. Null `expiredAt` means lifetime.
 */
const resolveStatus = (
  e: TMyEnrollment,
  now: number,
): TMyEnrollment["status"] => {
  if (
    e.status === "APPROVED" &&
    e.expiredAt &&
    new Date(e.expiredAt).getTime() <= now
  ) {
    return "EXPIRED";
  }
  return e.status;
};

const toCourse = (e: TMyEnrollment, now = Date.now()): TMyCourse => {
  const product = e.course ?? e.mockTest;
  const status = resolveStatus(e, now);
  return {
    id: e.id,
    productId: e.courseId ?? e.mockTestId ?? e.flashcardId ?? product?.id ?? "",
    type: e.courseId ? "course" : e.mockTestId ? "mock-test" : "flashcard",
    title: product?.title ?? e.flashcard?.name ?? "",
    thumbnail: product?.thumbnail ?? null,
    perTime: product?.perTime ?? 1,
    status,
    startedAt: e.startedAt,
    expiredAt: e.expiredAt,
    createdAt: e.createdAt,
    hasAccess: e.hasAccess && status !== "EXPIRED",
  };
};

/**
 * The user's enrolments (courses + mock tests) from
 * `purchase/my-enrollments`, one page at a time. The status filter is applied
 * server-side; `stats` are server-side totals that ignore the status filter.
 * Shared by the profile overview (stat tiles) and the My courses page
 * (filter tabs).
 */
const useMyCourses = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilterState] = useState<CourseFilter>("ALL");

  /** Switching tabs starts over from the first page. */
  const setFilter = (value: CourseFilter) => {
    setFilterState(value);
    setPage(1);
  };

  const { data, isLoading, isFetching } = useApiQuery<
    { data: TMyEnrollmentRes },
    TMyEnrollmentRes
  >({
    url: `purchase/my-enrollments`,
    key: "my-enrollments",
    params: {
      page,
      limit: PAGE_LIMIT,
      type: "all",
      ...(filter !== "ALL" && { status: filter }),
    },
    select: (res) => res?.data,
    placeholderData: keepPreviousData,
  });

  const coursesRes = useMemo<TMyCourse[]>(() => {
    const now = Date.now();
    return (data?.items ?? []).map((e) => toCourse(e, now));
  }, [data]);

  const stats = {
    total: data?.counts?.ALL ?? 0,
    active: data?.counts?.APPROVED ?? 0,
    pending: data?.counts?.PENDING ?? 0,
    expired: data?.counts?.EXPIRED ?? 0,
  };

  return {
    coursesRes,
    isLoading,
    isFetching,
    stats,
    page,
    setPage,
    totalPages: data?.totalPage || 1,
    filter,
    setFilter,
  };
};

export default useMyCourses;
