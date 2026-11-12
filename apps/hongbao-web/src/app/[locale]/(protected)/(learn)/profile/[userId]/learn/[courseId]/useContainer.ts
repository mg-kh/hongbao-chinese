import useCourseDetail from "@/hooks/global-data-fetching/useCourseDetail";

const useContainer = () => {
  const { courseDetail, isLoading } = useCourseDetail();
  return {
    courseDetail,
    isLoading,
  };
};

export default useContainer;
