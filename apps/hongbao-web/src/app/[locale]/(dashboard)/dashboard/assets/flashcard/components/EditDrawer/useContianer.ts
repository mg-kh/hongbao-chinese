import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import useCheckIsvalidSubmitButton from "@/hooks/useCheckIsvalidSubmitButton";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import useCategories from "../../../../hooks/data-fetching/useCategories";
import { TFlashcardRes } from "../../types/flashcard.type";

const schema = z.object({
  cnWord: z.string().min(1),
  pinyin: z.string().min(1),
  type: z.string().min(1),
  meaningEn: z.string().min(1),
  meaningMm: z.string().min(1),
  exampleUsage: z
    .array(
      z.object({
        pinyin: z.string().min(1),
        chinese: z.string().min(1),
        meaningEn: z.string().min(1),
        meaningMm: z.string().min(1),
      }),
    )
    .min(1),
  categoryId: z.string().min(1),
});
type FormField = z.infer<typeof schema>;

const useContainer = () => {
  const { close, currentId } = useEditDrawer();
  const form = useForm<FormField>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      cnWord: "",
      pinyin: "",
      type: "",
      meaningEn: "",
      meaningMm: "",
      exampleUsage: [
        {
          pinyin: "",
          chinese: "",
          meaningEn: "",
          meaningMm: "",
        },
      ],
      categoryId: "",
    },
  });
  const { control, handleSubmit, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "exampleUsage",
  });

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
    url: currentId
      ? `dashboard/flashcard/${currentId}`
      : `dashboard/flashcard`,
    method: currentId ? "patch" : "post",
    invalidateKeys: ["flashcard"],
  });
  const { mutate: deleteItem, isPending: isDeletePending } = useMutationQuery({
    url: `dashboard/flashcard/${currentId}`,
    method: "delete",
    invalidateKeys: ["flashcard"],
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
        cnWord: flashcardDetail?.cnWord || "",
        pinyin: flashcardDetail?.pinyin || "",
        type: flashcardDetail?.type || "",
        meaningEn: flashcardDetail?.meaningEn || "",
        meaningMm: flashcardDetail?.meaningMm || "",
        exampleUsage: flashcardDetail?.exampleUsage?.length
          ? flashcardDetail.exampleUsage.map((e) => ({
              pinyin: e?.pinyin || "",
              chinese: e?.chinese || "",
              meaningEn: e?.meaningEn || "",
              meaningMm: e?.meaningMm || "",
            }))
          : [{ pinyin: "", chinese: "", meaningEn: "", meaningMm: "" }],
        categoryId: flashcardDetail?.categoryId || "",
      });
    }
  }, [flashcardDetail, reset, currentId]);

  const { isValid } = useCheckIsvalidSubmitButton({ form, isPending });

  return {
    handleFormSubmit,
    handleDelete,
    form,
    fields,
    append,
    remove,
    categoryDropdownData,
    categoryDropdownDataLoading,
    isFetching,
    isPending,
    isDeletePending,
    isValid,
  };
};

export default useContainer;
