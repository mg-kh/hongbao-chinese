import { Collapse } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import React from "react";
import { TSubLessonRes } from "../../../sub-lessons/types/sub-lesson.type";
import AttachedQuizList from "../AttachedQuizList/AttachedQuizList";
import NodeRow from "../NodeRow/NodeRow";
import useContainer from "./useContainer";

interface Props {
  subLesson: TSubLessonRes;
}

const SubLessonNode: React.FC<Props> = ({ subLesson }) => {
  const { expanded, toggle, openAttachDialog, handleRemoveQuiz, isDetaching } =
    useContainer(subLesson);

  return (
    <div className="flex flex-col gap-1.5">
      <NodeRow
        depth={2}
        icon={<IconFileText size={16} />}
        accentClass="text-teal-600 dark:text-night-teal"
        title={subLesson.title}
        quizzesCount={subLesson.quizzesCount}
        expanded={expanded}
        onToggle={toggle}
        onAttach={openAttachDialog}
      />

      <Collapse expanded={expanded}>
        <div className="pb-2 pl-14">
          <AttachedQuizList
            quizzes={subLesson.quizzes}
            emptyLabel="No quiz attached to this sub-lesson yet."
            disabled={isDetaching}
            onRemove={handleRemoveQuiz}
          />
        </div>
      </Collapse>
    </div>
  );
};

export default SubLessonNode;
