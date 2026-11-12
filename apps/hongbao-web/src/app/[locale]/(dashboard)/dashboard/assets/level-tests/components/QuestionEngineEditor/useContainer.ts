import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import { useRouter } from "@/i18n/navigation";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty, isUndefined } from "lodash";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TMultipleChoiceOption, TQuestion } from "../../types/question.type";
import { QuestionType } from "./components/QuestionTypeSelector/QuestionTypeSelector";
import { QuizFormField, QuizSchema } from "./quiz-editor-schema";

const useContainer = () => {
  const { levelTestId, quizzId, sectionId, questionId } = useParams();
  const router = useRouter();
  const currentQuestionId = questionId?.[0];
  const isEdit = !!currentQuestionId;

  const form = useForm<QuizFormField>({
    mode: "onChange",
    resolver: zodResolver(QuizSchema),
    defaultValues: {
      type: QuestionType.MULTIPLE_CHOICES,
      title: "",
      data: {
        question: "",
        options: [],
        answer: "",
      },
    },
  });

  const { handleSubmit, reset } = form;

  const { data: questionDetail, isLoading } = useApiQuery<
    { data: TQuestion },
    TQuestion
  >({
    url: `dashboard/question/${currentQuestionId}`,
    enabled: isEdit,
    select: (data) => data?.data,
  });
  const { mutate: save } = useMutationQuery({
    url: isEdit
      ? `dashboard/question/${currentQuestionId}`
      : `dashboard/question`,
    method: isEdit ? "patch" : "post",
  });

  const handleFormSubmit = handleSubmit((data) => {
    const hasSection = !isUndefined(sectionId);
    save(
      {
        ...(hasSection ? { sectionId } : { quizId: quizzId }),
        type: data?.type,
        title: data?.title,
        data: data?.data,
      },
      {
        onSuccess: () => {
          showSuccessNoti();
          router.push(
            hasSection
              ? `/dashboard/assets/level-tests/${levelTestId}/quizzes/${quizzId}/${sectionId}`
              : `/dashboard/assets/level-tests/${levelTestId}/quizzes/${quizzId}/questions`,
          );
        },
        onError: (e: TErrorOptions) => {
          showErrorNoti(e.message);
        },
      },
    );
  });

  useEffect(() => {
    if (isEdit) {
      if (!isEmpty(questionDetail)) {
        switch (questionDetail?.type) {
          case QuestionType.MULTIPLE_CHOICES:
            reset({
              type: QuestionType.MULTIPLE_CHOICES,
              title: questionDetail?.title,
              data: {
                question: questionDetail?.data?.question,
                options:
                  (questionDetail?.data?.options as TMultipleChoiceOption[]) ??
                  [],
                answer: questionDetail?.data?.answer,
              },
            });
            break;
          case QuestionType.TRUE_OR_FALSE:
            reset({
              type: QuestionType.TRUE_OR_FALSE,
              title: questionDetail?.title,
              data: {
                question: questionDetail?.data?.question,
                options: (questionDetail?.data?.options as string[]) ?? [],
                answer: questionDetail?.data?.answer,
              },
            });
            break;
          case QuestionType.REARRANGE:
            reset({
              type: QuestionType.REARRANGE,
              title: questionDetail?.title,
              data: {
                questions: questionDetail?.data?.questions || [],
                answers: questionDetail?.data?.answers || [],
              },
            });
            break;
        }
      }
    }
  }, [questionDetail, reset, isEdit]);

  return {
    form,
    handleFormSubmit,
    isLoading,
    levelTestId,
    quizzId,
  };
};

export default useContainer;
