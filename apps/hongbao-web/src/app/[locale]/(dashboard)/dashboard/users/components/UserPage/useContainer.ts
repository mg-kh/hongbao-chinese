import { useEditDrawer } from "@/providers/EditDrawerProvider";

const useContainer = () => {
  const { open, opened } = useEditDrawer();

  return {
    open,
    opened,
  };
};

export default useContainer;
