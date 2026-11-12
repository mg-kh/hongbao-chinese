import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .transform((v) => v.trim()),
  description: z.string().nullish(),
  courseIds: z.array(z.string().min(1)).default([]),
});
export type CreateCategoryRequest = z.input<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial();
export type UpdateCategoryRequest = z.input<typeof UpdateCategorySchema>;

export const CategoryToCourseSchema = z.object({
  categoryId: z.string().min(1),
  courseId: z.string().min(1),
});
export type CategoryToCourseRequest = z.input<typeof CategoryToCourseSchema>;
