import { useEditDrawer } from "@/providers/EditDrawerProvider";
import useCourse from "../../../../hooks/data-fetching/useCourses";

const useContainer = () => {
  const { open, opened } = useEditDrawer();

  const { data: courseRes, isLoading } = useCourse();
  return { open, opened, courseRes, isLoading };
};

export default useContainer;
