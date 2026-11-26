import useApiQuery from "@/hooks/fetching/useApiQuery";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { useDisclosure } from "@mantine/hooks";
import { TFeedbackRes } from "../../types/feedback.type";

const useContainer = () => {
  const { open, opened } = useEditDrawer();
  const [importOpened, { open: openImport, close: closeImport }] =
    useDisclosure(false);

  const { data: feedbacks, isLoading } = useApiQuery<
    { data: TFeedbackRes[] },
    TFeedbackRes[]
  >({
    url: `dashboard/feedback`,
    key: "feedback",
    select: (data) => data?.data,
  });

  return {
    open,
    opened,
    feedbacks,
    isLoading,
    importOpened,
    openImport,
    closeImport,
  };
};

export default useContainer;
