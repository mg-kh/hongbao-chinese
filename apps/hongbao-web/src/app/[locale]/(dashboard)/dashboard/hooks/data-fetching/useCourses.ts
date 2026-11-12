import useApiQuery from "@/hooks/fetching/useApiQuery";
import { map } from "lodash";
import { useMemo } from "react";
import { TCourseRes } from "../../assets/courses/types/courses.type";

const useCourse = () => {
  const {
    data: courseRes,
    isLoading,
    isFetching,
  } = useApiQuery<{ data: TCourseRes[] }, TCourseRes[]>({
    url: `dashboard/course`,
    key: "course",
    select: (data) => data?.data,
  });

  const courseDropdownData = useMemo(() => {
    return map(courseRes, (c) => ({
      label: c.title,
      value: c.id,
    }));
  }, [courseRes]);

  return {
    data: courseRes || [],
    courseDropdownData: courseDropdownData || [],
    isLoading,
    isFetching,
  };
};

export default useCourse;
