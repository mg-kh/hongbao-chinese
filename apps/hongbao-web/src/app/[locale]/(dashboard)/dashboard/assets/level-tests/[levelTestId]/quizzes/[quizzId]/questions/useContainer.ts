import useApiQuery from "@/hooks/fetching/useApiQuery";
import useDisclosureAtom from "@/hooks/useDisclosureAtom";
import { useRouter } from "@/i18n/navigation";
import { DeleteDialogAtom } from "@/store/general.store";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import { useParams } from "next/navigation";
import { TQuestion } from "../../../../types/question.type";

const useContainer = () => {
  const router = useRouter();
  const { quizzId } = useParams();
  const { open, opened, close, currentValue } =
    useDisclosureAtom(DeleteDialogAtom);
  const { data: questions, isLoading } = useApiQuery<
    { data: TQuestion[] },
    TQuestion[]
  >({
    url: `dashboard/question`,
    params: {
      quizId: quizzId,
    },
    select: (data) => data?.data,
    key: "level-test-quiz-questions",
  });
  const { mutate: deleteItem, isPending } = useMutationQuery({
    method: "delete",
    url: `dashboard/question/${currentValue}`,
    invalidateKeys: ["level-test-quiz-questions"],
  });
  const handleDelete = () => {
    deleteItem(
      {},
      {
        onSuccess: () => {
          showSuccessNoti();
          close();
        },
        onError: (e: TErrorOptions) => {
          showErrorNoti(e.message);
        },
      },
    );
  };

  return {
    router,
    questions,
    isLoading,
    open,
    opened,
    close,
    handleDelete,
    isPending,
  };
};
export default useContainer;
