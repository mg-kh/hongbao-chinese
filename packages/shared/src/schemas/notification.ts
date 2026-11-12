import { z } from "zod";

export const SaveNotificationTokenSchema = z.object({
  token: z.string().min(1),
});
export type SaveNotificationTokenRequest = z.input<
  typeof SaveNotificationTokenSchema
>;

export const SendNotificationSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  data: z.record(z.string(), z.string()).optional(),
});
export type SendNotificationRequest = z.input<typeof SendNotificationSchema>;
