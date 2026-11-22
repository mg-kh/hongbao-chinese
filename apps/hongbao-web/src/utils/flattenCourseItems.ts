import { TCourseDetail } from "@/hooks/global-data-fetching/useCourseDetail";

export type TCourseItem = {
  type: "video" | "quiz";
  id: string;
  title?: string;
};

/** In-order list of every video/quiz in the course - mirrors the order
 * CourseNavigator renders, so prev/next stays in sync with the sidebar. */
export const flattenCourseItems = (courseDetail?: TCourseDetail) => {
  const items: TCourseItem[] = [];

  courseDetail?.lessons?.forEach((lesson) => {
    lesson?.subLessons?.forEach((sub) => {
      sub?.videos?.forEach((v) =>
        items.push({ type: "video", id: v.id, title: v.title }),
      );
      sub?.quizzes?.forEach((q) =>
        items.push({ type: "quiz", id: q.id, title: q.title }),
      );
    });
    lesson?.quizzes?.forEach((q) =>
      items.push({ type: "quiz", id: q.id, title: q.title }),
    );
  });
  courseDetail?.quizzes?.forEach((q) =>
    items.push({ type: "quiz", id: q.id, title: q.title }),
  );

  return items;
};
