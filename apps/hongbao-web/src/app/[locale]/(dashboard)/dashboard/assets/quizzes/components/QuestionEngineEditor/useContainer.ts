import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import { useRouter } from "@/i18n/navigation";
import { TErrorOptions } from "@/types/general.type";
import { showErrorNoti, showSuccessNoti } from "@/utils/notifications-helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty, isUndefined } from "lodash";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { TMultipleChoiceOption, TQuestion } from "../../types/question.type";
import { QuestionType } from "./components/QuestionTypeSelector/QuestionTypeSelector";
import {
  QuizFormField,
  QuizSchema,
  getEmptyValues,
  getFirstErrorMessage,
} from "./quiz-editor-schema";
import { normalizeRearrange } from "@/utils/normalizeRearrange";
import { normalizeTrueOrFalse } from "@/utils/normalizeTrueOrFalse";
import { nanoid } from "nanoid";

const useContainer = () => {
  const { quizzId, questionId, sectionId } = useParams();
  const router = useRouter();
  const currentQuestionId = questionId?.[0];
  const isEdit = !!currentQuestionId;

  const form = useForm<QuizFormField>({
    mode: "onChange",
    resolver: zodResolver(QuizSchema),
    defaultValues: getEmptyValues(QuestionType.MULTIPLE_CHOICES),
  });

  const { handleSubmit, reset } = form;

  const { detailUrl, createUrl, updateUrl } = useMemo(() => {
    // with section
    if (!isUndefined(sectionId)) {
      const detailUrl = `dashboard/question/${currentQuestionId}`;
      const createUrl = `dashboard/question`;
      const updateUrl = `dashboard/question/${currentQuestionId}`;
      return {
        detailUrl,
        createUrl,
        updateUrl,
      };
    } else {
      const detailUrl = `dashboard/question/${currentQuestionId}`;
      const createUrl = `dashboard/question`;
      const updateUrl = `dashboard/question/${currentQuestionId}`;
      return {
        detailUrl,
        createUrl,
        updateUrl,
      };
    }
  }, [sectionId, currentQuestionId]);

  const { data: questionDetail, isLoading } = useApiQuery<
    { data: TQuestion },
    TQuestion
  >({
    url: detailUrl,
    enabled: isEdit,
    select: (data) => data?.data,
  });
  const { mutate: save } = useMutationQuery({
    url: isEdit ? updateUrl : createUrl,
    method: isEdit ? "patch" : "post",
  });

  const handleFormSubmit = handleSubmit(
    (data) => {
      const payload = isUndefined(sectionId)
        ? {
            quizId: quizzId,
            type: data?.type,
            title: data?.title,
            data: data?.data,
          }
        : {
            quizId: quizzId,
            sectionId: sectionId,
            type: data?.type,
            title: data?.title,
            data: data?.data,
          };
      save(
        {
          ...payload,
        },
        {
          onSuccess: () => {
            showSuccessNoti();
            router.back();
          },
          onError: (e: TErrorOptions) => {
            showErrorNoti(e.message);
          },
        },
      );
    },
    (errors) => {
      showErrorNoti(
        getFirstErrorMessage(errors) ?? "Please fill in all required fields",
      );
    },
  );

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
                ...normalizeTrueOrFalse(
                  questionDetail?.data?.options,
                  questionDetail?.data?.answer,
                  () => nanoid(),
                ),
              },
            });
            break;
          case QuestionType.REARRANGE:
            reset({
              type: QuestionType.REARRANGE,
              title: questionDetail?.title,
              data: normalizeRearrange(
                questionDetail?.data?.questions,
                questionDetail?.data?.answers,
              ),
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
    quizzId,
  };
};

export default useContainer;
