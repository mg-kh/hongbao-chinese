import { useEditDrawer } from "@/providers/EditDrawerProvider";
import useLessons from "../../../../hooks/data-fetching/useLessons";
import { useForm } from "react-hook-form";
import useCourse from "../../../../hooks/data-fetching/useCourses";

const useContainer = () => {
  const filterForm = useForm({
    mode: "onChange",
  });
  const { open, opened } = useEditDrawer();
  const { data: lessonRes, isLoading } = useLessons({
    courseId: filterForm.watch("courseId"),
  });
  const { courseDropdownData, isLoading: courseDropdownDataLoading } =
    useCourse();

  return {
    open,
    opened,
    lessonRes,
    isLoading,
    filterForm,
    courseDropdownData,
    courseDropdownDataLoading,
  };
};

export default useContainer;
