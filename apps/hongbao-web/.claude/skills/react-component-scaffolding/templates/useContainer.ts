import { useApiQuery } from "@/hooks/fetching/useApiQuery";
import { useMutationQuery } from "@/hooks/fetching/useMutationQuery";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TErrorOptions } from "./../../../../src/types/general.type";

const schema = z.object({});
type FormField = z.infer<typeof schema>;

const useContainer = () => {
  const form = useForm<FormField>({
    resolver: zodResolver(schema),
  });
  const { handleSubmit, reset } = form;
  const { data: detail } = useApiQuery({
    url: ``,
  });
  const { mutate } = useMutationQuery({
    url: ``,
  });

  const handleFormSubmit = handleSubmit((data) => {
    mutate(
      {},
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

  useEffect(() => {
    reset({
      //
    });
  }, [detail, reset]);

  return {
    form,
    handleFormSubmit,
  };
};
export default useContainer;
