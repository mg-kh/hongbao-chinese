import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import useCheckIsvalidSubmitButton from "@/hooks/useCheckIsvalidSubmitButton";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { map } from "lodash";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import useCategories from "../../../../hooks/data-fetching/useCategories";
import { TCourseRes } from "../../types/courses.type";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  includedAssets: z
    .array(
      z.object({
        text: z.string().min(1),
      }),
    )
    .min(1),
  categoryId: z.string().min(1),
  isFree: z.boolean(),
  published: z.boolean(),
  createdAt: z.date(),
  price: z.number().min(0),
  perTime: z.number().min(1),
});
type FormField = z.infer<typeof schema>;

const useContainer = () => {
  const { close, currentId } = useEditDrawer();
  const form = useForm<FormField>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",

      includedAssets: [
        {
          text: "",
        },
      ],

      isFree: false,
      published: false,

      price: 0,
      perTime: 1,

      createdAt: new Date(),
    },
  });
  const { control, handleSubmit, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "includedAssets",
  });

  const { categoryDropdownData, isLoading: categoryDropdownDataLoading } =
    useCategories();

  const { data: courseResDetail, isFetching } = useApiQuery<
    { data: TCourseRes },
    TCourseRes
  >({
    url: `dashboard/course/${currentId}`,
    enabled: !!currentId,
    select: (data) => data?.data,
  });
  const { mutate: save, isPending } = useMutationQuery({
    url: currentId ? `dashboard/course/${currentId}` : `dashboard/course`,
    method: currentId ? "patch" : "post",
    invalidateKeys: ["course"],
  });
  const { mutate: deleteItem, isPending: isDeletePending } = useMutationQuery({
    url: `dashboard/course/${currentId}`,
    method: "delete",
    invalidateKeys: ["course"],
  });

  const handleFormSubmit = handleSubmit((data) => {
    save(
      {
        ...data,
        includedAssets: data?.includedAssets?.map((a) => a.text),
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

  useEffect(() => {
    if (currentId) {
      reset({
        title: courseResDetail?.title || "",
        description: courseResDetail?.description || "",
        includedAssets: courseResDetail?.includedAssets?.length
          ? map(courseResDetail.includedAssets, (ass) => ({ text: ass || "" }))
          : [{ text: "" }],
        categoryId: courseResDetail?.categoryId || "",
        isFree: courseResDetail?.isFree || false,
        published: courseResDetail?.published || false,
        createdAt: courseResDetail?.createdAt
          ? new Date(courseResDetail?.createdAt)
          : new Date(),
        price: courseResDetail?.price || 0,
        perTime: courseResDetail?.perTime || 1,
      });
    }
  }, [courseResDetail, reset, currentId]);

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
