import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import useCheckIsvalidSubmitButton from "@/hooks/useCheckIsvalidSubmitButton";
import useDisclosureAtom from "@/hooks/useDisclosureAtom";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { DeleteDialogAtom } from "@/store/general.store";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TQuiz } from "../../../../types/quiz.type";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
  isLevelTest: z.boolean().nullish(),
});
type FormField = z.infer<typeof schema>;

const useContainer = () => {
  const { close, currentId } = useEditDrawer();
  const { levelTestId } = useParams();
  const form = useForm<FormField>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      isLevelTest: true,
    },
  });
  const { handleSubmit, reset } = form;
  const {
    open: deleteDialogOpen,
    opened: deleteDialogOpened,
    close: deleteDialogClose,
    currentValue,
  } = useDisclosureAtom(DeleteDialogAtom);

  const { data: quizDetail, isFetching } = useApiQuery<{ data: TQuiz }, TQuiz>({
    url: `dashboard/level-test/${levelTestId}/quiz/${currentId}`,
    enabled: !!currentId && !!levelTestId,
    select: (data) => data?.data,
  });
  const { mutate: save, isPending } = useMutationQuery({
    url: currentId
      ? `dashboard/level-test/${levelTestId}/quiz/${currentId}`
      : `dashboard/level-test/${levelTestId}/quiz`,
    method: currentId ? "patch" : "post",
    invalidateKeys: [`dashboard/level-test/${levelTestId}/quiz`],
  });
  const { mutate: deleteItem, isPending: isDeletePending } = useMutationQuery({
    url: `dashboard/level-test/${levelTestId}/quiz/${currentId}`,
    method: "delete",
    invalidateKeys: [`dashboard/level-test/${levelTestId}/quiz`],
  });
  const { mutate: deleteSectionItem, isPending: deleteSectionItemPending } =
    useMutationQuery({
      url: `dashboard/quiz-section/${currentValue}`,
      method: "delete",
      invalidateKeys: [
        `dashboard/level-test/${levelTestId}/quiz/${currentId}`,
        `dashboard/level-test/${levelTestId}/quiz`,
      ],
    });

  const handleFormSubmit = handleSubmit((data) => {
    save(data, {
      onSuccess: () => {
        showSuccessNoti();
        close();
      },
      onError: (e: TErrorOptions) => {
        showErrorNoti(e.message);
      },
    });
  });
  const handleDelete = (cb: () => void) => {
    deleteItem(
      {},
      {
        onSuccess: () => {
          showSuccessNoti();
          cb();
          close();
        },
        onError: (e) => {
          showErrorNoti(e.message);
        },
      },
    );
  };
  const handleDeleteSection = () => {
    deleteSectionItem(
      {},
      {
        onSuccess: () => {
          showSuccessNoti();
          deleteDialogClose();
        },
        onError: (e: TErrorOptions) => {
          showErrorNoti(e.message);
        },
      },
    );
  };

  const { isValid } = useCheckIsvalidSubmitButton({ form, isPending });

  useEffect(() => {
    if (currentId) {
      reset({
        title: quizDetail?.title || "",
        description: quizDetail?.description,
        isLevelTest: quizDetail?.isLevelTest ?? false,
      });
    }
  }, [reset, currentId, quizDetail]);

  return {
    form,
    isPending,
    isValid,
    isFetching,
    isDeletePending,
    handleFormSubmit,
    handleDelete,
    quizDetail,
    deleteDialogOpened,
    deleteDialogClose,
    deleteDialogOpen,
    handleDeleteSection,
    deleteSectionItemPending,
  };
};

export default useContainer;
