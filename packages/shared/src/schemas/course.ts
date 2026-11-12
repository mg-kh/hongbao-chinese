import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  includedAssets: z.array(z.string()),
  isFree: z.boolean().default(false),
  price: z.number().nonnegative().default(0).nullable().optional(),
  perTime: z.number().default(0).nullable().optional(),
  published: z.boolean().default(false),
  categoryId: z.string().min(1).nullable().optional(),
});
export type CreateCourseRequest = z.input<typeof CreateCourseSchema>;
/** UpdateCourseDto currently reuses the create schema as-is. */
export type UpdateCourseRequest = CreateCourseRequest;
