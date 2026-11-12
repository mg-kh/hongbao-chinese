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
import { TCategoryRes } from "../../types/category.type";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});
type FormField = z.infer<typeof schema>;

const useContainer = () => {
  const { close, currentId } = useEditDrawer();
  const form = useForm<FormField>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const { handleSubmit, reset } = form;

  const { data: categoryDetail, isFetching } = useApiQuery<
    { data: TCategoryRes },
    TCategoryRes
  >({
    url: `dashboard/category/${currentId}`,
    enabled: !!currentId,
    select: (data) => data?.data,
    key: "category_detail",
  });
  const { mutate: save, isPending } = useMutationQuery({
    url: currentId ? `dashboard/category/${currentId}` : `dashboard/category`,
    method: currentId ? "patch" : "post",
    invalidateKeys: ["category"],
  });
  const { mutate: deleteItem, isPending: isDeletePending } = useMutationQuery({
    url: `dashboard/category/${currentId}`,
    method: "delete",
    invalidateKeys: ["category"],
  });

  const handleFormSubmit = handleSubmit((data) => {
    save(
      { ...data },
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
        name: categoryDetail?.name || "",
        description: categoryDetail?.description || "",
      });
    }
  }, [categoryDetail, reset, currentId]);

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
