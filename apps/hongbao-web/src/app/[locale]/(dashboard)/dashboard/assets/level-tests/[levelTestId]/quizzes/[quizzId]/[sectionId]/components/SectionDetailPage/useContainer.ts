import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import useDisclosureAtom from "@/hooks/useDisclosureAtom";
import { DeleteDialogAtom } from "@/store/general.store";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { useParams } from "next/navigation";
import {
  TQuestion,
  TSectionDetail,
} from "../../../../../../types/question.type";
import { TSectionFormField } from "../EditSectionDrawer/useContainer";

const useContainer = () => {
  const { quizzId, sectionId } = useParams();
  const { open, opened } = useEditDrawer();
  const {
    open: openDeleteDialog,
    opened: isDeleteDialogOpened,
    close: closeDeleteDialog,
    currentValue: deletingQuestionId,
  } = useDisclosureAtom(DeleteDialogAtom);

  const { data: sectionDetail, isLoading } = useApiQuery<
    { data: TSectionDetail },
    TSectionDetail
  >({
    url: `dashboard/quiz-section/quiz/${quizzId}/section/${sectionId}`,
    enabled: !!quizzId && !!sectionId,
    select: (data) => data?.data,
    key: "level-test-section-detail",
  });

  const { data: questions, isLoading: isQuestionsLoading } = useApiQuery<
    { data: TQuestion[] },
    TQuestion[]
  >({
    url: `dashboard/question`,
    params: {
      quizzId,
      sectionId,
    },
    enabled: !!sectionId,
    select: (data) => data?.data,
    key: "level-test-section-questions",
  });

  const { mutate: deleteQuestion, isPending: isDeleting } = useMutationQuery({
    method: "delete",
    url: `dashboard/question/${deletingQuestionId}`,
    invalidateKeys: ["level-test-section-questions"],
  });

  const handleDelete = () => {
    deleteQuestion(
      {},
      {
        onSuccess: () => {
          showSuccessNoti();
          closeDeleteDialog();
        },
        onError: (e: TErrorOptions) => {
          showErrorNoti(e.message);
        },
      },
    );
  };

  const section: TSectionFormField = {
    title: sectionDetail?.title ?? "",
    description: sectionDetail?.description ?? "",
    timeLimit: sectionDetail?.timeLimit ?? null,
    audioUrl: sectionDetail?.audioUrl ?? null,
  };

  return {
    section,
    isLoading,
    questions: questions ?? [],
    isQuestionsLoading,
    open,
    opened,
    openDeleteDialog,
    isDeleteDialogOpened,
    closeDeleteDialog,
    handleDelete,
    isDeleting,
  };
};

export default useContainer;
