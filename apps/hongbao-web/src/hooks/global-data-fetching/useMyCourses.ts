import useApiQuery from "@/hooks/fetching/useApiQuery";
import { keepPreviousData } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
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
    productId: e.courseId ?? e.mockTestId ?? product?.id ?? "",
    type: e.courseId ? "course" : "mock-test",
    title: product?.title ?? "",
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
 * `purchase/my-enrollments`, one page at a time, plus the counts derived from
 * them. Shared by the profile overview (stat tiles) and the My courses page
 * (filter tabs). `stats.total` is the server-side total; the per-status
 * counts only cover the loaded page.
 */
const useMyCourses = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useApiQuery<
    { data: TMyEnrollmentRes },
    TMyEnrollmentRes
  >({
    url: `purchase/my-enrollments`,
    key: "my-enrollments",
    params: { page, limit: PAGE_LIMIT, type: "all" },
    select: (res) => res?.data,
    placeholderData: keepPreviousData,
  });

  const coursesRes = useMemo<TMyCourse[]>(
    () => {
      const now = Date.now();
      return (data?.items ?? []).map((e) => toCourse(e, now));
    },
    [data],
  );

  const stats = useMemo(
    () => ({
      total: data?.total ?? 0,
      active: coursesRes.filter((c) => c.status === "APPROVED").length,
      pending: coursesRes.filter((c) => c.status === "PENDING").length,
      expired: coursesRes.filter((c) => c.status === "EXPIRED").length,
    }),
    [coursesRes, data?.total],
  );

  return {
    coursesRes,
    isLoading,
    isFetching,
    stats,
    page,
    setPage,
    totalPages: data?.totalPage || 1,
  };
};

export default useMyCourses;
