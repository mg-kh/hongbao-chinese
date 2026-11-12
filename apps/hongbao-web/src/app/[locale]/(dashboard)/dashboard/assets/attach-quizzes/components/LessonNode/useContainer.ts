import { useDisclosure } from "@mantine/hooks";
import { useSetAtom } from "jotai";
import useSubLessons from "../../../../hooks/data-fetching/useSubLessons";
import { TLessonRes } from "../../../lessons/types/lessons.type";
import useQuizAttachment from "../../hooks/useQuizAttachment";
import { AttachTargetAtom } from "../../types/attach-quizzes.type";

const useContainer = (lesson: TLessonRes, courseId: string) => {
  const [expanded, { toggle }] = useDisclosure(false);
  const setAttachTarget = useSetAtom(AttachTargetAtom);
  const { detachQuiz, isDetaching } = useQuizAttachment("lesson");

  const { data: subLessons, isFetching: isLoadingSubLessons } = useSubLessons({
    courseId,
    lessonId: lesson.id,
    enabled: expanded,
  });

  const openAttachDialog = () =>
    setAttachTarget({ level: "lesson", id: lesson.id, title: lesson.title });

  const handleRemoveQuiz = (quizId: string) =>
    detachQuiz({ nodeId: lesson.id, quizId });

  return {
    expanded,
    toggle,
    subLessons,
    isLoadingSubLessons,
    openAttachDialog,
    handleRemoveQuiz,
    isDetaching,
  };
};

export default useContainer;
