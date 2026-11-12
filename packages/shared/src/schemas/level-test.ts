import { z } from "zod";

export const CreateLevelTestSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(200)
    .transform((v) => v.trim()),
  description: z.string().nullish(),
  price: z.number().nonnegative().default(0).nullable().optional(),
  perTime: z.number().nonnegative().default(0).nullable().optional(),
  published: z.boolean().default(false).optional(),
  categoryId: z.string().min(1),
});
export type CreateLevelTestRequest = z.input<typeof CreateLevelTestSchema>;

export const UpdateLevelTestSchema = CreateLevelTestSchema.partial();
export type UpdateLevelTestRequest = z.input<typeof UpdateLevelTestSchema>;
