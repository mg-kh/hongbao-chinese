import { z } from "zod";

const trimmed = (max: number) =>
  z
    .string()
    .min(1)
    .max(max)
    .transform((v) => v.trim());

export const CreateCardSchema = z.object({
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
  flashcardId: z.string().min(1).nullish(),
});
export type CreateCardRequest = z.input<typeof CreateCardSchema>;

export const UpdateCardSchema = CreateCardSchema.partial();
export type UpdateCardRequest = z.input<typeof UpdateCardSchema>;

export const FilterClientCardSchema = z.object({
  /** Matches cards whose flashcard belongs to this category. */
  categoryId: z.string().optional(),
  flashcardId: z.string().optional(),
});
export type FilterClientCardQuery = z.input<typeof FilterClientCardSchema>;

/** Dashboard card list: the client filters plus pagination. */
export const FilterCardSchema = FilterClientCardSchema.extend({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
export type FilterCardQuery = z.input<typeof FilterCardSchema>;
