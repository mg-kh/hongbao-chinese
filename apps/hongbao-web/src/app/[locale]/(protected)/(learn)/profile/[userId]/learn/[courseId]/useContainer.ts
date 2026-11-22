import useLearnCourseDetail from "@/hooks/global-data-fetching/useLearnCourseDetail";

const useContainer = () => {
  const { courseDetail, isLoading } = useLearnCourseDetail();
  return {
    courseDetail,
    isLoading,
  };
};

export default useContainer;
