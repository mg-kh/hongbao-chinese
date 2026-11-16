import { z } from "zod";
import { QuestionType } from "./components/QuestionTypeSelector/QuestionTypeSelector";

const MultipleChoiceSchema = z.object({
  type: z.literal(QuestionType.MULTIPLE_CHOICES),
  title: z.string(), // Choose the correct answer
  data: z.object({
    question: z.string(), // Nice ---- meet you
    options: z.array(
      z.object({
        value: z.nanoid(),
        label: z.string(),
      }),
    ), // a.) to b.) in c.)or d.)up
    answer: z.nanoid(), // to
  }),
});
const RearrangeSchema = z.object({
  type: z.literal(QuestionType.REARRANGE),
  title: z.string(), // Re-arrange to get the correct answer
  data: z.object({
    questions: z.array(z.string()), // ['Hello', 'nice', 'to', 'meet', 'you']
    answers: z.array(z.string()), // ['Hello', 'nice', 'to', 'meet', 'you']
  }),
});
const TrueOrFalseSchema = z.object({
  type: z.literal(QuestionType.TRUE_OR_FALSE),
  title: z.string(),
  data: z.object({
    question: z.string(),
    options: z.array(z.string()),
    answer: z.string(),
  }),
});

export const QuizSchema = z.discriminatedUnion("type", [
  MultipleChoiceSchema,
  TrueOrFalseSchema,
  RearrangeSchema,
]);
export type QuizFormField = z.infer<typeof QuizSchema>;
