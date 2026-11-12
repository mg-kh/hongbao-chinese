import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { useForm } from "react-hook-form";
import useCourse from "../../../../hooks/data-fetching/useCourses";
import useLessons from "../../../../hooks/data-fetching/useLessons";
import useSubLessons from "../../../../hooks/data-fetching/useSubLessons";

const useContainer = () => {
  const filterForm = useForm({
    mode: "onChange",
  });
  const { open, opened } = useEditDrawer();

  const { data: subLessonRes, isLoading } = useSubLessons({
    courseId: filterForm.watch("courseId"),
    lessonId: filterForm.watch("lessonId"),
  });
  const { courseDropdownData, isLoading: courseDropdownDataLoading } =
    useCourse();
  const { lessonDropdownData, isLoading: lessonDropdownDataLoading } =
    useLessons({
      courseId: filterForm.watch("courseId"),
    });

  return {
    open,
    opened,
    subLessonRes,
    isLoading,
    filterForm,
    courseDropdownData,
    courseDropdownDataLoading,
    lessonDropdownData,
    lessonDropdownDataLoading,
  };
};

export default useContainer;
