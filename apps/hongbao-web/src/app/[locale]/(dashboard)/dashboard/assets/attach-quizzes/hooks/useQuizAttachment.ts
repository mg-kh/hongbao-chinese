import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { TAttachLevel } from "../types/attach-quizzes.type";

const LEVEL_CONFIG: Record<
  TAttachLevel,
  { url: string; invalidateKey: string; idKey: string }
> = {
  course: {
    url: "dashboard/quiz/quiz-to-course",
    invalidateKey: "course",
    idKey: "courseId",
  },
  lesson: {
    url: "dashboard/quiz/quiz-to-lesson",
    invalidateKey: "lesson",
    idKey: "lessonId",
  },
  sub_lesson: {
    url: "dashboard/quiz/quiz-to-sub-lesson",
    invalidateKey: "sub-lesson",
    idKey: "subLessonId",
  },
};

/**
 * Attach / detach a quiz to a course, lesson or sub-lesson.
 * The three endpoints share the same shape, only the url, id key and
 * cache key differ per level.
 */
const useQuizAttachment = (level: TAttachLevel) => {
  const config = LEVEL_CONFIG[level];

  const { mutate: attachMutate, isPending: isAttaching } = useMutationQuery({
    url: config.url,
    method: "post",
    invalidateKeys: [config.invalidateKey],
  });

  const { mutate: detachMutate, isPending: isDetaching } = useMutationQuery({
    url: config.url,
    method: "delete",
    invalidateKeys: [config.invalidateKey],
  });

  const attachQuiz = (
    { nodeId, quizId }: { nodeId: string; quizId: string },
    onDone?: () => void,
  ) => {
    attachMutate(
      { [config.idKey]: nodeId, quizId },
      {
        onSuccess: () => {
          showSuccessNoti("Quiz attached");
          onDone?.();
        },
        onError: (e: TErrorOptions) => showErrorNoti(e.message),
      },
    );
  };

  const detachQuiz = (
    { nodeId, quizId }: { nodeId: string; quizId: string },
    onDone?: () => void,
  ) => {
    detachMutate(
      { [config.idKey]: nodeId, quizId },
      {
        onSuccess: () => {
          showSuccessNoti("Quiz removed");
          onDone?.();
        },
        onError: (e: TErrorOptions) => showErrorNoti(e.message),
      },
    );
  };

  return { attachQuiz, detachQuiz, isAttaching, isDetaching };
};

export default useQuizAttachment;
