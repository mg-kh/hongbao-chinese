import { TPublicFeedback } from "@/app/[locale]/components/StudentReview/types/feedback.type";
import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useState } from "react";

const PAGE_SIZE = 6;

const useContainer = () => {
  const [page, setPage] = useState(0);
  const { data: feedbacks = [], isLoading } = useApiQuery<
    { data: TPublicFeedback[] },
    TPublicFeedback[]
  >({
    url: "all-feedbacks",
    key: "all-feedbacks",
    select: (data) => data?.data ?? [],
  });

  const averageRating = feedbacks.length
    ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
    : 0;

  const totalPages = Math.ceil(feedbacks.length / PAGE_SIZE);
  const visibleFeedbacks = feedbacks.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  return {
    page,
    setPage,
    feedbacks,
    isLoading,
    // Nothing to show yet - the section hides rather than render an empty grid.
    isEmpty: !isLoading && feedbacks.length === 0,
    averageRating,
    totalPages,
    visibleFeedbacks,
  };
};

export default useContainer;
