import useCourseDetail from "@/hooks/global-data-fetching/useCourseDetail";

const useContainer = () => {
  const { courseDetail, isFetching } = useCourseDetail();

  return {
    courseDetail,
    isFetching,
  };
};

export default useContainer;
