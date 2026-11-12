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
import { TCourseRes } from "../../../../assets/courses/types/courses.type";

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
  level: z.string().min(1),
  price: z.number().min(0),
  isFree: z.boolean(),
  published: z.boolean(),
  createdAt: z.date(),
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
      level: "",
      price: 0,

      includedAssets: [
        {
          text: "",
        },
      ],

      isFree: false,
      published: false,

      createdAt: new Date(),
    },
  });
  const { control, handleSubmit, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "includedAssets" as never,
  });

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
        includedAssets: map(courseResDetail?.includedAssets, (ass) => ({
          text: ass || "",
        })),
        level: courseResDetail?.level || "",
        price: courseResDetail?.price || 0,
        isFree: courseResDetail?.isFree || false,
        published: courseResDetail?.published || false,
        createdAt: courseResDetail?.createdAt
          ? new Date(courseResDetail?.createdAt)
          : new Date(),
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
    isFetching,
    isPending,
    isDeletePending,
    isValid,
  };
};

export default useContainer;
