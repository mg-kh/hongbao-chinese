import useApiQuery from "@/hooks/fetching/useApiQuery";
import { map } from "lodash";
import { useMemo } from "react";
import { TLessonRes } from "../../assets/lessons/types/lessons.type";

interface Props {
  courseId?: string;
  enabled?: boolean;
}

const useLessons = ({ courseId = "", enabled = true }: Props = {}) => {
  const {
    data: lessonRes,
    isLoading,
    isFetching,
  } = useApiQuery<{ data: TLessonRes[] }, TLessonRes[]>({
    url: `/dashboard/lesson`,
    key: "lesson",
    params: { courseId },
    enabled,
    select: (data) => data?.data,
  });

  const lessonDropdownData = useMemo(() => {
    return map(lessonRes, (c) => ({
      label: c.title,
      value: c.id,
    }));
  }, [lessonRes]);

  return {
    data: lessonRes || [],
    lessonDropdownData: lessonDropdownData || [],
    isLoading,
    isFetching,
  };
};

export default useLessons;
