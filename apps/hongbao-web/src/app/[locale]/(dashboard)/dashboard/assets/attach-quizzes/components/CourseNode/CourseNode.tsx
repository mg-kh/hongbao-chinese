import { Collapse, Loader, Text } from "@mantine/core";
import { IconSchool } from "@tabler/icons-react";
import { isEmpty } from "lodash";
import React from "react";
import { TCourseRes } from "../../../courses/types/courses.type";
import AttachedQuizList from "../AttachedQuizList/AttachedQuizList";
import LessonNode from "../LessonNode/LessonNode";
import NodeRow from "../NodeRow/NodeRow";
import useContainer from "./useContainer";

interface Props {
  course: TCourseRes;
}

const CourseNode: React.FC<Props> = ({ course }) => {
  const {
    expanded,
    toggle,
    lessons,
    isLoadingLessons,
    openAttachDialog,
    handleRemoveQuiz,
    isDetaching,
  } = useContainer(course);

  return (
    <div className="flex flex-col gap-1.5">
      <NodeRow
        depth={0}
        icon={<IconSchool size={17} />}
        accentClass="text-blue-600 dark:text-night-blue"
        title={course.title}
        quizzesCount={course.quizzesCount}
        expanded={expanded}
        onToggle={toggle}
        onAttach={openAttachDialog}
      />

      <Collapse expanded={expanded}>
        <div className="flex flex-col gap-3 pb-2 pl-3">
          <AttachedQuizList
            quizzes={course.quizzes}
            emptyLabel="No quiz attached to this course yet."
            disabled={isDetaching}
            onRemove={handleRemoveQuiz}
          />

          <div className="flex flex-col gap-1.5">
            <Text size="xs" fw={700} c="gray.6" tt="uppercase">
              Lessons
            </Text>
            {isLoadingLessons ? (
              <Loader size="sm" />
            ) : isEmpty(lessons) ? (
              <Text size="sm" c="gray.5">
                This course has no lessons.
              </Text>
            ) : (
              lessons?.map((lesson) => (
                <LessonNode
                  key={lesson.id}
                  lesson={lesson}
                  courseId={course.id}
                />
              ))
            )}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default CourseNode;
