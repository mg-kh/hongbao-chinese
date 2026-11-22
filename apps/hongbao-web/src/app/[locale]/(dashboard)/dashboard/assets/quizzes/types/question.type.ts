import { TRearrangeWord } from "@/utils/normalizeRearrange";
export type TMultipleChoiceOption = {
  value: string;
  label: string;
};

export type TQuestion = {
  id: string;
  quizId: string;
  type: string;
  data: {
    answer: string;
    options: string[] | TMultipleChoiceOption[];
    question: string;
    answers?: string[];
    questions?: string[] | TRearrangeWord[];
  };
  createdAt: string;
  title: string;
  updatedAt: string;
  userId: string;
};
