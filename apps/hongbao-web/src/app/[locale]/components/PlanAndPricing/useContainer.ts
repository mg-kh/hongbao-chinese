import useAllCourseList from "@/hooks/global-data-fetching/useAllCourseList";

const useContainer = () => {
  const { courses, isLoading } = useAllCourseList();

  return {
    courses,
    isLoading,
  };
};

export default useContainer;
