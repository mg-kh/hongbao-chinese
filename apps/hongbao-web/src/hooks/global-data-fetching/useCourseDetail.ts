import { useParams } from "next/navigation";
import useApiQuery from "../fetching/useApiQuery";

export type TCourseDetail = {
  id: string;
  title: string;
  description: string;
  includedAssets: string[];
  level: string;
  isFree: boolean;
  price: number;
  perTime: number;
  discount: number;
  lessons: TCourseLesson[];
  quizzes: TQuiz[];
  videos: TCourseVideos[];
  videoCount: number;
  lessonCount: number;
};

export type TCourseVideos = {
  id: string;
  title: string;
  description: string;
  duration: number;
  url: string;
  /** Not returned by the API yet - drives the "finished" state in CourseNavigator. */
  isCompleted?: boolean;
};

export type TCourseLesson = {
  id: string;
  title: string;
  description: string;
  subLessons: TCourseSubLesson[];
  quizzes: TQuiz[];
};

export type TCourseSubLesson = {
  title: string;
  description: string;
  videos: TVideos[];
  quizzes: TQuiz[];
};

export type TVideos = {
  id: string;
  title: string;
  description: string;
  url: string;
  /** Not returned by the API yet - drives the "finished" state in CourseNavigator. */
  isCompleted?: boolean;
};

export type TQuiz = {
  id: string;
  title: string;
  /** Not returned by the API yet - drives the "finished" state in CourseNavigator. */
  isCompleted?: boolean;
};

const useCourseDetail = () => {
  const { courseId } = useParams();
  const {
    data: courseDetail,
    isFetching,
    isLoading,
  } = useApiQuery<{ data: TCourseDetail }, TCourseDetail>({
    url: `course-detail/${courseId}`,
    enabled: !!courseId,
    select: (data) => data?.data,
    key: ["course-detail", courseId],
  });

  return {
    courseDetail,
    isFetching,
    isLoading,
  };
};

export default useCourseDetail;
