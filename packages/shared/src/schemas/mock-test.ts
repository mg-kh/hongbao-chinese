import { z } from "zod";

export const CreateMockTestSchema = z.object({
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
export type CreateMockTestRequest = z.input<typeof CreateMockTestSchema>;

export const UpdateMockTestSchema = CreateMockTestSchema.partial();
export type UpdateMockTestRequest = z.input<typeof UpdateMockTestSchema>;
