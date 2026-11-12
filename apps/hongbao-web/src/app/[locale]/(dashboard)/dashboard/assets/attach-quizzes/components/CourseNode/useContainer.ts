import { useDisclosure } from "@mantine/hooks";
import { useSetAtom } from "jotai";
import useLessons from "../../../../hooks/data-fetching/useLessons";
import { TCourseRes } from "../../../courses/types/courses.type";
import useQuizAttachment from "../../hooks/useQuizAttachment";
import { AttachTargetAtom } from "../../types/attach-quizzes.type";

const useContainer = (course: TCourseRes) => {
  const [expanded, { toggle }] = useDisclosure(false);
  const setAttachTarget = useSetAtom(AttachTargetAtom);
  const { detachQuiz, isDetaching } = useQuizAttachment("course");

  const { data: lessons, isFetching: isLoadingLessons } = useLessons({
    courseId: course.id,
    enabled: expanded,
  });

  const openAttachDialog = () =>
    setAttachTarget({ level: "course", id: course.id, title: course.title });

  const handleRemoveQuiz = (quizId: string) =>
    detachQuiz({ nodeId: course.id, quizId });

  return {
    expanded,
    toggle,
    lessons,
    isLoadingLessons,
    openAttachDialog,
    handleRemoveQuiz,
    isDetaching,
  };
};

export default useContainer;
