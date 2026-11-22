import useLearnCourseDetail from "@/hooks/global-data-fetching/useLearnCourseDetail";
import { format } from "date-fns";
import { useParams } from "next/navigation";

/**
 * Access comes from the learn course-detail response itself: a 403 carries
 * `errors.code` (expired / pending / not enrolled), anything else is let
 * through so the pages handle it as before.
 */
const useContainer = () => {
  const { userId } = useParams();
  const { accessError, isLoading } = useLearnCourseDetail();

  return {
    isLoading,
    accessError,
    isExpired: accessError?.code === "ENROLLMENT_EXPIRED",
    isPending: accessError?.code === "ENROLLMENT_PENDING",
    expiredOn: accessError?.expiredAt
      ? format(new Date(accessError.expiredAt), "dd MMM yyyy")
      : null,
    myCoursesHref: `/profile/${userId}/my-courses`,
    renewHref: "/shop?type=course",
  };
};

export default useContainer;
