import { z } from "zod";

export const CreateVideoSchema = z.object({
  subLessonId: z.string().optional(),
  courseId: z.string().optional(),
  title: z.string().min(1),
  description: z.string(),
  url: z.string(),
  duration: z.number().optional(),
  isIntroVideo: z.boolean(),
});
export type CreateVideoRequest = z.input<typeof CreateVideoSchema>;
export type UpdateVideoRequest = Partial<CreateVideoRequest>;

export const FilterVideoSchema = z.object({
  courseId: z.string().optional(),
  lessonId: z.string().optional(),
  subLessonId: z.string().optional(),
});
export type FilterVideoQuery = z.input<typeof FilterVideoSchema>;
