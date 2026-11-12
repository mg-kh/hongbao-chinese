import { z } from "zod";

export const ValidateUserSchema = z.object({
  clerkId: z.string().min(1),
  email: z.string().min(1),
  name: z.string().min(1),
  imageUrl: z.string().nullish(),
});
export type ValidateUserRequest = z.input<typeof ValidateUserSchema>;
