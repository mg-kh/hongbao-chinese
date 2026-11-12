import { z } from "zod";

export const CreateLessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  courseId: z.string(),
});
export type CreateLessonRequest = z.input<typeof CreateLessonSchema>;
/** UpdateLessonDto currently reuses the create schema as-is. */
export type UpdateLessonRequest = CreateLessonRequest;

export const FilterLessonSchema = z.object({
  courseId: z.string().optional(),
});
export type FilterLessonQuery = z.input<typeof FilterLessonSchema>;

export const CreateSubLessonSchema = z.object({
  lessonId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
});
export type CreateSubLessonRequest = z.input<typeof CreateSubLessonSchema>;
export type UpdateSubLessonRequest = Partial<CreateSubLessonRequest>;

export const FilterSubLessonSchema = z.object({
  courseId: z.string().optional(),
  lessonId: z.string().optional(),
});
export type FilterSubLessonQuery = z.input<typeof FilterSubLessonSchema>;
