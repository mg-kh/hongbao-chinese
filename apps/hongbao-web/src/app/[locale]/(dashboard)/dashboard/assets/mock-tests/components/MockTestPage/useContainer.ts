import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TMockTestRes } from "../../types/mock-test.type";

const useContainer = () => {
  const { open, opened } = useEditDrawer();

  const { data: mockTests, isLoading } = useApiQuery<
    { data: TMockTestRes[] },
    TMockTestRes[]
  >({
    url: `dashboard/mock-test`,
    key: "mock-test",
    select: (data) => data?.data,
  });

  return { open, opened, mockTests: mockTests || [], isLoading };
};

export default useContainer;
