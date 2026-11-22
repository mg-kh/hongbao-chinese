import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useParams } from "next/navigation";

/**
 * Tracks which quizzes a user has marked complete. Backed by the
 * `learning-progress/quiz/completed` endpoint, which returns every completed quiz id for the
 * current user.
 */
export type TCompletedQuizzes = {
  count: number;
  ids: string[];
};

export const completedQuizzesKey = (userId?: string) => [
  "quiz-completed",
  userId,
];

export const useCompletedQuizzes = () => {
  const { userId } = useParams();
  const uid = Array.isArray(userId) ? userId[0] : userId;

  const { data, isLoading } = useApiQuery<
    { data: TCompletedQuizzes },
    TCompletedQuizzes
  >({
    url: "learning-progress/quiz/completed",
    key: completedQuizzesKey(uid),
    enabled: !!uid,
    select: (res) => res?.data,
  });

  const completedIds = data?.ids || [];
  const completedCount = data?.count ?? completedIds.length;

  const isQuizCompleted = (quizId?: string) =>
    !!quizId && completedIds.includes(quizId);

  return { completedIds, completedCount, isQuizCompleted, isLoading };
};
