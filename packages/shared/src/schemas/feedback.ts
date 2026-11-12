import { z } from "zod";

export const CreateFeedbackSchema = z.object({
  name: z.string().min(1),
  position: z.string().nullish(),
  content: z.string().min(1),
});
export type CreateFeedbackRequest = z.input<typeof CreateFeedbackSchema>;
export type UpdateFeedbackRequest = Partial<CreateFeedbackRequest>;
