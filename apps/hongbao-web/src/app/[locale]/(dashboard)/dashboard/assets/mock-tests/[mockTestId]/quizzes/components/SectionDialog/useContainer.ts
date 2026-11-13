import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import useCheckIsvalidSubmitButton from "@/hooks/useCheckIsvalidSubmitButton";
import useDisclosureAtom from "@/hooks/useDisclosureAtom";
import { useEditDrawer } from "@/providers/EditDrawerProvider";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SectionDialogAtom } from "../../store/quizzes.store";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
});
type FormField = z.infer<typeof schema>;

const useContainer = () => {
  const { opened, close } = useDisclosureAtom(SectionDialogAtom);
  const { currentId: quizId } = useEditDrawer();
  const { mockTestId } = useParams();

  const form = useForm<FormField>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
    },
  });
  const { handleSubmit } = form;

  const { mutate, isPending } = useMutationQuery({
    url: `dashboard/quiz-section`,
    invalidateKeys: [
      `dashboard/mock-test/${mockTestId}/quiz/${quizId}`,
      `dashboard/mock-test/${mockTestId}/quiz`,
    ],
  });

  const { isValid } = useCheckIsvalidSubmitButton({ form, isPending });

  const handleFormSubmit = handleSubmit((data) => {
    mutate(
      {
        ...data,
        quizId,
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

  return {
    opened,
    close,
    form,
    isPending,
    disabled: !isValid,
    handleFormSubmit,
  };
};

export default useContainer;
