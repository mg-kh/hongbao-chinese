import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import useApiQuery from "../fetching/useApiQuery";
import { TCourseDetail } from "./useCourseDetail";

/** `errors.code` of the 403 from `learn/course-detail/:id`. */
export type TCourseAccessErrorCode =
  "ENROLLMENT_EXPIRED" | "ENROLLMENT_PENDING" | "NOT_ENROLLED";

export type TCourseAccessError = {
  code: TCourseAccessErrorCode;
  expiredAt: string | null;
};

export const learnCourseDetailKey = (courseId?: string | string[]) => [
  "learn-course-detail",
  courseId,
];

/** Pull the access error out of a 403 response, if that's what failed. */
const toAccessError = (error: unknown): TCourseAccessError | null => {
  if (!isAxiosError(error) || error.response?.status !== 403) return null;
  const errors = (error.response.data as { errors?: TCourseAccessError })
    ?.errors;
  return errors?.code ? errors : null;
};

const selectData = (data: { data: TCourseDetail }) => data?.data;

/**
 * Course detail for the learn pages. The API refuses with a 403 when the
 * user has no active access, and `accessError` says why (expired, pending,
 * not enrolled).
 */
const useLearnCourseDetail = () => {
  const { courseId } = useParams();
  const {
    data: courseDetail,
    error,
    isFetching,
    isLoading,
  } = useApiQuery<{ data: TCourseDetail }, TCourseDetail>({
    url: `learn/course-detail/${courseId}`,
    enabled: !!courseId,
    select: selectData,
    key: learnCourseDetailKey(courseId),
    // Shared by the gate, navigator and every learn page; without a staleTime
    // each newly mounted consumer refetches. It carries no completion state,
    // so progress changes don't need to invalidate it.
    staleTime: 5 * 60 * 1000,
    // A failed fetch must not be retried every time a consumer mounts: the
    // gate unmounts its children while loading, so that would loop forever.
    retryOnMount: false,
  });

  const accessError = useMemo(() => toAccessError(error), [error]);

  return {
    courseDetail,
    accessError,
    error,
    isFetching,
    isLoading,
  };
};

export default useLearnCourseDetail;
