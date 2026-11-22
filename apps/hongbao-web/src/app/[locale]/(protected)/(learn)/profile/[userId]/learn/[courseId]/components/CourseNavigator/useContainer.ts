import useLearnCourseDetail from "@/hooks/global-data-fetching/useLearnCourseDetail";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useCompletedVideos } from "@/hooks/global-data-fetching/useCompletedVideos";
import { useCompletedQuizzes } from "@/hooks/global-data-fetching/useCompletedQuizzes";

const useContainer = () => {
  const { courseId, userId, videoId, quizId } = useParams();
  const [expandSidbar, setExpendSidebar] = useState(true);
  const { courseDetail, isLoading } = useLearnCourseDetail();
  const { completedIds, isVideoCompleted } = useCompletedVideos();
  const { completedIds: completedQuizIds, isQuizCompleted } =
    useCompletedQuizzes();

  /**
   * Overall completion across every video/quiz in the course. The course
   * detail API doesn't carry completion state, so both videos and quizzes
   * are checked against the user's `learning-progress` completed lists.
   */
  const progress = useMemo(() => {
    let total = 0;
    let completed = 0;

    const countVideos = (items?: { id: string; isCompleted?: boolean }[]) => {
      items?.forEach((item) => {
        total += 1;
        if (item?.isCompleted || completedIds.includes(item.id)) completed += 1;
      });
    };
    const countQuizzes = (items?: { id: string; isCompleted?: boolean }[]) => {
      items?.forEach((item) => {
        total += 1;
        if (item?.isCompleted || completedQuizIds.includes(item.id))
          completed += 1;
      });
    };

    courseDetail?.lessons?.forEach((lesson) => {
      lesson?.subLessons?.forEach((sub) => {
        countVideos(sub?.videos);
        countQuizzes(sub?.quizzes);
      });
      countQuizzes(lesson?.quizzes);
    });
    countQuizzes(courseDetail?.quizzes);

    return {
      total,
      completed,
      percent: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [courseDetail, completedIds, completedQuizIds]);

  /** The lesson containing the currently open video/quiz, if any - drives
   * auto-expanding that lesson's accordion item in CourseNavigator. */
  const activeLessonId = useMemo(() => {
    const activeId = videoId || quizId;
    if (!activeId) return undefined;

    return courseDetail?.lessons?.find((lesson) => {
      const subVideoIds =
        lesson?.subLessons?.flatMap(
          (sub) => sub?.videos?.map((v) => v.id) || [],
        ) || [];
      const subQuizIds =
        lesson?.subLessons?.flatMap(
          (sub) => sub?.quizzes?.map((q) => q.id) || [],
        ) || [];
      const lessonQuizIds = lesson?.quizzes?.map((q) => q.id) || [];

      return [...subVideoIds, ...subQuizIds, ...lessonQuizIds].includes(
        activeId as string,
      );
    })?.id;
  }, [courseDetail, videoId, quizId]);

  return {
    expandSidbar,
    setExpendSidebar,
    courseDetail,
    isLoading,
    courseId,
    userId,
    videoId,
    quizId,
    progress,
    isVideoCompleted,
    isQuizCompleted,
    activeLessonId,
  };
};

export default useContainer;
