import { z } from "zod";
import { JsonSchema } from "../common.js";
import { QuestionType } from "../enums.js";

export const CreateQuestionSchema = z.object({
  quizId: z.string().optional(),
  sectionId: z.string().optional(),
  type: z.enum(QuestionType),
  title: z.string(),
  data: JsonSchema,
});
export type CreateQuestionRequest = z.input<typeof CreateQuestionSchema>;
export type UpdateQuestionRequest = Partial<CreateQuestionRequest>;

export const FilterQuestionSchema = z.object({
  quizzId: z.string(),
  sectionId: z.string().nullish(),
});
export type FilterQuestionQuery = z.input<typeof FilterQuestionSchema>;
