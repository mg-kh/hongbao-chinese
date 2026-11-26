import { Collapse, Loader, Text } from "@mantine/core";
import { IconBook2 } from "@tabler/icons-react";
import { isEmpty } from "lodash";
import React from "react";
import { TLessonRes } from "../../../lessons/types/lessons.type";
import AttachedQuizList from "../AttachedQuizList/AttachedQuizList";
import NodeRow from "../NodeRow/NodeRow";
import SubLessonNode from "../SubLessonNode/SubLessonNode";
import useContainer from "./useContainer";

interface Props {
  lesson: TLessonRes;
  courseId: string;
}

const LessonNode: React.FC<Props> = ({ lesson, courseId }) => {
  const {
    expanded,
    toggle,
    subLessons,
    isLoadingSubLessons,
    openAttachDialog,
    handleRemoveQuiz,
    isDetaching,
  } = useContainer(lesson, courseId);

  return (
    <div className="flex flex-col gap-1.5">
      <NodeRow
        depth={1}
        icon={<IconBook2 size={16} />}
        accentClass="text-violet-600 dark:text-night-violet"
        title={lesson.title}
        quizzesCount={lesson.quizzesCount}
        expanded={expanded}
        onToggle={toggle}
        onAttach={openAttachDialog}
      />

      <Collapse expanded={expanded}>
        <div className="flex flex-col gap-3 pb-2 pl-8">
          <AttachedQuizList
            quizzes={lesson.quizzes}
            emptyLabel="No quiz attached to this lesson yet."
            disabled={isDetaching}
            onRemove={handleRemoveQuiz}
          />

          <div className="flex flex-col gap-1.5">
            <Text size="xs" fw={700} c="gray.6" tt="uppercase">
              Sub-lessons
            </Text>
            {isLoadingSubLessons ? (
              <Loader size="sm" />
            ) : isEmpty(subLessons) ? (
              <Text size="sm" c="gray.5">
                This lesson has no sub-lessons.
              </Text>
            ) : (
              subLessons?.map((sl) => (
                <SubLessonNode key={sl.id} subLesson={sl} />
              ))
            )}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default LessonNode;
