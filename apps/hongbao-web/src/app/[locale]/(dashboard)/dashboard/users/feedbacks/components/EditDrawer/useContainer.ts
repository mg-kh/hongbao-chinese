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
import { TFeedbackRes } from "../../types/feedback.type";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  position: z.string(),
  content: z.string().trim().min(1, "Feedback is required"),
  rating: z.number().int().min(1, "Rating is required").max(5),
});
type FormField = z.infer<typeof schema>;

// Both the dashboard list and the public landing-page section read feedbacks.
const INVALIDATE_KEYS = ["feedback", "all-feedbacks"];

const useContainer = () => {
  const { close, currentId } = useEditDrawer();
  const form = useForm<FormField>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: { name: "", position: "", content: "", rating: 5 },
  });
  const { handleSubmit, reset } = form;

  const { data: feedbackDetail, isFetching } = useApiQuery<
    { data: TFeedbackRes },
    TFeedbackRes
  >({
    url: `dashboard/feedback/${currentId}`,
    enabled: !!currentId,
    select: (data) => data?.data,
  });
  const { mutate: save, isPending } = useMutationQuery({
    url: currentId ? `dashboard/feedback/${currentId}` : `dashboard/feedback`,
    method: currentId ? "patch" : "post",
    invalidateKeys: INVALIDATE_KEYS,
  });
  const { mutate: deleteItem, isPending: isDeletePending } = useMutationQuery({
    url: `dashboard/feedback/${currentId}`,
    method: "delete",
    invalidateKeys: INVALIDATE_KEYS,
  });

  const handleFormSubmit = handleSubmit((data) => {
    save(
      { ...data, position: data.position.trim() || null },
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

  useEffect(() => {
    if (currentId && feedbackDetail) {
      reset({
        name: feedbackDetail.name || "",
        position: feedbackDetail.position || "",
        content: feedbackDetail.content || "",
        rating: feedbackDetail.rating ?? 5,
      });
    }
  }, [feedbackDetail, reset, currentId]);

  const { isValid } = useCheckIsvalidSubmitButton({ form, isPending });

  return {
    handleFormSubmit,
    handleDelete,
    form,
    isFetching,
    isPending,
    isDeletePending,
    isValid,
  };
};

export default useContainer;
