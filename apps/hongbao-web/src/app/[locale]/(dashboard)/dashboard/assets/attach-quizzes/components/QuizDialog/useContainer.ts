import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { TQuiz } from "../../../quizzes/types/quiz.type";
import useQuizAttachment from "../../hooks/useQuizAttachment";
import {
  ATTACH_LEVEL_LABEL,
  AttachTargetAtom,
} from "../../types/attach-quizzes.type";

const useContainer = () => {
  const [target, setTarget] = useAtom(AttachTargetAtom);
  const [selectedQuizId, setSelectedQuizId] = useState<string | undefined>();
  const [search, setSearch] = useState("");

  const { attachQuiz, isAttaching } = useQuizAttachment(
    target?.level ?? "course",
  );

  const { data: quizzes, isLoading } = useApiQuery<{ data: TQuiz[] }, TQuiz[]>({
    url: `dashboard/quiz/find-all-quiz-for-attach`,
    key: "quiz",
    select: (data) => data?.data,
  });

  const filteredQuizzes = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return quizzes;
    return quizzes?.filter((q) =>
      q.title.toLowerCase().includes(keyword),
    );
  }, [quizzes, search]);

  const close = () => {
    setTarget(null);
    setSelectedQuizId(undefined);
    setSearch("");
  };

  const handleConfirm = () => {
    if (!target || !selectedQuizId) return;
    attachQuiz({ nodeId: target.id, quizId: selectedQuizId }, close);
  };

  return {
    target,
    levelLabel: target ? ATTACH_LEVEL_LABEL[target.level] : "",
    close,
    quizzes: filteredQuizzes,
    isLoading,
    isAttaching,
    search,
    setSearch,
    handleConfirm,
    selectedQuizId,
    setSelectedQuizId,
  };
};

export default useContainer;
