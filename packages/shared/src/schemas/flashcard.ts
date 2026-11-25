import { z } from "zod";

// A flashcard is a deck that groups many cards (Flashcard 1 -> N Card).
const FlashcardBaseSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(200)
    .transform((v) => v.trim()),
  categoryId: z.string().min(1),
  price: z.number().int().nonnegative(),
  published: z.boolean(),
});

export const CreateFlashcardSchema = FlashcardBaseSchema.extend({
  price: FlashcardBaseSchema.shape.price.default(0),
  published: FlashcardBaseSchema.shape.published.default(false),
});
export type CreateFlashcardRequest = z.input<typeof CreateFlashcardSchema>;

// Built from the base (no defaults): in zod v4 `.partial()` still applies
// defaults, which would reset price/published on every PATCH.
export const UpdateFlashcardSchema = FlashcardBaseSchema.partial();
export type UpdateFlashcardRequest = z.input<typeof UpdateFlashcardSchema>;

export const FilterFlashcardSchema = z.object({
  categoryId: z.string().optional(),
});
export type FilterFlashcardQuery = z.input<typeof FilterFlashcardSchema>;
