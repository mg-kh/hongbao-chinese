import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import useCheckIsvalidSubmitButton from "@/hooks/useCheckIsvalidSubmitButton";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TQuiz } from "../../types/quiz.type";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
});
type FormField = z.infer<typeof schema>;

const useContainer = () => {
  const { close, currentId } = useEditDrawer();
  const form = useForm<FormField>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
    },
  });
  const { handleSubmit, reset } = form;

  const { data: quizDetail, isFetching } = useApiQuery<{ data: TQuiz }, TQuiz>({
    url: `dashboard/quiz/${currentId}`,
    enabled: !!currentId,
    select: (data) => data?.data,
    key: "quiz_detail",
  });
  const { mutate: save, isPending } = useMutationQuery({
    url: currentId ? `dashboard/quiz/${currentId}` : `dashboard/quiz`,
    method: currentId ? "patch" : "post",
    invalidateKeys: ["quiz"],
  });
  const { mutate: deleteItem, isPending: isDeletePending } = useMutationQuery({
    url: `dashboard/quiz/${currentId}`,
    method: "delete",
    invalidateKeys: ["quiz"],
  });
  const handleFormSubmit = handleSubmit((data) => {
    save(
      {
        ...data,
      },
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

  const { isValid } = useCheckIsvalidSubmitButton({ form, isPending });

  useEffect(() => {
    if (currentId) {
      reset({
        title: quizDetail?.title || "",
        description: quizDetail?.description,
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
  };
};

export default useContainer;
