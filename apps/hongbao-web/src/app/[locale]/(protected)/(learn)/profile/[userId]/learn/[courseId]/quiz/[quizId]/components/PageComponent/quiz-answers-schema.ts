import { z } from "zod";

/** Ordered word list for REARRANGE, or the picked option value otherwise. */
export const QuizAnswerValueSchema = z.union([
  z.string(),
  z.array(z.string()),
]);

/** Keyed by question id so any quiz length/shape can be represented. */
export const QuizAnswersSchema = z.object({
  answers: z.record(z.string(), QuizAnswerValueSchema.optional()),
});

export type QuizAnswersFormField = z.infer<typeof QuizAnswersSchema>;
