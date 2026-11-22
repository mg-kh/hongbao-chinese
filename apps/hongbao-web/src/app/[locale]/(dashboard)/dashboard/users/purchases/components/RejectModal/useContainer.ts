import { zodResolver } from "@hookform/resolvers/zod";
import { PurchaseRejectSchema } from "@repo/shared";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RejectFormSchema = PurchaseRejectSchema.pick({ reason: true });
export type TRejectForm = z.infer<typeof RejectFormSchema>;

const useContainer = (onSubmit: (reason: string) => void) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRejectForm>({
    resolver: zodResolver(RejectFormSchema),
    defaultValues: { reason: "" },
  });

  return {
    register,
    errors,
    submit: handleSubmit(({ reason }) => onSubmit(reason)),
  };
};

export default useContainer;
