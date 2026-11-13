import { z } from "zod";

export const CreateQuizSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
});
export type CreateQuizRequest = z.input<typeof CreateQuizSchema>;
export type UpdateQuizRequest = Partial<CreateQuizRequest>;

export const QuizToCourseSchema = z.object({
  quizId: z.string().min(1),
  courseId: z.string().min(1),
});
export type QuizToCourseRequest = z.input<typeof QuizToCourseSchema>;

export const QuizToLessonSchema = z.object({
  quizId: z.string().min(1),
  lessonId: z.string().min(1),
});
export type QuizToLessonRequest = z.input<typeof QuizToLessonSchema>;

export const QuizToSubLessonSchema = z.object({
  quizId: z.string().min(1),
  subLessonId: z.string().min(1),
});
export type QuizToSubLessonRequest = z.input<typeof QuizToSubLessonSchema>;

export const QuizToMockTestSchema = z.object({
  quizId: z.string().min(1),
  mockTestId: z.string().min(1),
});
export type QuizToMockTestRequest = z.input<typeof QuizToMockTestSchema>;

export const CreateQuizSectionSchema = z.object({
  quizId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullish(),
  timeLimit: z.number().int().positive().nullish(),
  audioUrl: z.string().url().nullish(),
});
export type CreateQuizSectionRequest = z.input<typeof CreateQuizSectionSchema>;
export type UpdateQuizSectionRequest = Partial<CreateQuizSectionRequest>;
