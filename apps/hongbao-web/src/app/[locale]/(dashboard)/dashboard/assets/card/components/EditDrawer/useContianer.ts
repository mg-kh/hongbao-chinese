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
import useFlashcards from "../../../../hooks/data-fetching/useFlashcards";
import { TCardRes } from "../../types/card.type";

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
  flashcardId: z.string().nullable(),
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
      flashcardId: null,
    },
  });
  const { control, handleSubmit, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "exampleUsage",
  });

  const { flashcardDropdownData, isLoading: flashcardDropdownDataLoading } =
    useFlashcards();

  const { data: cardDetail, isFetching } = useApiQuery<
    { data: TCardRes },
    TCardRes
  >({
    url: `dashboard/card/${currentId}`,
    enabled: !!currentId,
    select: (data) => data?.data,
    key: "card_detail",
  });
  const { mutate: save, isPending } = useMutationQuery({
    url: currentId ? `dashboard/card/${currentId}` : `dashboard/card`,
    method: currentId ? "patch" : "post",
    invalidateKeys: ["card", "flashcard"],
  });
  const { mutate: deleteItem, isPending: isDeletePending } = useMutationQuery({
    url: `dashboard/card/${currentId}`,
    method: "delete",
    invalidateKeys: ["card", "flashcard"],
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
        cnWord: cardDetail?.cnWord || "",
        pinyin: cardDetail?.pinyin || "",
        type: cardDetail?.type || "",
        meaningEn: cardDetail?.meaningEn || "",
        meaningMm: cardDetail?.meaningMm || "",
        exampleUsage: cardDetail?.exampleUsage?.length
          ? cardDetail.exampleUsage.map((e) => ({
              pinyin: e?.pinyin || "",
              chinese: e?.chinese || "",
              meaningEn: e?.meaningEn || "",
              meaningMm: e?.meaningMm || "",
            }))
          : [{ pinyin: "", chinese: "", meaningEn: "", meaningMm: "" }],
        flashcardId: cardDetail?.flashcardId || null,
      });
    }
  }, [cardDetail, reset, currentId]);

  const { isValid } = useCheckIsvalidSubmitButton({ form, isPending });

  return {
    handleFormSubmit,
    handleDelete,
    form,
    fields,
    append,
    remove,
    flashcardDropdownData,
    flashcardDropdownDataLoading,
    isFetching,
    isPending,
    isDeletePending,
    isValid,
  };
};

export default useContainer;
