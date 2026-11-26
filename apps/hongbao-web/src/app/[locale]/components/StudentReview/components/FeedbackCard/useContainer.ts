import { TPublicFeedback } from "@/app/[locale]/components/StudentReview/types/feedback.type";

const useContainer = (data: TPublicFeedback) => {
  return {
    position: data.position || "Student",
  };
};

export default useContainer;
