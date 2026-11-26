import { z } from "zod";

export const CreateFeedbackSchema = z.object({
  name: z.string().trim().min(1),
  position: z.string().trim().nullish(),
  content: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5).default(5),
});
export type CreateFeedbackRequest = z.input<typeof CreateFeedbackSchema>;

export const UpdateFeedbackSchema = CreateFeedbackSchema.partial();
export type UpdateFeedbackRequest = z.input<typeof UpdateFeedbackSchema>;

/** Max feedbacks per bulk-create request. */
export const BULK_CREATE_FEEDBACK_LIMIT = 100;

/** Creates many feedbacks in one request (CSV import). */
export const BulkCreateFeedbackSchema = z.object({
  feedbacks: z
    .array(CreateFeedbackSchema)
    .min(1)
    .max(BULK_CREATE_FEEDBACK_LIMIT),
});
export type BulkCreateFeedbackRequest = z.input<
  typeof BulkCreateFeedbackSchema
>;
