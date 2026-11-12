import useApiQuery from "../fetching/useApiQuery";

export type TCourseRes = {
  id: string;
  title: string;
  description: string;
  includedAssets: string[];
  isFree: boolean;
  price: number;
  perTime: number;
  discount: number;
  category: {
    id: string;
    name: string;
  };
};

const useAllCourseList = () => {
  const { data: courses, isLoading } = useApiQuery<
    { data: TCourseRes[] },
    TCourseRes[]
  >({
    url: `all-courses`,
    select: (data) => data?.data,
  });

  return {
    courses,
    isLoading,
  };
};

export default useAllCourseList;
