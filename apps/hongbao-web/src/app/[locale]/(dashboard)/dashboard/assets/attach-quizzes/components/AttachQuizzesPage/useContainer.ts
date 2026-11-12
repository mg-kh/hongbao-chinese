import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import useCourse from "../../../../hooks/data-fetching/useCourses";
import { AttachTargetAtom } from "../../types/attach-quizzes.type";

const useContainer = () => {
  const [search, setSearch] = useState("");
  const { data: courses, isLoading } = useCourse();
  const attachTarget = useAtomValue(AttachTargetAtom);

  const filteredCourses = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(keyword));
  }, [courses, search]);

  return {
    search,
    setSearch,
    isLoading,
    courses,
    filteredCourses,
    isDialogOpen: Boolean(attachTarget),
  };
};

export default useContainer;
