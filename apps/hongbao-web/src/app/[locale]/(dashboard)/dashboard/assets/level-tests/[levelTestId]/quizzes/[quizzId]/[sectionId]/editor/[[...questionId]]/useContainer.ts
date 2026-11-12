import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useParams } from "next/navigation";
import { TSectionDetail } from "../../../../../../types/question.type";

const useContainer = () => {
  const { levelTestId, quizzId, sectionId } = useParams();

  const { data: sectionDetail } = useApiQuery<
    { data: TSectionDetail },
    TSectionDetail
  >({
    url: `dashboard/quiz-section/quiz/${quizzId}/section/${sectionId}`,
    enabled: !!quizzId && !!sectionId,
    select: (data) => data?.data,
    key: "level-test-section-detail",
  });

  return {
    levelTestId,
    quizzId,
    sectionId,
    sectionDetail,
  };
};

export default useContainer;
