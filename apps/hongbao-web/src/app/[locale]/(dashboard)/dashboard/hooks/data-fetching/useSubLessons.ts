import useApiQuery from "@/hooks/fetching/useApiQuery";
import { map } from "lodash";
import { useMemo } from "react";
import { TSubLessonRes } from "../../assets/sub-lessons/types/sub-lesson.type";

interface Props {
  courseId?: string;
  lessonId?: string;
  enabled?: boolean;
}

const useSubLessons = ({
  courseId = "",
  lessonId = "",
  enabled = true,
}: Props = {}) => {
  const {
    data: subLessonRes,
    isLoading,
    isFetching,
  } = useApiQuery<{ data: TSubLessonRes[] }, TSubLessonRes[]>({
    url: `dashboard/sub-lesson`,
    params: {
      courseId,
      lessonId,
    },
    key: "sub-lesson",
    enabled,
    select: (data) => data?.data,
  });

  const subLessonDropdownData = useMemo(() => {
    return map(subLessonRes, (c) => ({
      label: c.title,
      value: c.id,
    }));
  }, [subLessonRes]);

  return {
    data: subLessonRes || [],
    subLessonDropdownData: subLessonDropdownData || [],
    isLoading,
    isFetching,
  };
};

export default useSubLessons;
