import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TVideo } from "../../types/videos.type";
import { useForm } from "react-hook-form";
import useCourse from "../../../../hooks/data-fetching/useCourses";
import useLessons from "../../../../hooks/data-fetching/useLessons";
import useSubLessons from "../../../../hooks/data-fetching/useSubLessons";

const useContainer = () => {
  const filterForm = useForm({});
  const { open, opened } = useEditDrawer();
  const { courseDropdownData, isLoading: courseDropdownDataLoading } =
    useCourse();
  const { lessonDropdownData, isLoading: lessonDropdownDataLoading } =
    useLessons({
      courseId: filterForm.watch("courseId"),
    });
  const { subLessonDropdownData, isLoading: subLessonDropdownDataLoading } =
    useSubLessons({
      courseId: filterForm.watch("courseId"),
      lessonId: filterForm.watch("lessonId"),
    });
  const { data: videos, isLoading } = useApiQuery<{ data: TVideo[] }, TVideo[]>(
    {
      url: `dashboard/video`,
      select: (data) => data?.data,
      params: {
        courseId: filterForm.watch("courseId"),
        lessonId: filterForm.watch("lessonId"),
        subLessonId: filterForm.watch("subLessonId"),
      },
    },
  );

  return {
    open,
    opened,
    videos,
    isLoading,
    filterForm,
    courseDropdownData,
    courseDropdownDataLoading,
    lessonDropdownData,
    lessonDropdownDataLoading,
    subLessonDropdownData,
    subLessonDropdownDataLoading,
  };
};

export default useContainer;
