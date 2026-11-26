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
import useCategories from "../../../../hooks/data-fetching/useCategories";
import { TFlashcardRes } from "../../types/flashcard.type";

const schema = z.object({
  name: z
    .string()
    .min(1)
    .max(200)
    .transform((v) => v.trim()),
  categoryId: z.string().min(1),
  price: z.number().int().nonnegative(),
  published: z.boolean(),
});
type FormField = z.infer<typeof schema>;

const useContainer = () => {
  const { close, currentId } = useEditDrawer();
  const form = useForm<FormField>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      categoryId: "",
      price: 0,
      published: false,
    },
  });
  const { handleSubmit, reset } = form;

  const { categoryDropdownData, isLoading: categoryDropdownDataLoading } =
    useCategories();

  const { data: flashcardDetail, isFetching } = useApiQuery<
    { data: TFlashcardRes },
    TFlashcardRes
  >({
    url: `dashboard/flashcard/${currentId}`,
    enabled: !!currentId,
    select: (data) => data?.data,
    key: "flashcard_detail",
  });
  const { mutate: save, isPending } = useMutationQuery({
    url: currentId ? `dashboard/flashcard/${currentId}` : `dashboard/flashcard`,
    method: currentId ? "patch" : "post",
    invalidateKeys: ["flashcard"],
  });
  const { mutate: deleteItem, isPending: isDeletePending } = useMutationQuery({
    url: `dashboard/flashcard/${currentId}`,
    method: "delete",
    // Deleting a flashcard detaches its cards, so refresh the card list too.
    invalidateKeys: ["flashcard", "card"],
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

  useEffect(() => {
    if (currentId) {
      reset({
        name: flashcardDetail?.name || "",
        categoryId: flashcardDetail?.categoryId || "",
        price: flashcardDetail?.price || 0,
        published: flashcardDetail?.published || false,
      });
    }
  }, [flashcardDetail, reset, currentId]);

  const { isValid } = useCheckIsvalidSubmitButton({ form, isPending });

  return {
    form,
    flashcardDetail,
    categoryDropdownData,
    categoryDropdownDataLoading,
    isFetching,
    isPending,
    isDeletePending,
    isValid,
    handleFormSubmit,
    handleDelete,
  };
};

export default useContainer;
