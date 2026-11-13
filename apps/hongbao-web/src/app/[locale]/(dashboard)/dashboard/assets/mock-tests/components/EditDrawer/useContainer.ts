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
import { TMockTestRes } from "../../types/mock-test.type";

const schema = z.object({
  title: z
    .string()
    .min(1)
    .max(200)
    .transform((v) => v.trim()),
  description: z.string().nullish(),
  price: z.number().nonnegative().default(0).nullable().optional(),
  perTime: z.number().nonnegative().default(1).nullable().optional(),
  published: z.boolean().default(false).optional(),
  categoryId: z.string().min(1),
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
      price: 0,
      perTime: 1,
      published: false,
      categoryId: "",
    },
  });
  const { handleSubmit, reset } = form;

  const { categoryDropdownData, isLoading: categoryDropdownDataLoading } =
    useCategories();

  const { data: mockTestDetail, isFetching } = useApiQuery<
    { data: TMockTestRes },
    TMockTestRes
  >({
    url: `dashboard/mock-test/${currentId}`,
    enabled: !!currentId,
    select: (data) => data?.data,
    key: "mock-test_detail",
  });
  const { mutate: save, isPending } = useMutationQuery({
    url: currentId
      ? `dashboard/mock-test/${currentId}`
      : `dashboard/mock-test`,
    method: currentId ? "patch" : "post",
    invalidateKeys: ["mock-test"],
  });
  const { mutate: deleteItem, isPending: isDeletePending } = useMutationQuery({
    url: `dashboard/mock-test/${currentId}`,
    method: "delete",
    invalidateKeys: ["mock-test"],
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
        title: mockTestDetail?.title || "",
        description: mockTestDetail?.description || "",
        price: mockTestDetail?.price || 0,
        perTime: mockTestDetail?.perTime || 0,
        published: mockTestDetail?.published || false,
        categoryId: mockTestDetail?.categoryId || "",
      });
    }
  }, [mockTestDetail, reset, currentId]);

  const { isValid } = useCheckIsvalidSubmitButton({ form, isPending });

  return {
    form,
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
