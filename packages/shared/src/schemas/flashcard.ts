import { z } from "zod";

const trimmed = (max: number) =>
  z
    .string()
    .min(1)
    .max(max)
    .transform((v) => v.trim());

export const CreateFlashcardSchema = z.object({
  cnWord: trimmed(100),
  pinyin: trimmed(200),
  type: trimmed(50),
  meaningEn: trimmed(500),
  meaningMm: trimmed(500),
  exampleUsage: z
    .array(
      z.object({
        pinyin: trimmed(200),
        chinese: trimmed(200),
        meaningEn: trimmed(500),
        meaningMm: trimmed(500),
      }),
    )
    .default([]),
  categoryId: z.string().min(1),
});
export type CreateFlashcardRequest = z.input<typeof CreateFlashcardSchema>;

export const UpdateFlashcardSchema = CreateFlashcardSchema.partial();
export type UpdateFlashcardRequest = z.input<typeof UpdateFlashcardSchema>;

export const FilterClientFlashcardSchema = z.object({
  categoryId: z.string().optional(),
});
export type FilterClientFlashcardQuery = z.input<
  typeof FilterClientFlashcardSchema
>;
