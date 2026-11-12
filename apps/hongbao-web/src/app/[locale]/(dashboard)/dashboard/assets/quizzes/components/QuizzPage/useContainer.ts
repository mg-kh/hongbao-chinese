import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useRouter } from "@/i18n/navigation";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TQuiz } from "../../types/quiz.type";

const useContainer = () => {
  const { open, opened } = useEditDrawer();

  const { data: quizzes, isLoading } = useApiQuery<{ data: TQuiz[] }, TQuiz[]>({
    url: `dashboard/quiz`,
    key: "quiz",
    select: (data) => data?.data,
  });

  return {
    open,
    opened,
    quizzes,
    isLoading,
  };
};

export default useContainer;
