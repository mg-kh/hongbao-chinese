import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TLevelTestRes } from "../../types/level-test.type";

const useContainer = () => {
  const { open, opened } = useEditDrawer();

  const { data: levelTests, isLoading } = useApiQuery<
    { data: TLevelTestRes[] },
    TLevelTestRes[]
  >({
    url: `dashboard/level-test`,
    key: "level-test",
    select: (data) => data?.data,
  });

  return { open, opened, levelTests: levelTests || [], isLoading };
};

export default useContainer;
