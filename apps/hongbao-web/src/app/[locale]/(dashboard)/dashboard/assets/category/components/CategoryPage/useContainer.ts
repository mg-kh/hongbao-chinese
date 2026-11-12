import { useEditDrawer } from "@/providers/EditDrawerProvider";
import useCategories from "../../../../hooks/data-fetching/useCategories";

const useContainer = () => {
  const { open, opened } = useEditDrawer();

  const { data: categoryRes, isLoading } = useCategories();
  return { open, opened, categoryRes, isLoading };
};

export default useContainer;
