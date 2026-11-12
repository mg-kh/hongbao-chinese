import useAllCourseList from "@/hooks/global-data-fetching/useAllCourseList";

const useContainer = () => {
  const { courses } = useAllCourseList();

  return {
    courses,
  };
};

export default useContainer;
