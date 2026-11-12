import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { useParams } from "next/navigation";
import { TQuiz } from "../../../../types/quiz.type";

const useContainer = () => {
  const { open, opened } = useEditDrawer();
  const { levelTestId } = useParams();

  const { data: quizzes, isLoading } = useApiQuery<
    { data: TQuiz[] },
    TQuiz[]
  >({
    url: `dashboard/level-test/${levelTestId}/quiz`,
    enabled: !!levelTestId,
    select: (data) => data?.data,
  });

  return {
    open,
    opened,
    quizzes: quizzes || [],
    isLoading,
    levelTestId,
  };
};

export default useContainer;
