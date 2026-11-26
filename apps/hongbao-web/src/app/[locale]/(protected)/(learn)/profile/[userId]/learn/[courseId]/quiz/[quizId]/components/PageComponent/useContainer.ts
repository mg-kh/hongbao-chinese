import { learningActivityKey } from "@/hooks/global-data-fetching/useLearningActivity";
import useApiQuery from "@/hooks/fetching/useApiQuery";
import useMutationQuery from "@/hooks/fetching/useMutationQuery";
import { addCompletedToCache } from "@/hooks/global-data-fetching/useCompletedProgress";
import {
  completedQuizzesKey,
  useCompletedQuizzes,
} from "@/hooks/global-data-fetching/useCompletedQuizzes";
import useLearnCourseDetail from "@/hooks/global-data-fetching/useLearnCourseDetail";
import { flattenCourseItems } from "@/utils/flattenCourseItems";
import {
  normalizeRearrange,
  rearrangeLabels,
} from "@/utils/normalizeRearrange";
import { normalizeTrueOrFalse } from "@/utils/normalizeTrueOrFalse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  BaseSyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { QuizAnswersFormField, QuizAnswersSchema } from "./quiz-answers-schema";
import {
  QuestionType,
  TAnswer,
  TGradedQuestion,
  TQuiz,
  TQuizQuestion,
  TQuizSubmission,
} from "./types/quiz.type";

/** `options`/`question` are rich text (e.g. "<p>Mouse</p>") while `answer` is
 * always plain text, so tags need stripping before comparing the two. */
const stripHtml = (value: string) => value.replace(/<[^>]+>/g, "").trim();

/** Re-arrange answers are word ids (like option values); resolves them to the
 * space-joined sentence. Comparing words rather than ids means two identical
 * words (e.g. two 的) placed in swapped slots still count as correct. */
const rearrangeSentence = (q: TQuizQuestion, ids: string[] = []) => {
  const { questions } = normalizeRearrange(q.data.questions, q.data.answers);
  return stripHtml(rearrangeLabels(questions, ids).join(" "));
};

/** The expected re-arrange answer's word ids (legacy word lists converted). */
const rearrangeAnswerIds = (q: TQuizQuestion) =>
  normalizeRearrange(q.data.questions, q.data.answers).answers;

/** An answer flattened to one comparable string - option codes for
 * single-choice, the resolved sentence for re-arrange. For grading, not display. */
const toValue = (q: TQuizQuestion, value: TAnswer) =>
  Array.isArray(value) ? rearrangeSentence(q, value) : stripHtml(value ?? "");

/** Resolves an answer to display text: a single-choice option's label
 * (options carry nanoid values, not words) or the sentence for re-arrange.
 * May contain rich text (e.g. ruby) - render it as HTML. */
const answerLabelOf = (q: TQuizQuestion, value: TAnswer) => {
  if (Array.isArray(value)) return rearrangeSentence(q, value);
  const option = (q.data.options || []).find((o) => o.value === value);
  return option?.label ?? value ?? "";
};

/** The expected answer's raw value(s), for the correctness check. */
const correctValueOf = (q: TQuizQuestion) =>
  q.type === QuestionType.REARRANGE
    ? rearrangeSentence(q, rearrangeAnswerIds(q))
    : stripHtml(q.data.answer ?? "");

/** The expected answer as display text for the review screen. */
const correctLabelOf = (q: TQuizQuestion) =>
  q.type === QuestionType.REARRANGE
    ? rearrangeSentence(q, rearrangeAnswerIds(q))
    : answerLabelOf(q, q.data.answer);

/** Performance bands drive the headline message on the results screen.
 * `key` maps to `Learn.Quiz.band.<key>.{title,body}` messages. */
const bandFor = (percent: number) => {
  if (percent === 100) return { key: "perfect", tone: "success" as const };
  if (percent >= 80) return { key: "great", tone: "success" as const };
  if (percent >= 50) return { key: "good", tone: "attention" as const };
  return { key: "retry", tone: "danger" as const };
};

/** Stable fallback so `answers` keeps referential identity across renders
 * before the form has any values yet. */
const EMPTY_ANSWERS: QuizAnswersFormField["answers"] = {};
const EMPTY_GRADED: TGradedQuestion[] = [];
const EMPTY_QUESTIONS: TQuizQuestion[] = [];

/** Quiz content rarely changes; keep it cached across navigations. */
const QUIZ_STALE_TIME = 5 * 60 * 1000;

/** Converts legacy true/false questions (plain option strings, answer stored
 * as the option text) to id-based options so picking and grading use ids. */
const selectQuestions = (data: { data: TQuiz }) =>
  data?.data?.questions?.map((q) =>
    q.type === QuestionType.TRUE_OR_FALSE
      ? {
          ...q,
          data: {
            ...q.data,
            ...normalizeTrueOrFalse(q.data.options, q.data.answer),
          },
        }
      : q,
  );

/** A short, actionable tip per question on the review screen - returns the
 * `Learn.Quiz.suggestion.<key>` message key. */
const suggestionKeyFor = (g: TGradedQuestion) => {
  if (g.isCorrect) return "correct";
  if (!g.isAnswered) return "skipped";

  switch (g.question.type) {
    case QuestionType.REARRANGE:
      return "rearrange";
    case QuestionType.TRUE_OR_FALSE:
      return "true_or_false";
    default:
      return "default";
  }
};

const useContainer = () => {
  const t = useTranslations("Learn.Quiz");
  const { quizId, courseId, userId } = useParams<{
    quizId: string;
    courseId: string;
    userId: string;
  }>();

  const { data: apiQuestions, isLoading } = useApiQuery<
    { data: TQuiz },
    TQuizQuestion[]
  >({
    url: `learning-progress/quiz/${quizId}`,
    enabled: !!quizId,
    retry: false,
    select: selectQuestions,
    staleTime: QUIZ_STALE_TIME,
  });

  const questions = apiQuestions ?? EMPTY_QUESTIONS;

  const form = useForm<QuizAnswersFormField>({
    mode: "onChange",
    resolver: zodResolver(QuizAnswersSchema),
    defaultValues: { answers: {} },
  });
  const { control, reset, handleSubmit } = form;

  const answers = useWatch({ control, name: "answers" }) ?? EMPTY_ANSWERS;

  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submission, setSubmission] = useState<TQuizSubmission | null>(null);
  // Wall-clock reads aren't allowed during render, so the timer starts on
  // mount instead.
  const startedAt = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // ---------- completion ----------
  const { isQuizCompleted } = useCompletedQuizzes();
  const isCompleted = isQuizCompleted(quizId);

  // The course detail carries no completion state, so only the completed
  // list changes - patched in place rather than refetched.
  const queryClient = useQueryClient();
  const { mutate: markQuizComplete, isPending: isMarkingComplete } =
    useMutationQuery({
      url: `learning-progress/quiz/${quizId}/complete`,
      onSuccess: () => {
        addCompletedToCache(queryClient, completedQuizzesKey(userId), quizId);
        // Marked stale; refetched next time the profile streak mounts.
        queryClient.invalidateQueries({
          queryKey: learningActivityKey(userId),
        });
      },
    });

  const handleMarkComplete = () => {
    if (isCompleted || isMarkingComplete) return;
    markQuizComplete({});
  };

  // ---------- next item ----------
  const { courseDetail } = useLearnCourseDetail();
  const { nextItem, quizTitle } = useMemo(() => {
    const items = flattenCourseItems(courseDetail);
    const i = items.findIndex((it) => it.type === "quiz" && it.id === quizId);
    return {
      nextItem: i >= 0 ? items[i + 1] : undefined,
      quizTitle: i >= 0 ? items[i].title : undefined,
    };
  }, [courseDetail, quizId]);

  const nextHref = nextItem
    ? `/profile/${userId}/learn/${courseId}/${nextItem.type}/${nextItem.id}`
    : undefined;

  const total = questions.length;
  const current = questions[index];
  const currentAnswer = current ? answers[current.id] : undefined;

  const answeredCount = questions.filter((q) => {
    const a = answers[q.id];
    return Array.isArray(a) ? a.length > 0 : !!a;
  }).length;

  const isAnswered = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : !!currentAnswer;

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(total - 1, i + 1));
  const goTo = (i: number) => setIndex(Math.min(Math.max(0, i), total - 1));

  /** Shapes the form's answers map into a submit-ready payload. */
  const buildSubmission = (values: QuizAnswersFormField): TQuizSubmission => ({
    quizId,
    answers: questions.map((q) => {
      const answer = values.answers[q.id];
      return {
        questionId: q.id,
        answer,
        answerLabel: answerLabelOf(q, answer),
      };
    }),
  });

  const onValid = (values: QuizAnswersFormField) => {
    setSubmission(buildSubmission(values));
    setSubmitted(true);
    // submitting a quiz counts as finishing it - no-op if already completed
    handleMarkComplete();
  };

  const submit = (e?: BaseSyntheticEvent) => {
    const started = startedAt.current ?? Date.now();
    setElapsed(Math.round((Date.now() - started) / 1000));
    return handleSubmit(onValid)(e);
  };

  const retake = () => {
    reset({ answers: {} });
    setIndex(0);
    setSubmitted(false);
    setSubmission(null);
    startedAt.current = Date.now();
    setElapsed(0);
  };

  // Only needed on the results screen - skip grading on every answer change
  // while the quiz is still being taken.
  const graded = useMemo<TGradedQuestion[]>(
    () =>
      !submitted
        ? EMPTY_GRADED
        : questions.map((q) => {
            const given = answers[q.id];
            const givenValue = toValue(q, given);
            return {
              question: q,
              given,
              correct: correctLabelOf(q),
              givenLabel: answerLabelOf(q, given),
              isAnswered: Array.isArray(given) ? given.length > 0 : !!given,
              isCorrect: !!givenValue && givenValue === correctValueOf(q),
            };
          }),
    [submitted, questions, answers],
  );

  const score = graded.filter((g) => g.isCorrect).length;
  const percent = total ? Math.round((score / total) * 100) : 0;

  const { key: bandKey, tone } = bandFor(percent);
  const band = {
    title: t(`band.${bandKey}.title`),
    body: t(`band.${bandKey}.body`),
    tone,
  };
  const suggestionFor = (g: TGradedQuestion) =>
    t(`suggestion.${suggestionKeyFor(g)}`);

  return {
    form,
    isLoading,
    questions,
    total,
    index,
    current,
    isAnswered,
    answeredCount,
    answers,
    goPrev,
    goNext,
    goTo,
    submit,
    retake,
    submitted,
    submission,
    graded,
    score,
    percent,
    elapsed,
    band,
    suggestionFor,
    isCompleted,
    isMarkingComplete,
    handleMarkComplete,
    courseHref: `/profile/${userId}/learn/${courseId}`,
    myCoursesHref: `/profile/${userId}/my-courses`,
    courseTitle: courseDetail?.title,
    quizTitle,
    nextHref,
  };
};

export default useContainer;
