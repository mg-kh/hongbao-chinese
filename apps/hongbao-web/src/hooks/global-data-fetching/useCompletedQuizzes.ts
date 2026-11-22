import {
  TCompletedProgress,
  useCompletedProgress,
} from "./useCompletedProgress";

/**
 * Tracks which quizzes a user has marked complete. Backed by the
 * `learning-progress/quiz/completed` endpoint, which returns every completed quiz id for the
 * current user.
 */
export type TCompletedQuizzes = TCompletedProgress;

export const completedQuizzesKey = (userId?: string) => [
  "quiz-completed",
  userId,
];

export const useCompletedQuizzes = () => {
  const { isCompleted, ...rest } = useCompletedProgress(
    "learning-progress/quiz/completed",
    completedQuizzesKey,
  );
  return { ...rest, isQuizCompleted: isCompleted };
};
