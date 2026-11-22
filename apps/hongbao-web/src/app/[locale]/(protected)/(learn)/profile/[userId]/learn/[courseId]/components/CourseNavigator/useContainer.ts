import { useCompletedQuizzes } from "@/hooks/global-data-fetching/useCompletedQuizzes";
import { useCompletedVideos } from "@/hooks/global-data-fetching/useCompletedVideos";
import useLearnCourseDetail from "@/hooks/global-data-fetching/useLearnCourseDetail";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

type TItem = { id: string; isCompleted?: boolean };
type TLessonStats = { done: number; total: number; isDone: boolean };

const useContainer = () => {
  const { courseId, userId, videoId, quizId } = useParams<{
    courseId: string;
    userId: string;
    videoId?: string;
    quizId?: string;
  }>();
  const [expandSidbar, setExpendSidebar] = useState(true);
  const { courseDetail, isLoading } = useLearnCourseDetail();
  const { completedSet: completedVideoSet, isVideoCompleted } =
    useCompletedVideos();
  const { completedSet: completedQuizSet, isQuizCompleted } =
    useCompletedQuizzes();

  /**
   * One pass over the course for overall progress and per-lesson counts. The
   * course detail API doesn't carry completion state, so both videos and
   * quizzes are checked against the user's `learning-progress` completed
   * lists. Recomputed only when the course or a completed list changes - not
   * on route changes or accordion toggles.
   */
  const { progress, lessonStats } = useMemo(() => {
    let total = 0;
    let completed = 0;
    const stats: Record<string, TLessonStats> = {};

    const count = (items: TItem[] | undefined, set: Set<string>) => {
      let t = 0;
      let d = 0;
      items?.forEach((item) => {
        t += 1;
        if (item?.isCompleted || set.has(item.id)) d += 1;
      });
      return [t, d] as const;
    };

    courseDetail?.lessons?.forEach((lesson) => {
      let lessonTotal = 0;
      let lessonDone = 0;
      const add = ([t, d]: readonly [number, number]) => {
        lessonTotal += t;
        lessonDone += d;
      };
      lesson?.subLessons?.forEach((sub) => {
        add(count(sub?.videos, completedVideoSet));
        add(count(sub?.quizzes, completedQuizSet));
      });
      add(count(lesson?.quizzes, completedQuizSet));

      stats[lesson.id] = {
        total: lessonTotal,
        done: lessonDone,
        isDone: lessonTotal > 0 && lessonDone === lessonTotal,
      };
      total += lessonTotal;
      completed += lessonDone;
    });

    const [finalTotal, finalDone] = count(
      courseDetail?.quizzes,
      completedQuizSet,
    );
    total += finalTotal;
    completed += finalDone;

    return {
      lessonStats: stats,
      progress: {
        total,
        completed,
        percent: total ? Math.round((completed / total) * 100) : 0,
      },
    };
  }, [courseDetail, completedVideoSet, completedQuizSet]);

  /** The lesson containing the currently open video/quiz, if any - drives
   * auto-expanding that lesson's accordion item in CourseNavigator. */
  const activeLessonId = useMemo(() => {
    const activeId = videoId || quizId;
    if (!activeId) return undefined;

    return courseDetail?.lessons?.find(
      (lesson) =>
        lesson?.quizzes?.some((q) => q.id === activeId) ||
        lesson?.subLessons?.some(
          (sub) =>
            sub?.videos?.some((v) => v.id === activeId) ||
            sub?.quizzes?.some((q) => q.id === activeId),
        ),
    )?.id;
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
    lessonStats,
    isVideoCompleted,
    isQuizCompleted,
    activeLessonId,
  };
};

export default useContainer;
