import { TRearrangeWord } from "@/utils/normalizeRearrange";
import { QuestionType } from "@repo/shared";

export { QuestionType };

/** Mirrors the question shape the dashboard's question engine produces. */
export type TQuizQuestion = {
  id: string;
  quizId?: string;
  /** Instruction shown above the question, e.g. "Choose the correct answer". */
  title: string;
  explanation?: string | null;
  order?: number;
  type: QuestionType | string;
  data: {
    /** Rich text (HTML) for MULTIPLE_CHOICES and TRUE_OR_FALSE. */
    question?: string;
    /** Rich text (HTML) for MULTIPLE_CHOICES; plain text for TRUE_OR_FALSE. */
    options?: Array<{ label: string; value: string }>;
    /** Always plain text, even when `options` is HTML. */
    answer?: string;
    /** REARRANGE: the word bank (legacy questions store plain strings). */
    questions?: string[] | TRearrangeWord[];
    /** REARRANGE: the word ids in their correct order (legacy: the words). */
    answers?: string[];
  };
  sectionId?: string | null;
};

/** The single-quiz endpoint's response shape (`learning-progress/quiz/:quizId`). */
export type TQuiz = {
  id: string;
  title: string;
  description?: string | null;
  questions: TQuizQuestion[];
};

/** What the learner picked. Rearrange answers are an ordered list. */
export type TAnswer = string | string[] | undefined;

export type TGradedQuestion = {
  question: TQuizQuestion;
  given: TAnswer;
  correct: string;
  givenLabel: string;
  isCorrect: boolean;
  isAnswered: boolean;
};

/** Submit-ready payload, shaped from the form's `answers` map on submit. */
export type TQuizSubmission = {
  quizId: string;
  answers: Array<{
    questionId: string;
    answer: TAnswer;
    /** Human-readable text of the pick (option label / joined words), so the
     * payload is legible without re-resolving option codes downstream. */
    answerLabel: string;
  }>;
};
