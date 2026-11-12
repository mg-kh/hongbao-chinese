import { useDisclosure } from "@mantine/hooks";
import { useSetAtom } from "jotai";
import { TSubLessonRes } from "../../../sub-lessons/types/sub-lesson.type";
import useQuizAttachment from "../../hooks/useQuizAttachment";
import { AttachTargetAtom } from "../../types/attach-quizzes.type";

const useContainer = (subLesson: TSubLessonRes) => {
  const [expanded, { toggle }] = useDisclosure(false);
  const setAttachTarget = useSetAtom(AttachTargetAtom);
  const { detachQuiz, isDetaching } = useQuizAttachment("sub_lesson");

  const openAttachDialog = () =>
    setAttachTarget({
      level: "sub_lesson",
      id: subLesson.id,
      title: subLesson.title,
    });

  const handleRemoveQuiz = (quizId: string) =>
    detachQuiz({ nodeId: subLesson.id, quizId });

  return { expanded, toggle, openAttachDialog, handleRemoveQuiz, isDetaching };
};

export default useContainer;
