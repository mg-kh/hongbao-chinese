import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { useParams } from "next/navigation";
import { TQuiz } from "../../../../types/quiz.type";

const useContainer = () => {
  const { open, opened } = useEditDrawer();
  const { mockTestId } = useParams();

  const { data: quizzes, isLoading } = useApiQuery<
    { data: TQuiz[] },
    TQuiz[]
  >({
    url: `dashboard/mock-test/${mockTestId}/quiz`,
    enabled: !!mockTestId,
    select: (data) => data?.data,
  });

  return {
    open,
    opened,
    quizzes: quizzes || [],
    isLoading,
    mockTestId,
  };
};

export default useContainer;
